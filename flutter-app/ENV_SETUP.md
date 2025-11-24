# Environment Configuration Guide

The Flutter app uses compile-time environment variables for configuration. The API base URL can be set using `--dart-define` flag or by updating the default value in the config file.

## Method 1: Using --dart-define (Recommended)

Run the app with the API URL as a compile-time constant:

**For Local Development:**
```bash
flutter run -d windows --dart-define=API_BASE_URL=http://localhost:5001/YOUR_PROJECT_ID/asia-south1/api
```

**For Production:**
```bash
flutter run -d chrome --dart-define=API_BASE_URL=https://asia-south1-YOUR_PROJECT_ID.cloudfunctions.net/api
```

**For Web (Chrome/Edge) - If localhost doesn't work:**
```bash
flutter run -d chrome --dart-define=API_BASE_URL=http://192.168.1.XXX:5001/YOUR_PROJECT_ID/asia-south1/api
```

## Method 2: Update Config File Directly

1. Open `lib/config/app_config.dart`
2. Update the `defaultValue` in the `apiBaseUrl` constant:

```dart
static const String apiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:5001/YOUR_PROJECT_ID/asia-south1/api', // Update this
);
```

**Important:** Replace `YOUR_PROJECT_ID` with your actual Firebase project ID.

## How It Works

1. The app reads `API_BASE_URL` from compile-time constants (`--dart-define`)
2. If not provided, it uses the `defaultValue` from `app_config.dart`
3. The `ApiService` uses `AppConfig.baseUrl` to get the API URL
4. If the URL contains `YOUR_PROJECT_ID`, the app will throw an error

## Troubleshooting

### Error: "API_BASE_URL is not configured"

- Make sure you're passing `--dart-define=API_BASE_URL=your_url` when running
- Or update the `defaultValue` in `lib/config/app_config.dart`
- Ensure the URL doesn't contain `YOUR_PROJECT_ID` (replace it with your actual project ID)

### CORS Errors (Web Only)

If running on web and getting CORS errors:
1. Use your machine's IP address instead of `localhost` in the API URL
2. Or configure CORS in your backend to allow your web origin

To find your IP address on Windows:
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

## Example Usage

**Windows Desktop:**
```bash
flutter run -d windows --dart-define=API_BASE_URL=http://localhost:5001/my-project/asia-south1/api
```

**Chrome (Web):**
```bash
flutter run -d chrome --dart-define=API_BASE_URL=http://localhost:5001/my-project/asia-south1/api
```

**With IP address (for web if localhost doesn't work):**
```bash
flutter run -d chrome --dart-define=API_BASE_URL=http://192.168.1.100:5001/my-project/asia-south1/api
```

