import 'dart:async';

import 'package:dart_frog_web_socket/dart_frog_web_socket.dart';

class Heartbeat {
  final Duration interval;
  final WebSocketChannel websocket;
  Timer? timer;
  bool dead = false;

  Heartbeat(this.interval, this.websocket);

  void start() {
    timer = Timer.periodic(interval, (timer) {
      if (dead) {
        stop();
      } else {
        websocket.sink.add('noop');
        dead = true;
      }
    });
  }

  void stop() {
    timer?.cancel();
  }
}
