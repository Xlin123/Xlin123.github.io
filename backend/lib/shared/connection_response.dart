class ConnectionResponse {
  final bool success;
  final String message;

  ConnectionResponse({this.success, this.message});

  static ConnectionResponse fromRequest(Map<String, dynamic> json) {
    return ConnectionResponse(
      success: json['success'],
      message: json['message'],
    );
  }
}
