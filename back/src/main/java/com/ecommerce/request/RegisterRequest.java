package com.ecommerce.request;

public record RegisterRequest(
  String email,
  String fullName,
  String otp
) {
}
