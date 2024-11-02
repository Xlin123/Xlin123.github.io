import 'package:backend/utils/encryption.dart';

/// Represents a default request.
class DefaultRequest {
  /// The payload of the request.
  String payload;

  /// The public key of the request.
  dynamic publicKey;

  /// Signature of the request.
  String signature;

  /// Creates a new instance of [DefaultRequest].
  ///
  /// The [payload], [publicKey], and [signature] parameters are required.
  /// ex.
  ///
  /// {
  ///
  ///   payload: "base64"
  ///
  ///   publickey: "base64--> rsapem"
  ///
  ///   signature: "base64"
  ///
  /// }
  factory DefaultRequest.fromJson(Map<dynamic, dynamic> json) {
    return DefaultRequest(
      payload: json['payload'] as String,
      publicKey: json['publicKey'],
      signature: json['signature'] as String,
    );
  }

  /// Retrieves the payload of the request.
  ///
  /// Returns a map containing the payload.
  Map<String, dynamic> getDecryptedPayload() {
    return Encryption.decrypt(payload);
  }

  /// Creates a new instance of [DefaultRequest].
  ///
  /// The [payload] and [publicKey] parameters are required.
  DefaultRequest({
    required this.payload,
    required this.publicKey,
    required this.signature,
  });
}
