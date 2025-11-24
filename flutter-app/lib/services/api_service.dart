import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../config/app_config.dart';

class ApiService extends ChangeNotifier {
  String get baseUrl => AppConfig.baseUrl;
  
  String? _firebaseUid;
  bool _isLoading = false;
  String? _errorMessage;

  String? get firebaseUid => _firebaseUid;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String? error) {
    _errorMessage = error;
    notifyListeners();
  }

  void _setUid(String? uid) {
    _firebaseUid = uid;
    notifyListeners();
  }

  // Send OTP to email
  Future<bool> sendEmailOTP(String email) async {
    _setLoading(true);
    _setError(null);

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/send-otp/email'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email}),
      );

      _setLoading(false);

      if (response.statusCode == 200) {
        return true;
      } else {
        final errorData = json.decode(response.body);
        _setError(errorData['error'] ?? 'Failed to send OTP');
        return false;
      }
    } catch (e) {
      _setLoading(false);
      _setError('Network error: ${e.toString()}');
      return false;
    }
  }

  // Send OTP to phone
  Future<bool> sendPhoneOTP(String phone) async {
    _setLoading(true);
    _setError(null);

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/send-otp/phone'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'phone': phone}),
      );

      _setLoading(false);

      if (response.statusCode == 200) {
        return true;
      } else {
        final errorData = json.decode(response.body);
        _setError(errorData['error'] ?? 'Failed to send OTP');
        return false;
      }
    } catch (e) {
      _setLoading(false);
      _setError('Network error: ${e.toString()}');
      return false;
    }
  }

  // Verify email OTP
  Future<bool> verifyEmailOTP(String email, String otp) async {
    _setLoading(true);
    _setError(null);

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/verify-otp/email'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email, 'otp': otp}),
      );

      _setLoading(false);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _setUid(data['uid']);
        return true;
      } else {
        final errorData = json.decode(response.body);
        _setError(errorData['error'] ?? 'Failed to verify OTP');
        return false;
      }
    } catch (e) {
      _setLoading(false);
      _setError('Network error: ${e.toString()}');
      return false;
    }
  }

  // Verify phone OTP
  Future<bool> verifyPhoneOTP(String phone, String otp) async {
    _setLoading(true);
    _setError(null);

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/verify-otp/phone'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'phone': phone, 'otp': otp}),
      );

      _setLoading(false);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _setUid(data['uid']);
        return true;
      } else {
        final errorData = json.decode(response.body);
        _setError(errorData['error'] ?? 'Failed to verify OTP');
        return false;
      }
    } catch (e) {
      _setLoading(false);
      _setError('Network error: ${e.toString()}');
      return false;
    }
  }

  void reset() {
    _firebaseUid = null;
    _errorMessage = null;
    _isLoading = false;
    notifyListeners();
  }
}

