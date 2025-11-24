import express from "express";
import { sendEmailOTP, sendPhoneOTP, verifyOTP } from "../services/otp.service";
import { auth } from "../config/firebase";

const router = express.Router();

// Send OTP to email
router.post("/send-otp/email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    await sendEmailOTP(email);

    res.json({
      success: true,
      message: "OTP sent to email successfully",
    });
  } catch (error: any) {
    console.error("Error sending email OTP:", error);
    res.status(500).json({
      error: "Failed to send OTP",
      message: error.message,
    });
  }
});

// Send OTP to phone
router.post("/send-otp/phone", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    // Basic phone validation (E.164 format)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        error: "Invalid phone format. Please use E.164 format (e.g., +1234567890)",
      });
    }

    await sendPhoneOTP(phone);

    res.json({
      success: true,
      message: "OTP sent to phone successfully",
    });
  } catch (error: any) {
    console.error("Error sending phone OTP:", error);
    res.status(500).json({
      error: "Failed to send OTP",
      message: error.message,
    });
  }
});

// Verify OTP and return Firebase UID
router.post("/verify-otp/email", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const isValid = await verifyOTP(email, otp, "email");

    if (!isValid) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Get or create Firebase user
    let user;
    try {
      user = await auth.getUserByEmail(email);
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        // Create new user
        user = await auth.createUser({
          email: email,
          emailVerified: true,
        });
      } else {
        throw error;
      }
    }

    res.json({
      success: true,
      uid: user.uid,
      message: "OTP verified successfully",
    });
  } catch (error: any) {
    console.error("Error verifying email OTP:", error);
    res.status(500).json({
      error: "Failed to verify OTP",
      message: error.message,
    });
  }
});

// Verify OTP for phone and return Firebase UID
router.post("/verify-otp/phone", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ error: "Phone and OTP are required" });
    }

    const isValid = await verifyOTP(phone, otp, "phone");

    if (!isValid) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Get or create Firebase user
    let user;
    try {
      user = await auth.getUserByPhoneNumber(phone);
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        // Create new user
        user = await auth.createUser({
          phoneNumber: phone,
        });
      } else {
        throw error;
      }
    }

    res.json({
      success: true,
      uid: user.uid,
      message: "OTP verified successfully",
    });
  } catch (error: any) {
    console.error("Error verifying phone OTP:", error);
    res.status(500).json({
      error: "Failed to verify OTP",
      message: error.message,
    });
  }
});

export default router;

