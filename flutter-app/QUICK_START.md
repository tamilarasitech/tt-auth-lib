# Quick Start Guide - Running the Flutter App

## Available Platforms

Your Flutter app now supports:
- **Windows Desktop** - Native Windows application
- **Chrome (Web)** - Run in browser
- **Edge (Web)** - Run in browser

## Running the App

### Option 1: Run on Windows Desktop
```bash
flutter run -d windows
```

### Option 2: Run on Chrome (Web)
```bash
flutter run -d chrome
```

### Option 3: Run on Edge (Web)
```bash
flutter run -d edge
```

### Option 4: Let Flutter Choose
```bash
flutter run
```
(Flutter will prompt you to select a device)

## Important: Configure API URL First!

Before running, you **must** configure the API URL. You have two options:

### Option 1: Using --dart-define (Recommended)

Run with the API URL as a parameter:

**Windows Desktop:**
```bash
flutter run -d windows --dart-define=API_BASE_URL=http://localhost:5001/YOUR_PROJECT_ID/asia-south1/api
```

**Web (Chrome/Edge):**
```bash
# Option 1: Use localhost (if CORS is configured)
flutter run -d chrome --dart-define=API_BASE_URL=http://localhost:5001/YOUR_PROJECT_ID/asia-south1/api

# Option 2: Use your machine's IP (if localhost doesn't work)
flutter run -d chrome --dart-define=API_BASE_URL=http://192.168.1.XXX:5001/YOUR_PROJECT_ID/asia-south1/api
```

**Production:**
```bash
flutter run -d chrome --dart-define=API_BASE_URL=https://asia-south1-YOUR_PROJECT_ID.cloudfunctions.net/api
```

### Option 2: Update Config File

1. Open `lib/config/app_config.dart`
2. Update the `defaultValue` with your API URL

**Note:** Replace `YOUR_PROJECT_ID` with your actual Firebase project ID.

For more details, see [ENV_SETUP.md](ENV_SETUP.md).

## Troubleshooting

### CORS Issues (Web Only)

If you get CORS errors when running on web, make sure your backend has CORS configured to allow your web origin. In `backend/src/index.ts`, the CORS is already configured, but you may need to add specific origins:

```typescript
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
  })
);
```

Set `ALLOWED_ORIGINS` environment variable:
```bash
ALLOWED_ORIGINS=http://localhost:XXXX,http://127.0.0.1:XXXX
```
(Replace XXXX with your Flutter web port, usually shown when you run `flutter run -d chrome`)

### Network Connection Issues

- **Windows Desktop**: Use `localhost` or `127.0.0.1`
- **Web**: May need to use your machine's local IP address instead of `localhost`
- Ensure your backend is running before starting the Flutter app

### Finding Your Machine's IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

## Testing the App

1. Start your backend first:
   ```bash
   cd ../backend
   npm run serve
   ```

2. Update the API URL in `api_service.dart`

3. Run the Flutter app:
   ```bash
   flutter run -d windows
   # or
   flutter run -d chrome
   ```

4. Test the OTP flow:
   - Select Email OTP or Phone OTP
   - Enter email/phone
   - Send OTP
   - Verify OTP
   - View Firebase UID

## Hot Reload

While the app is running, you can:
- Press `r` to hot reload
- Press `R` to hot restart
- Press `q` to quit

