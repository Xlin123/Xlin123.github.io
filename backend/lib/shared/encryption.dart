import 'package:dotenv/dotenv.dart';
import 'package:encrypt/encrypt.dart';

class Encryption {
  Encryption._();

  static final _encrypter = Encrypter(AES(_getEncKey()));

  static Key _getEncKey() {
    var env = DotEnv(includePlatformEnvironment: true)..load();
    return Key.fromUtf8(env['ENCRYPTION_KEY']!);
  }

  static String encrypt(String data) {
    final iv = IV.fromLength(16);
    return _encrypter.encrypt(data, iv: iv).base64;
  }

  static String decrypt(String data) {
    final iv = IV.fromLength(16);
    return _encrypter.decrypt(Encrypted.fromBase64(data), iv: iv);
  }
}
