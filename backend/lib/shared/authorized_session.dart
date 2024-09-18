import 'dart:async';
import 'package:backend/shared/connection.dart';
import 'package:backend/shared/encryption.dart';
import 'package:backend/shared/session_request.dart';
import 'package:dotenv/dotenv.dart';

class AuthorizedSession {
  AuthorizedSession(
      {required this.role,
      required this.id,
      required this.username,
      required this.encryption});

  factory AuthorizedSession.fromRequest(SessionRequest request) {
    final roleValue = Role.getRole(request.code!);
    if (roleValue == null) {
      throw Exception('Invalid role authentication code');
    }
    if (request.id == null || request.username == null) {
      throw Exception('Invalid Request');
    }
    _cachedSession ??= AuthorizedSession(
      role: roleValue,
      id: request.id!,
      username: request.username!,
      encryption: Encryption(request.publicKey!),
    );
    return _cachedSession!;
  }

  Map<dynamic, dynamic> toJson() {
    return <dynamic, dynamic>{
      'role': role,
      'id': id,
      'username': username,
      'expiryDate': expiryDate.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'connection': connection?.toJson(),
    };
  }

  Future<void> openSocket() async {
    final request = ConnectionRequest(username: username, role: role);
    connection = await Connection.fromRequest(request);
    await connection?.tryOpenConnection();
  }

  Future<void> disconnect() async {
    await connection?.socket?.close();
  }

  String id;
  String username;
  Role role;
  Connection? connection;
  Encryption encryption;
  static AuthorizedSession? _cachedSession;

  /// The session expiration date.
  final DateTime expiryDate = DateTime.now().add(const Duration(days: 1));
  final DateTime createdAt = DateTime.now();
}

enum Role {
  admin,
  user;

  static Role? getRole(String code) {
    switch (_verifyCode(code)) {
      case 'admin':
        return Role.admin;
      case 'user':
        return Role.user;
      default:
        return null;
    }
  }

  static String? _verifyCode(String code) {
    final env = DotEnv(includePlatformEnvironment: true)..load();
    if (code == env['ADMIN']) {
      return 'admin';
    } else if (code == env['USER']) {
      return 'user';
    } else {
      return null;
    }
  }

  static Role? fromJson(String role) {
    switch (role) {
      case 'admin':
        return Role.admin;
      case 'user':
        return Role.user;
      default:
        return null;
    }
  }

  String? toJson() {
    return toString().split('.').last;
  }
}
