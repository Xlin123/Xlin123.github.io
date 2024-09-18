import 'dart:io';

import 'package:backend/session_manager.dart';
import 'package:dart_frog/dart_frog.dart';

Future<Response> onRequest(RequestContext context) {
  return switch (context.request.method) {
    HttpMethod.delete => _onDelete(context),
    _ => Future.value(Response(statusCode: HttpStatus.notFound)),
  };
}

Future<Response> _onDelete(RequestContext context) async {
  return Response(body: "not implemented lol");
}
