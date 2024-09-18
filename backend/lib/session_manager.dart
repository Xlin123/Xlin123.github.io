import 'dart:convert';

import 'package:backend/shared/authorized_session.dart';
import 'package:backend/shared/default_request.dart';
import 'package:backend/shared/session_request.dart';

class SessionManager {
  SessionManager._();

  static List<AuthorizedSession> _activeSessions = <AuthorizedSession>[];

  static Future<AuthorizedSession> createSession(String request) async {
    try {
      final sessionRequest = SessionRequest.fromDefaultRequest(
          DefaultRequest.fromJson(jsonDecode(request) as Map));
      final authorizedSession = AuthorizedSession.fromRequest(sessionRequest);
      _activeSessions.add(authorizedSession);
      await authorizedSession.openSocket();
      return authorizedSession;
    } catch (e) {
      rethrow;
    }
  }

  static Future<void> closeSession(AuthorizedSession targetSession) async {
    final session = _activeSessions.firstWhere((s) => s.id == targetSession.id);
    await session.disconnect();
    _activeSessions.remove(session);
  }
}
