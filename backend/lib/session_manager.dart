import 'package:backend/shared/authorized_session.dart';
import 'package:backend/shared/session.dart';

class SessionManager {
  static final SessionManager _instance = SessionManager._internal();
  factory SessionManager() => _instance;

  List<AuthorizedSession>? _activeSessions;

  SessionManager._internal() {
    _activeSessions = <AuthorizedSession>[];
  }
}
