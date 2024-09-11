import 'dart:io';

import 'package:dart_frog/dart_frog.dart';
import '../../lib/shared/session.dart';

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
}
