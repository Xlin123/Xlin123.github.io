import 'package:backend/authorized_session.dart';

///
/// This file contains the implementation of the `Container` class.
/// The `Container` class is responsible for managing connections and providing a way to access them.
/// It provides methods to add, remove, and retrieve connections.
///
/// Will connect with Noports, sending a ssh session to the container daemon
///
///
class Container {
  final _devices = <String, String>{
    "alpine": "alpine",
    "docker-scratch": "docker_scratch"
  };

  late String containerId;
  String vmType;
  String username = 'bob';
  Role role;
  String sessionId;
  ContainerStatus status = ContainerStatus.unspawned;

  Container(
      {required this.sessionId,
      required this.username,
      required this.role,
      required this.vmType}) {}

  Future<void> spinUpContainer() async {
    return;
  }

  Future<void> _openSocket() async {
    return;
  }

  Future<void> _disconnect() async {
    return;
  }
}

enum ContainerStatus {
  unspawned,
  running,
  stopped,
  paused,
  restarting,
  exited,
  dead
}
