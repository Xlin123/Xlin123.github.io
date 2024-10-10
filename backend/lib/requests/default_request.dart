import 'package:backend/utils/encryption.dart';
import 'package:encrypt/encrypt.dart';

/// Represents a default request.
class DefaultRequest {
  /// The payload of the request.
  String payload;

  /// The initialization vector (IV) of the request.
  String iv;

  /// The public key of the request.
  dynamic publicKey;

  /// Creates a new instance of [DefaultRequest].
  ///
  /// The [payload], [iv], and [publicKey] parameters are required.
  /// ex.
  ///
  /// {
  ///
  ///   payload: "base64"
  ///
  ///   iv: "base64"
  ///
  ///   publickey: "base64--> rsapem"
  ///
  /// }
  factory DefaultRequest.fromJson(Map<dynamic, dynamic> json) {
    return DefaultRequest(
      payload: json['payload'] as String,
      iv: json['iv'] as String,
      publicKey: json['publicKey'],
    );
  }

  /// Retrieves the payload of the request.
  ///
  /// Returns a map containing the payload.
  Map<String, dynamic> getDecryptedPayload() {
    return Encryption.decrypt(payload, IV.fromBase64(iv));
  }

  /// Creates a new instance of [DefaultRequest].
  ///
  /// The [payload], [iv], and [publicKey] parameters are required.
  DefaultRequest({
    required this.payload,
    required this.iv,
    required this.publicKey,
  });
}
