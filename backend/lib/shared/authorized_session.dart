import 'package:backend/shared/connection_request.dart';
import 'package:backend/shared/session.dart';

class AuthorizedSession implements Session {
  AuthorizedSession({this.role, this.id, this.username, this.token});

  factory AuthorizedSession.fromJson(Map<String, dynamic> json) {
    final Role? roleValue = Role.getRole(json['code'] as String);
    if (roleValue == null) {
      throw Exception('Invalid role authentication code');
    }
    _cachedSession ??= AuthorizedSession(
      role: roleValue,
      id: json['id'],
      username: json['username'],
      token: json['token'],
    );
    return _cachedSession!;
  }

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'role': role,
      'id': id,
      'username': username,
      'token': token,
    };
  }

  dynamic code;
  dynamic id;
  dynamic username;
  dynamic token;
  Role? role;
  ConnectionRequest? response;
  static AuthorizedSession? _cachedSession;
}
