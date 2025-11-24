import { db } from "../config/firebase";
import nodemailer from "nodemailer";
import twilio from "twilio";

// OTP storage interface
interface OTPData {
  otp: string;
  email?: string;
  phone?: string;
  createdAt: Date;
  expiresAt: Date;
  verified: boolean;
}

// Generate random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Email transporter setup
function getEmailTransporter() {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  
  if (!smtpUser || !smtpPass) {
    throw new Error(
      "SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS environment variables. " +
      "For Gmail, use an App Password (not your regular password). " +
      "Generate one at: https://myaccount.google.com/apppasswords"
    );
  }
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

// Twilio client setup
function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (!accountSid || !authToken) {
    throw new Error(
      "Twilio credentials not configured. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables. " +
      "Get your credentials from: https://console.twilio.com/"
    );
  }
  
  // Validate Account SID format (must start with "AC")
  if (!accountSid.startsWith("AC")) {
    throw new Error(
      `Invalid Twilio Account SID format. Account SID must start with "AC". ` +
      `Current value: "${accountSid.substring(0, 10)}...". ` +
      `Get your correct Account SID from: https://console.twilio.com/`
    );
  }
  
  // Validate Auth Token format (should be 32 characters)
  if (authToken.length !== 32) {
    throw new Error(
      `Invalid Twilio Auth Token format. Auth Token should be 32 characters long. ` +
      `Get your correct Auth Token from: https://console.twilio.com/`
    );
  }
  
  return twilio(accountSid, authToken);
}

// Store OTP in Firestore
async function storeOTP(identifier: string, otp: string, type: "email" | "phone"): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes

  const otpData: OTPData = {
    otp,
    [type]: identifier,
    createdAt: new Date(),
    expiresAt,
    verified: false,
  };

  await db.collection("otps").doc(identifier).set(otpData);
}

// Get OTP from Firestore
async function getOTP(identifier: string): Promise<OTPData | null> {
  const doc = await db.collection("otps").doc(identifier).get();
  if (!doc.exists) {
    return null;
  }
  const data = doc.data();
  return {
    otp: data?.otp,
    email: data?.email,
    phone: data?.phone,
    createdAt: data?.createdAt?.toDate(),
    expiresAt: data?.expiresAt?.toDate(),
    verified: data?.verified,
  } as OTPData;
}

// Mark OTP as verified
async function markOTPAsVerified(identifier: string): Promise<void> {
  await db.collection("otps").doc(identifier).update({ verified: true });
}

// Send email OTP
export async function sendEmailOTP(email: string): Promise<void> {
  const otp = generateOTP();
  await storeOTP(email, otp, "email");

  try {
    const transporter = getEmailTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Your OTP for Authentication",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your OTP Code</h2>
          <p>Your OTP code is: <strong style="font-size: 24px; color: #4CAF50;">${otp}</strong></p>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    // Provide helpful error messages for common issues
    if (error.code === 'EAUTH') {
      throw new Error(
        "SMTP authentication failed. For Gmail, make sure you're using an App Password, not your regular password. " +
        "Generate an App Password at: https://myaccount.google.com/apppasswords. " +
        "Also ensure 2-Step Verification is enabled on your Google account."
      );
    }
    if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      throw new Error(
        `Failed to connect to SMTP server (${process.env.SMTP_HOST || "smtp.gmail.com"}). ` +
        "Please check your SMTP_HOST and SMTP_PORT settings."
      );
    }
    throw error;
  }
}

// Send phone OTP
export async function sendPhoneOTP(phone: string): Promise<void> {
  const otp = generateOTP();
  await storeOTP(phone, otp, "phone");

  try {
    const client = getTwilioClient();
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!twilioPhone) {
      throw new Error(
        "Twilio phone number not configured. Please set TWILIO_PHONE_NUMBER environment variable. " +
        "Format: +1234567890 (E.164 format)"
      );
    }

    await client.messages.create({
      body: `Your OTP code is: ${otp}. This code will expire in 10 minutes.`,
      from: twilioPhone,
      to: phone,
    });
  } catch (error: any) {
    // Provide helpful error messages for common issues
    if (error.message && error.message.includes("accountSid must start with AC")) {
      throw new Error(
        "Invalid Twilio Account SID. Account SID must start with 'AC'. " +
        "Please check your TWILIO_ACCOUNT_SID environment variable. " +
        "Get your credentials from: https://console.twilio.com/"
      );
    }
    if (error.status === 401) {
      throw new Error(
        "Twilio authentication failed. Please check your TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN. " +
        "Get your credentials from: https://console.twilio.com/"
      );
    }
    if (error.code === 21211) {
      throw new Error(
        `Invalid phone number format: ${phone}. Phone numbers must be in E.164 format (e.g., +1234567890)`
      );
    }
    if (error.code === 21608) {
      throw new Error(
        `Invalid Twilio phone number: ${process.env.TWILIO_PHONE_NUMBER}. ` +
        "Please check your TWILIO_PHONE_NUMBER environment variable."
      );
    }
    throw error;
  }
}

// Verify OTP
export async function verifyOTP(identifier: string, otp: string, type: "email" | "phone"): Promise<boolean> {
  const otpData = await getOTP(identifier);

  if (!otpData) {
    return false;
  }

  // Check if already verified
  if (otpData.verified) {
    return false;
  }

  // Check if expired
  if (new Date() > otpData.expiresAt) {
    return false;
  }

  // Check if OTP matches
  if (otpData.otp !== otp) {
    return false;
  }

  // Mark as verified
  await markOTPAsVerified(identifier);
  return true;
}

// Clean up expired OTPs (optional utility function)
export async function cleanupExpiredOTPs(): Promise<void> {
  const now = new Date();
  const expiredOTPs = await db
    .collection("otps")
    .where("expiresAt", "<", now)
    .get();

  const batch = db.batch();
  expiredOTPs.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
}

