import 'dart:io';

import 'package:backend/session_manager.dart';
import 'package:backend/utils/encryption.dart';
import 'package:dart_frog/dart_frog.dart';

Future<Response> onRequest(RequestContext context) {
  return switch (context.request.method) {
    HttpMethod.get => _onGet(context),
    _ => Future.value(Response(statusCode: HttpStatus.notFound)),
  };
}

Future<Response> _onGet(RequestContext context) async {
  return Response(body: Encryption.getServerPublicKey() as String);
}
