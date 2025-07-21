package com.ecommerce.services;

import com.ecommerce.domain.enums.USER_ROLE;
import com.ecommerce.request.LoginRequest;
import com.ecommerce.request.RegisterRequest;
import com.ecommerce.response.AuthResponse;

public interface AuthService {

  void sentLoginOtp(String email, USER_ROLE role) throws Exception;

  String createUser(RegisterRequest request) throws Exception;

  AuthResponse login(LoginRequest request);
}
