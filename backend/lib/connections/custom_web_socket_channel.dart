import 'dart:convert';
import 'dart:io';

import 'package:backend/requests/ws_request.dart';
import 'package:backend/session_manager.dart';
import 'package:backend/utils/encryption.dart';
import 'package:backend/utils/heartbeat.dart';
import 'package:encrypt/encrypt.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

class CustomWebSocketChannel {
  final WebSocketChannel channel;
  WebsocketStatus status = WebsocketStatus.uninitialized;
  Process? process;
  Heartbeat? heartbeat;
  Key? channelKey;
  CustomWebSocketChannel(this.channel);

  Future<CustomWebSocketChannel> init(WebSocketRequest webReq) async {
    status = WebsocketStatus.connected;
    heartbeat = Heartbeat(const Duration(seconds: 5), channel);
    heartbeat!.start();
    channelKey = webReq.chanKey;
    try {
      process = await _initializeProcess(webReq);
      process!.stdout.transform(utf8.decoder).listen((event) {
        //would like to turn into a stream transformer
        channel.sink.add(Encryption.encryptChannel(webReq.chanKey, event));
      });
      process!.stderr.transform(utf8.decoder).listen((event) {
        channel.sink.add(Encryption.encryptChannel(webReq.chanKey, event));
      });
    } on FormatException catch (e) {
      channel.sink.add(Encryption.encryptChannel(webReq.chanKey, e.toString()));
      status = WebsocketStatus.disconnected;
    } catch (e) {
      channel.sink.add(Encryption.encryptChannel(webReq.chanKey, e.toString()));
      status = WebsocketStatus.disconnected;
      rethrow;
    }
    return this;
  }

  Future<Process> _initializeProcess(WebSocketRequest webReq) async {
    if (SessionManager.isAuthenticated(webReq.id)) {
      return await Process.start('sshnp', webReq.args,
          mode: ProcessStartMode.detachedWithStdio);
    } else {
      throw const FormatException('Unauthorized');
    }
  }

  void stop() {
    heartbeat!.stop();
    process!.kill();
    channel.sink.close();
    status = WebsocketStatus.disconnected;
  }

  bool isAlive() {
    return heartbeat!.timer!.isActive;
  }
}

enum WebsocketStatus {
  /// The websocket is uninitialized.
  uninitialized,

  /// The websocket is disconnected.
  disconnected,

  /// The websocket is connecting.
  connecting,

  /// The websocket is connected.
  connected,
}
