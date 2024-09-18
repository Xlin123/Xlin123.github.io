import 'dart:convert';
import 'dart:io';

import 'package:backend/session_manager.dart';
import 'package:dart_frog/dart_frog.dart';

Future<Response> onRequest(RequestContext context) {
  return switch (context.request.method) {
    HttpMethod.post => _onPost(context),
    _ => Future.value(Response(statusCode: HttpStatus.notFound)),
  };
}

Future<Response> _onPost(RequestContext context) async {
  final response = context.request;
  final json = await response.body();

  if (json.isEmpty) {
    throw const FormatException('No query parameters recieved');
  }
  final session = await SessionManager.createSession(json);
  return Response(
    body: session.encryption.encryptToJson(jsonEncode(session.toJson())),
  );
}
