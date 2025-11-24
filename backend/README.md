# TT Donation Management - Backend API

Firebase Cloud Functions backend for payment processing and notifications.

## Features

- **OTP Authentication**: Email and Phone OTP-based authentication
- **Payment API**: Razorpay integration for donation payments
- **Notification API**: Email, SMS, and WhatsApp notifications
- **Receipt Generation**: PDF receipt generation for donations
- **Webhook Handling**: Payment webhook processing

## Prerequisites

- Node.js 22+
- Firebase CLI
- Firebase project with Functions enabled
- Razorpay account
- SMTP credentials (Gmail, SendGrid, etc.)
- Twilio account (for SMS/WhatsApp)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:

   **Option A: Using `.env` file (for local development)**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```
   
   **Important for Gmail SMTP:**
   - You MUST use a Gmail App Password, not your regular password
   - Enable 2-Step Verification on your Google account
   - Generate an App Password at: https://myaccount.google.com/apppasswords
   - Use the generated 16-character password (no spaces) as `SMTP_PASS`

   **Important for Twilio:**
   - Get your credentials from: https://console.twilio.com/
   - `TWILIO_ACCOUNT_SID` must start with "AC" (e.g., ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)
   - `TWILIO_AUTH_TOKEN` should be 32 characters long
   - `TWILIO_PHONE_NUMBER` must be in E.164 format (e.g., +1234567890)

   **Option B: Using Firebase Functions config (for production)**
   ```bash
   firebase functions:config:set \
     razorpay.key_id="YOUR_RAZORPAY_KEY_ID" \
     razorpay.key_secret="YOUR_RAZORPAY_KEY_SECRET" \
     razorpay.webhook_secret="YOUR_WEBHOOK_SECRET" \
     smtp.host="smtp.gmail.com" \
     smtp.port="587" \
     smtp.user="YOUR_EMAIL" \
     smtp.pass="YOUR_APP_PASSWORD" \
     smtp.from="YOUR_EMAIL" \
     twilio.account_sid="YOUR_TWILIO_SID" \
     twilio.auth_token="YOUR_TWILIO_TOKEN" \
     twilio.phone_number="YOUR_TWILIO_PHONE" \
     twilio.whatsapp_number="YOUR_WHATSAPP_NUMBER"
   ```

3. Copy `key.json` to the backend directory (Firebase service account key)

## Development

Run locally with Firebase Emulators:
```bash
npm run serve
```

## Deployment

Deploy to Firebase:
```bash
npm run deploy
```

## API Endpoints

### Authentication (OTP)

- `POST /api/auth/send-otp/email` - Send OTP to email
  - Body: `{ "email": "user@example.com" }`
  - Response: `{ "success": true, "message": "OTP sent to email successfully" }`

- `POST /api/auth/send-otp/phone` - Send OTP to phone
  - Body: `{ "phone": "+1234567890" }` (E.164 format)
  - Response: `{ "success": true, "message": "OTP sent to phone successfully" }`

- `POST /api/auth/verify-otp/email` - Verify email OTP and get Firebase UID
  - Body: `{ "email": "user@example.com", "otp": "123456" }`
  - Response: `{ "success": true, "uid": "firebase-uid", "message": "OTP verified successfully" }`

- `POST /api/auth/verify-otp/phone` - Verify phone OTP and get Firebase UID
  - Body: `{ "phone": "+1234567890", "otp": "123456" }`
  - Response: `{ "success": true, "uid": "firebase-uid", "message": "OTP verified successfully" }`

### Payment

- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment and create donation
- `POST /api/payment/webhook` - Razorpay webhook handler

### Notifications

- `POST /api/notifications/send-email` - Send email
- `POST /api/notifications/send-sms` - Send SMS
- `POST /api/notifications/send-whatsapp` - Send WhatsApp
- `POST /api/notifications/donation-confirmation` - Send donation confirmation
- `POST /api/notifications/campaign-request-update` - Send campaign request update
- `GET /api/notifications/history` - Get notification history

## Environment Variables

Required environment variables:
- `RAZORPAY_KEY_ID`: Razorpay key ID
- `RAZORPAY_KEY_SECRET`: Razorpay key secret
- `RAZORPAY_WEBHOOK_SECRET`: Razorpay webhook secret
- `SMTP_HOST`: SMTP server host (default: smtp.gmail.com)
- `SMTP_PORT`: SMTP server port (default: 587)
- `SMTP_USER`: SMTP username (your Gmail address)
- `SMTP_PASS`: **For Gmail: Use an App Password, not your regular password** (generate at https://myaccount.google.com/apppasswords)
- `SMTP_FROM`: From email address
- `TWILIO_ACCOUNT_SID`: Twilio account SID (must start with "AC", get from https://console.twilio.com/)
- `TWILIO_AUTH_TOKEN`: Twilio auth token (32 characters, get from https://console.twilio.com/)
- `TWILIO_PHONE_NUMBER`: Twilio phone number (E.164 format, e.g., +1234567890)
- `TWILIO_WHATSAPP_NUMBER`: Twilio WhatsApp number (format: whatsapp:+1234567890)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS

## Project Structure

```
src/
├── config/          # Configuration files
│   ├── firebase.ts  # Firebase Admin initialization
│   ├── razorpay.ts  # Razorpay client
│   ├── email.ts     # Email transporter
│   └── sms.ts       # Twilio client
├── services/        # Business logic
│   ├── otp.service.ts        # OTP generation and verification
│   ├── payment.service.ts
│   ├── notification.service.ts
│   └── receipt.service.ts
├── routes/          # API routes
│   ├── auth.routes.ts        # OTP authentication routes
│   ├── payment.routes.ts
│   └── notification.routes.ts
└── index.ts         # Main entry point
```

## Notes

- OTPs are stored in Firestore collection `otps` and expire in 10 minutes
- OTP verification creates or retrieves Firebase Auth users and returns their UID
- Phone numbers must be in E.164 format (e.g., +1234567890)
- Receipts are stored in Firebase Storage under `receipts/` folder
- Donations are created in Firestore collection `data/donation/donations`
- Campaign raised amounts are updated atomically using Firestore increments
- Notifications are logged in `data/donation/notifications` collection

