import 'dart:convert';
import 'dart:io';
import 'package:backend/requests/default_request.dart';
import 'package:backend/requests/ws_request.dart';
import 'package:backend/session_manager.dart';
import 'package:backend/utils/encryption.dart';
import 'package:dart_frog/dart_frog.dart';
import 'package:dart_frog_web_socket/dart_frog_web_socket.dart';
import 'package:encrypt/encrypt.dart';

bool initialized = false;
Process? process; // Declare process as nullable

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
  chan.stream.listen((data) async {
    Key? channelKey;
    var message = data.toString();
    if (!initialized) {
      if (message.contains("init")) {
        try {
          var map = jsonDecode(message);
          var decode = map["init"] as Map<String, dynamic>;
          var webReq = WebSocketRequest.fromDefaultRequest(
              DefaultRequest.fromJson(decode));
          process = await _initializeProcess(webReq);
          initialized = true;
          channelKey = webReq.chanKey;
          process!.stdout.transform(utf8.decoder).listen((event) {
            //would like to turn into a stream transformer
            chan.sink.add(Encryption.encryptChannel(webReq.chanKey, event));
          });
          process!.stderr.transform(utf8.decoder).listen((event) {
            chan.sink.add(Encryption.encryptChannel(webReq.chanKey, event));
          });
        } on FormatException {
          chan.sink.add("Invalid intitialization payload");
        } catch (e) {
          chan.sink.add("Unauthorized");
        }
      } else {
        chan.sink.add("Invalid command");
      }
    } else {
      var decrypted = Encryption.decryptChannel(channelKey!, message);
      process!.stdin.writeln(decrypted);
    }
  });
}

Future<Process> _initializeProcess(WebSocketRequest webReq) async {
  if (SessionManager.isAuthenticated(webReq.id)) {
    return await Process.start('sshnp', webReq.args,
        mode: ProcessStartMode.detachedWithStdio);
  } else {
    throw const FormatException('Unauthorized');
  }
}
