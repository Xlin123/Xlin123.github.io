import 'dart:io';
import 'package:backend/shared/authorized_session.dart';

class Connection {
  Connection({this.ip, this.port, this.username, this.role});
  String? ip;
  int? port;
  String? username;
  Role? role;
  ServerSocket? socket;

  static Future<Connection> fromRequest(ConnectionRequest request) async {
    return Connection(
      ip: getMachineIp(),
      port: 0,
      username: request.username,
      role: request.role,
    );
  }

  static String? getMachineIp() => InternetAddress.anyIPv4.address;

  Future<void> tryOpenConnection() async {
    for (int i = 0; i < 5; i++) {
      try {
        socket = await ServerSocket.bind(ip, port!);
        port = socket!.port;
        return;
      } catch (e) {
        // ignore: inference_failure_on_instance_creation
        await Future.delayed(const Duration(seconds: 1));
      }
    }
    throw Exception('Failed to open connection at $ip:$port');
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'ip': ip,
      'port': port,
    };
  }
}

class ConnectionRequest {
  ConnectionRequest({this.username, this.role});

  factory ConnectionRequest.fromJson(Map<String, dynamic> json) {
    return ConnectionRequest(
      username: json['username'] as String,
      role: Role.getRole(json['role'] as String),
    );
  }

  String? username;
  Role? role;
}
