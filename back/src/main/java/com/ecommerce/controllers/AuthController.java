package com.ecommerce.controllers;

import com.ecommerce.domain.enums.USER_ROLE;
import com.ecommerce.request.LoginOtpRequest;
import com.ecommerce.request.LoginRequest;
import com.ecommerce.request.RegisterRequest;
import com.ecommerce.response.AuthResponse;
import com.ecommerce.response.MessageResponse;
import com.ecommerce.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@Tag(name = "Autenticação", description = "Endpoints para registro e login de usuários")
public class AuthController {

  private final AuthService authService;

  @PostMapping("/register")
  @Operation(summary = "Registra um novo usuário", description = "Cria um novo usuário no sistema a partir de um e-mail, nome e OTP válido.")
  @ApiResponse(responseCode = "201", description = "Usuário registrado com sucesso")
  @ApiResponse(responseCode = "400", description = "OTP inválido ou e-mail já em uso")
  public ResponseEntity<AuthResponse> registerHandler(@RequestBody RegisterRequest request) throws Exception {
    String jwt = authService.createUser(request);

    AuthResponse response = new AuthResponse(jwt, "User successfully registered", USER_ROLE.ROLE_CUSTOMER);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @PostMapping("/login")
  @Operation(summary = "Autentica um usuário ou vendedor", description = "Realiza o login utilizando e-mail e OTP para usuários/vendedores, ou e-mail e senha para o administrador.")
  @ApiResponse(responseCode = "200", description = "Login bem-sucedido")
  @ApiResponse(responseCode = "401", description = "Credenciais inválidas")
  public ResponseEntity<AuthResponse> loginHandler(@RequestBody LoginRequest request) {
    AuthResponse authResponse = authService.login(request);

    return ResponseEntity.ok(authResponse);
  }

  @PostMapping("/sent/otp")
  @Operation(summary = "Envia um código OTP", description = "Envia um código de uso único (OTP) para o e-mail do usuário ou vendedor para autenticação.")
  @ApiResponse(responseCode = "200", description = "OTP enviado com sucesso")
  public ResponseEntity<MessageResponse> sentOtpHandler(@RequestBody LoginOtpRequest request) throws Exception {
    authService.sentLoginOtp(request.getEmail(), request.getRole());

    MessageResponse response = new MessageResponse("otp sent successfully");
    return ResponseEntity.ok(response);
  }
}