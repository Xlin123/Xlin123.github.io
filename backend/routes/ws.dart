import 'dart:convert';
import 'dart:io';
import 'package:backend/authorized_session.dart';
import 'package:backend/connections/custom_web_socket_channel.dart';
import 'package:backend/requests/default_request.dart';
import 'package:backend/requests/ws_request.dart';
import 'package:backend/session_manager.dart';
import 'package:backend/utils/encryption.dart';
import 'package:backend/utils/heartbeat.dart';
import 'package:dart_frog/dart_frog.dart';
import 'package:dart_frog_web_socket/dart_frog_web_socket.dart';
import 'package:encrypt/encrypt.dart';

List<AuthorizedSession> _activeSessions = <AuthorizedSession>[];

/// Handles WebSocket connections
///
/// requires websocket to initialize the connection with valid args
///
/// format::
/// {
/// "init": {
///       payload: "contains the args for the sshnp command"
///       iv: ""
///       publicKey: ""
///    }
/// }
///

/// throws FormatException if the user is not authenticated
Future<Response> onRequest(RequestContext context) async {
  // Spawn the subprocess
  final handler = webSocketHandler(_onConnection);
  return handler(context);
}

void _onConnection(WebSocketChannel chan, String? protocol) {
  AuthorizedSession? activeSession;
  chan.stream.listen((data) async {
    var message = data.toString();
    if (activeSession != null &&
        activeSession?.channel?.status == WebsocketStatus.connected &&
        !activeSession!.channel!.isAlive()) {
      activeSession?.channel?.stop();
      return;
    }
    if (message.contains('stop')) {
      activeSession?.channel?.stop();
      _activeSessions.remove(activeSession);
      return;
    } else if (message.contains('noop:ok')) {
      activeSession!.channel!.heartbeat!.dead = false;
    } else if (message.contains("init")) {
      try {
        var map = jsonDecode(message);
        var decode = jsonDecode(map['init'] as String) as Map<String, dynamic>;
        var webReq = WebSocketRequest.fromDefaultRequest(
            DefaultRequest.fromJson(decode));
        if (AuthorizedSession.containsSessionWithId(
            _activeSessions, webReq.id)) {
          chan.sink.add("Unauthorized Access Request: Session already exists");
        } else {
          activeSession = SessionManager.getSession(webReq.id);
          activeSession?.connectWebSocket(chan, webReq);
          _activeSessions.add(activeSession!);
        }
      } catch (e) {
        chan.sink.add("Invalid initialization payload");
      }
    } else if (activeSession != null &&
        activeSession?.channel!.status == WebsocketStatus.connected) {
      try {
        if (activeSession != null) {
          var decrypted = Encryption.decryptChannel(
              activeSession!.channel!.channelKey!, message);
          activeSession?.channel!.process!.stdin.writeln(decrypted);
        }
      } catch (e) {
        if (activeSession?.channel == null) {
          throw Exception("Channel not initialized");
        }
        activeSession!.channel!.channel.sink.add("Invalid message: $e");
        activeSession!.channel!.stop();
        SessionManager.closeSession(activeSession!);
        activeSession!.channel!.status = WebsocketStatus.disconnected;
      }
    }
  });
}
