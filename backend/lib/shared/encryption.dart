import 'dart:convert';
import 'dart:io';

import 'package:encrypt/encrypt.dart';
import 'package:encrypt/encrypt_io.dart';
import 'package:pointycastle/asymmetric/api.dart';

///A class that provides encryption and decryption services.
///Inbound Requests:
/// Client grabs public key from server and encrypts data before sending it.
/// The server decrypts the data using its private key.
///
/// Outbound Responses:
/// On request, the client sends public key to the server.
/// The server encrypts the data using the public key.
/// The client decrypts the data using its private key.
class Encryption {
  Encryption(String publicKey,
      [RSAPrivateKey? privKey, RSAPublicKey? serverPubKey]) {
    if (privKey != null) {
      privateKey = privKey;
    }
    if (serverPubKey != null) {
      serverPublicKey = serverPubKey;
    }
    var plain = utf8.decode(base64Decode(publicKey));
    clientPublicKey = RSAKeyParser().parse(plain) as RSAPublicKey;
    clientEncrypter = Encrypter(RSA(publicKey: clientPublicKey));
  }
  static RSAPrivateKey privateKey = parseKeyFromFileSync('keys/rsa.pem');
  static RSAPublicKey serverPublicKey =
      parseKeyFromFileSync('keys/rsa.pem.pub');
  static String serverPublicPem = File('keys/rsa.pem.pub').readAsStringSync();
  late RSAPublicKey? clientPublicKey;
  static Encrypter serverEncrypter =
      Encrypter(RSA(publicKey: serverPublicKey, privateKey: privateKey));
  late Encrypter? clientEncrypter;

  ///Inbound Request uses CLIENT public key, which is sent in the payoad
  String encryptToJson(String data) {
    final iv = IV.fromLength(16);
    return <String, dynamic>{
      'payload': clientEncrypter!.encrypt(data, iv: iv).base64,
      'iv': iv.base64,
      'publicKey': base64Encode(utf8.encode(serverPublicPem)),
    }.toString();
  }

  ///Outbound Response uses SERVER private key, which is stored in the server
  static Map<String, dynamic> decrypt(String data, IV iv) {
    final encrypter =
        Encrypter(RSA(publicKey: serverPublicKey, privateKey: privateKey));
    return jsonDecode(encrypter.decrypt(Encrypted.fromBase64(data), iv: iv))
        as Map<String, dynamic>;
  }
}
