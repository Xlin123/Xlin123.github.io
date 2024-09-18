import 'package:backend/shared/default_request.dart';
import 'package:uuid/uuid.dart';

/// Represents a session request.
class SessionRequest {
  /// The passcode for the session.
  String? code;

  /// The username associated with the session.
  String? username;

  /// The unique identifier for the session.
  String? id;

  /// The public key for the session.
  String? publicKey;

  /// Creates a new instance of [SessionRequest].
  ///
  /// The [code] parameter represents the passcode for the session.
  /// The [username] parameter represents the username associated with the session.
  /// The [id] parameter represents the unique identifier for the session.
  /// The [publicKey] parameter represents the public key for the session.
  SessionRequest({this.code, this.username, this.id, this.publicKey});

  /// Creates a [SessionRequest] from a [DefaultRequest] object.
  ///
  /// The [request] parameter represents the [DefaultRequest] object to create the [SessionRequest] from.
  /// The [request] object must contain the 'code' and 'username' fields in its payload.
  factory SessionRequest.fromDefaultRequest(DefaultRequest request) {
    final payload = request.getDecryptedPayload();
    return SessionRequest(
      code: payload['code'] as String?,
      username: payload['username'] as String?,
      id: Uuid().v4(),
      publicKey: request.publicKey as String,
    );
  }
}
