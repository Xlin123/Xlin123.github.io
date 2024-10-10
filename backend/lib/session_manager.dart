import 'dart:convert';

import 'package:backend/authorized_session.dart';
import 'package:backend/requests/default_request.dart';
import 'package:backend/requests/new_session_request.dart';

class SessionManager {
  SessionManager._();

  static List<AuthorizedSession> _activeSessions = <AuthorizedSession>[];

  static Future<AuthorizedSession> createSession(String request) async {
    try {
      final sessionRequest = NewSessionRequest.fromDefaultRequest(
          DefaultRequest.fromJson(jsonDecode(request) as Map));
      final authorizedSession = AuthorizedSession.fromRequest(sessionRequest);
      if (!_activeSessions.contains(authorizedSession))
        _activeSessions.add(authorizedSession);
      //await authorizedSession.openSocket();
      return authorizedSession;
    } catch (e) {
      rethrow;
    }
  }

  static Future<void> closeSession(AuthorizedSession targetSession) async {
    final session = _activeSessions.firstWhere((s) => s.id == targetSession.id);
    //await session.disconnect();
    _activeSessions.remove(session);
  }

  static String sessionsToJson() {
    final map = <String, dynamic>{
      "activeSessions": _activeSessions,
    };
    return jsonEncode(map);
  }

  static bool isAuthenticated(String id) {
    for (var session in _activeSessions) {
      if (id == session.id) {
        return true;
      }
    }
    return false;
  }
}
