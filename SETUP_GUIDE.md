# Complete Setup Guide - OTP Authentication

This guide will help you set up and run both the backend and Flutter app for OTP authentication.

## Backend Setup

### 1. Install Dependencies

```bash
cd tt-auth-lib/backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory or set Firebase Functions config:

**Required for Email OTP:**
- `SMTP_HOST`: SMTP server (e.g., `smtp.gmail.com`)
- `SMTP_PORT`: SMTP port (e.g., `587`)
- `SMTP_USER`: Your email address
- `SMTP_PASS`: Your email password or app-specific password
- `SMTP_FROM`: From email address

**Required for Phone OTP:**
- `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
- `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token
- `TWILIO_PHONE_NUMBER`: Your Twilio phone number (E.164 format)

**Optional:**
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS (e.g., `http://localhost:3000,https://yourdomain.com`)

### 3. Firebase Service Account

Ensure `key.json` (Firebase service account key) is in the `backend` directory.

### 4. Build the Backend

```bash
npm run build
```

### 5. Run Backend Locally

```bash
npm run serve
```

This will start Firebase emulators. Your API will be available at:
- Local: `http://localhost:5001/YOUR_PROJECT_ID/asia-south1/api`

### 6. Deploy Backend (Optional)

```bash
npm run deploy
```

After deployment, your API will be available at:
- Production: `https://asia-south1-YOUR_PROJECT_ID.cloudfunctions.net/api`

## Flutter App Setup

### 1. Install Flutter

If you haven't installed Flutter:
- Download from [https://flutter.dev/docs/get-started/install](https://flutter.dev/docs/get-started/install)
- Follow installation instructions for your OS
- Verify: `flutter doctor`

### 2. Configure API URL

Open `flutter-app/lib/services/api_service.dart` and update the `baseUrl`:

**For Local Development:**
```dart
static const String baseUrl = 'http://localhost:5001/YOUR_PROJECT_ID/asia-south1/api';
```

**For Production:**
```dart
static const String baseUrl = 'https://asia-south1-YOUR_PROJECT_ID.cloudfunctions.net/api';
```

**Note:** Replace `YOUR_PROJECT_ID` with your actual Firebase project ID.

### 3. Install Flutter Dependencies

```bash
cd tt-auth-lib/flutter-app
flutter pub get
```

### 4. Run Flutter App

#### Android:
```bash
flutter run
```

#### iOS (macOS only):
```bash
flutter run
```

#### Specific Device:
```bash
# List available devices
flutter devices

# Run on specific device
flutter run -d <device-id>
```

## Testing the Application

### Email OTP Flow:

1. Open the Flutter app
2. Click "Email OTP"
3. Enter your email address
4. Click "Send OTP"
5. Check your email for the 6-digit OTP
6. Enter the OTP
7. Click "Verify OTP"
8. View your Firebase UID on the success screen

### Phone OTP Flow:

1. Open the Flutter app
2. Click "Phone OTP"
3. Enter your phone number in E.164 format (e.g., `+1234567890`)
4. Click "Send OTP"
5. Check your phone for the SMS with 6-digit OTP
6. Enter the OTP
7. Click "Verify OTP"
8. View your Firebase UID on the success screen

## Troubleshooting

### Backend Issues

**OTP not sending:**
- Check SMTP credentials for email OTP
- Check Twilio credentials for phone OTP
- Verify environment variables are set correctly
- Check Firebase Functions logs: `firebase functions:log`

**Build errors:**
```bash
cd backend
npm run build
# Check for TypeScript errors
```

### Flutter Issues

**Network errors:**
- Verify API base URL is correct
- Check if backend is running
- For Android emulator, use `10.0.2.2` instead of `localhost`
- For iOS simulator, use `localhost` or your machine's IP

**Build errors:**
```bash
cd flutter-app
flutter clean
flutter pub get
flutter run
```

**OTP not received:**
- Email: Check spam folder, verify SMTP settings
- Phone: Verify Twilio account, check phone number format (must be E.164)

### Android Emulator Network Issue

If running Flutter on Android emulator and backend on localhost, update the API URL:
```dart
static const String baseUrl = 'http://10.0.2.2:5001/YOUR_PROJECT_ID/asia-south1/api';
```

### iOS Simulator Network Issue

For iOS simulator, you can use:
- `localhost` (if backend is on same machine)
- Your machine's local IP address (e.g., `http://192.168.1.100:5001/...`)

## API Endpoints Summary

### Send Email OTP
```
POST /api/auth/send-otp/email
Body: { "email": "user@example.com" }
```

### Send Phone OTP
```
POST /api/auth/send-otp/phone
Body: { "phone": "+1234567890" }
```

### Verify Email OTP
```
POST /api/auth/verify-otp/email
Body: { "email": "user@example.com", "otp": "123456" }
Response: { "success": true, "uid": "firebase-uid" }
```

### Verify Phone OTP
```
POST /api/auth/verify-otp/phone
Body: { "phone": "+1234567890", "otp": "123456" }
Response: { "success": true, "uid": "firebase-uid" }
```

## Next Steps

- Customize the UI in Flutter screens
- Add additional authentication methods
- Implement token storage for persistent sessions
- Add error handling and retry logic
- Implement OTP resend functionality

## Support

For issues or questions:
1. Check the README files in `backend/` and `flutter-app/`
2. Review Firebase Functions logs
3. Check Flutter console output
4. Verify all environment variables are set correctly

