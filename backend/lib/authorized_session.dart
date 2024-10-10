import 'package:backend/utils/encryption.dart';
import 'package:backend/requests/new_session_request.dart';
import 'package:dotenv/dotenv.dart';

/// Represents an authorized session with role-based authentication.
class AuthorizedSession {
  /// The unique identifier of the session.
  String id;

  /// The username associated with the session.
  String username;

  /// The type of virtual machine associated with the session.
  String vmType;

  /// The role of the user in the session.
  Role role;

  /// The encryption used for secure communication.
  Encryption encryption;

  /// The cached instance of the authorized session.
  static AuthorizedSession? _cachedSession;

  /// The session expiration date.
  final DateTime expiryDate = DateTime.now().add(const Duration(minutes: 10));

  /// Creates a new instance of [AuthorizedSession].
  AuthorizedSession({
    required this.role,
    required this.id,
    required this.username,
    required this.encryption,
    required this.vmType,
  });

  /// Creates an instance of [AuthorizedSession] from a [NewSessionRequest].
  factory AuthorizedSession.fromRequest(NewSessionRequest request) {
    final roleValue = RoleExtension.getRole(request.code);
    if (roleValue == null) {
      throw Exception('Invalid role authentication code');
    }
    _cachedSession ??= AuthorizedSession(
      role: roleValue,
      id: request.id,
      username: request.username,
      encryption: Encryption(request.publicKey),
      vmType: request.vmType,
    );
    return _cachedSession!;
  }

  /// Converts the [AuthorizedSession] instance to a JSON object.
  Map<dynamic, dynamic> toJson() {
    var deviceName = id.split("-").first;
    var args = "-d $deviceName -u $username -t @almond842 -r @rv_am";
    if (role == Role.admin) {
      args += " -f @bagel69";
    } else {
      args += " -f @chess69";
    }

    return <dynamic, dynamic>{
      'role': role.toJson(),
      'id': id,
      'vmType': vmType,
      'username': username,
      'args': args,
      'expiryDate': expiryDate.toIso8601String(),
    };
  }
}

/// Represents the role of a user in an authorized session.
enum Role {
  /// The admin role.
  admin,

  /// The user role.
  user,
}

extension RoleExtension on Role {
  /// Gets the [Role] enum value from the authentication code.
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

  /// Verifies the authentication code against the environment variables.
  static String? _verifyCode(String code) {
    final env = DotEnv(includePlatformEnvironment: true)..load();
    if (code == env['ADMIN']) {
      return 'admin';
    } else if (code == env['USER']) {
      return 'user';
    } else {
      return null;
    }
  }

  /// Converts the [Role] enum value to a JSON string.
  String? toJson() {
    return toString().split('.').last;
  }

  /// Creates a [Role] enum value from a JSON string.
  static Role? fromJson(String role) {
    switch (role) {
      case 'admin':
        return Role.admin;
      case 'user':
        return Role.user;
      default:
        return null;
    }
  }
}
