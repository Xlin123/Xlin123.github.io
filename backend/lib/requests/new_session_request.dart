import 'package:backend/requests/default_request.dart';
import 'package:uuid/uuid.dart';

/// Represents a session request.
class NewSessionRequest {
  /// The passcode for the session.
  String code;

  /// The username associated with the session.
  String username;

  /// The unique identifier for the session.
  String id;

  /// The public key for the session.
  String publicKey;

  /// VM type
  String vmType;

  /// Creates a new instance of [NewSessionRequest].
  ///
  /// The [code] parameter represents the passcode for the session.
  /// The [username] parameter represents the username associated with the session.
  /// The [id] parameter represents the unique identifier for the session.
  /// The [publicKey] parameter represents the public key for the session.
  NewSessionRequest(
      {required this.code,
      required this.username,
      required this.id,
      required this.publicKey,
      required this.vmType});

  /// Creates a [NewSessionRequest] from a [DefaultRequest] object.
  ///
  /// The [request] parameter represents the [DefaultRequest] object to create the [NewSessionRequest] from.
  /// The [request] object must contain the 'code' and 'username' fields in its payload.
  factory NewSessionRequest.fromDefaultRequest(DefaultRequest request) {
    final payload = request.getDecryptedPayload();
    return NewSessionRequest(
      code: payload['code'] as String,
      username: payload['username'] as String,
      id: Uuid().v4(),
      publicKey: request.publicKey as String,
      vmType: payload['vmType'] as String,
    );
  }
}
