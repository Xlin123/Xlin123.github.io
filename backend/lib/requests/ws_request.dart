import 'dart:io';

import 'package:backend/requests/default_request.dart';
import 'package:encrypt/encrypt.dart';
import 'package:uuid/uuid.dart';

/// Represents a websocket request.
class WebSocketRequest {
  /// The username associated with the session.
  String username;

  /// The unique identifier for the session.
  String id;

  List<String> args;

  /// AES Key for encrypted channel
  Key chanKey;

  /// Creates a new instance of [WebSocketRequest].
  ///
  /// This file contains the implementation of the WebSocket request class.
  /// The WebSocket request class is responsible for handling WebSocket requests
  /// and managing the communication with the WebSocket server.
  WebSocketRequest({
    required this.username,
    required this.id,
    required this.chanKey,
    required this.args,
  });

  /// Creates a [WebSocketRequest] from a [DefaultRequest] object.
  ///
  /// The [request] parameter represents the [DefaultRequest] object to create the [WebSocketRequest] from.
  /// The [request] object must contain the 'username', 'id', 'args' and 'chanKey' fields in its payload.
  ///
  /// ex.
  ///
  /// payload:
  /// {
  ///   username : "username"
  ///   id : "id"
  ///   chanKey : "base64"
  ///   args : "args"
  /// }
  factory WebSocketRequest.fromDefaultRequest(DefaultRequest request) {
    final payload = request.getDecryptedPayload();
    return WebSocketRequest(
      username: payload['username'] as String,
      id: payload['id'] as String,
      chanKey: Key.fromBase64(payload['chanKey'] as String),
      args: payload['args'].toString().split(" "),
    );
  }
}
