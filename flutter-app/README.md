# TT Auth Flutter App

A Flutter application for OTP-based authentication (Email and Phone) integrated with Firebase.

## Prerequisites

- Flutter SDK (3.0.0 or higher)
- Dart SDK
- Android Studio / VS Code with Flutter extensions
- Android device/emulator or iOS device/simulator

## Setup Instructions

### 1. Install Flutter

If you haven't installed Flutter yet:

1. Download Flutter from [https://flutter.dev/docs/get-started/install](https://flutter.dev/docs/get-started/install)
2. Extract the zip file and add Flutter to your PATH
3. Verify installation:
   ```bash
   flutter doctor
   ```

### 2. Configure API Base URL

Before running the app, you need to set your Firebase Functions API URL. You have two options:

#### Option 1: Using --dart-define (Recommended)

Run the app with the API URL:
```bash
flutter run -d windows --dart-define=API_BASE_URL=http://localhost:5001/YOUR_PROJECT_ID/asia-south1/api
```

#### Option 2: Update Config File

1. Open `lib/config/app_config.dart`
2. Update the `defaultValue`:
   ```dart
   defaultValue: 'http://localhost:5001/YOUR_PROJECT_ID/asia-south1/api'
   ```

**Note:** Replace `YOUR_PROJECT_ID` with your actual Firebase project ID.

For more details, see [ENV_SETUP.md](ENV_SETUP.md).

### 3. Install Dependencies

Navigate to the `flutter-app` directory and install dependencies:

```bash
cd flutter-app
flutter pub get
```

### 4. Run the App

#### For Android:

```bash
flutter run
```

Or use Android Studio:
1. Open the `flutter-app` folder in Android Studio
2. Select a device/emulator
3. Click the Run button

#### For iOS (macOS only):

```bash
flutter run
```

Or use Xcode:
1. Open the `flutter-app` folder in Xcode
2. Select a simulator or device
3. Click the Run button

### 5. Testing on Physical Device

#### Android:
1. Enable Developer Options on your Android device
2. Enable USB Debugging
3. Connect device via USB
4. Run `flutter devices` to verify device is detected
5. Run `flutter run`

#### iOS:
1. Open the project in Xcode
2. Select your device
3. Configure signing with your Apple Developer account
4. Run the app

## App Features

- **Email OTP Authentication**: Enter email, receive OTP, verify and get Firebase UID
- **Phone OTP Authentication**: Enter phone number (E.164 format), receive OTP, verify and get Firebase UID
- **Modern UI**: Material Design 3 with clean interface
- **Error Handling**: Proper error messages and loading states

## Usage

1. Launch the app
2. Choose between Email OTP or Phone OTP
3. Enter your email/phone number
4. Click "Send OTP"
5. Enter the 6-digit OTP received
6. Click "Verify OTP"
7. View your Firebase UID on the success screen

## Phone Number Format

Phone numbers must be in E.164 format:
- Starts with `+`
- Country code followed by number
- Example: `+1234567890`, `+919876543210`

## Troubleshooting

### Build Errors

If you encounter build errors:
```bash
flutter clean
flutter pub get
flutter run
```

### Network Errors

- Ensure your backend API is running
- Check the API base URL in `api_service.dart`
- Verify CORS settings in backend
- Check internet connection

### OTP Not Received

- For Email: Check spam folder, verify SMTP configuration in backend
- For Phone: Verify Twilio configuration in backend, check phone number format

## Project Structure

```
lib/
├── main.dart              # App entry point
├── screens/
│   ├── otp_screen.dart    # Email OTP screen
│   ├── phone_otp_screen.dart  # Phone OTP screen
│   └── home_screen.dart   # Success screen
└── services/
    └── api_service.dart   # API service for backend calls
```

## Dependencies

- `http`: For making API calls
- `provider`: For state management
- `shared_preferences`: For local storage (if needed in future)

## Notes

- Make sure your backend Firebase Functions are deployed or running locally
- The app requires internet connection to communicate with the backend
- OTP expires in 10 minutes (configured in backend)

