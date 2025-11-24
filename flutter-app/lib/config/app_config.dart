class AppConfig {
  // This will be loaded from .env file at runtime
  // For now, set your API URL here or use environment variables
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://127.0.0.1:5001/tt-auth-lib/asia-south1/api',
  );

  static String get baseUrl {
    if (apiBaseUrl.contains('YOUR_PROJECT_ID')) {
      throw Exception(
        'API_BASE_URL is not configured. Please set it using --dart-define flag:\n'
        'flutter run --dart-define=API_BASE_URL=your_api_url\n\n'
        'Or update the defaultValue in lib/config/app_config.dart'
      );
    }
    return apiBaseUrl;
  }
}

