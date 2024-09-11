// ignore_for_file: public_member_api_docs

import 'dart:core';
import 'package:dotenv/dotenv.dart';

class Session {
  Session({this.code, this.id, this.username});

  dynamic code;
  dynamic id;
  dynamic username;
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
    var env = DotEnv(includePlatformEnvironment: true)..load();
    if (code == env['ADMIN']) {
      return 'admin';
    } else if (code == env['USER']) {
      return 'user';
    } else {
      return null;
    }
  }
}
