import 'package:backend/session_manager.dart';
import 'package:dart_frog/dart_frog.dart';

Handler middleware(Handler handler) {
  return handler.use(requestLogger()).use(
        provider<SessionManager>(
          (_) => SessionManager(),
        ),
      );
}
