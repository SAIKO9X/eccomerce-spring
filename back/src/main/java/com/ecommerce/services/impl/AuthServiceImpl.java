package com.ecommerce.services.impl;

import com.ecommerce.domain.enums.USER_ROLE;
import com.ecommerce.model.entities.Cart;
import com.ecommerce.model.entities.User;
import com.ecommerce.model.entities.VerificationCode;
import com.ecommerce.providers.JWTProvider;
import com.ecommerce.repositories.CartRepository;
import com.ecommerce.repositories.SellerRepository;
import com.ecommerce.repositories.UserRepository;
import com.ecommerce.repositories.VerificationCodeRepository;
import com.ecommerce.request.LoginRequest;
import com.ecommerce.request.RegisterRequest;
import com.ecommerce.response.AuthResponse;
import com.ecommerce.services.AuthService;
import com.ecommerce.utils.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

  private final UserRepository userRepository;
  private final SellerRepository sellerRepository;
  private final CartRepository cartRepository;
  private final PasswordEncoder passwordEncoder;
  private final JWTProvider jwtProvider;
  private final VerificationCodeRepository verificationCodeRepository;
  private final EmailService emailService;
  private final CustomUserServiceImpl customerUserService;
  private final ValidationService validationService;
  private final CustomUserServiceImpl customUserService;

  @Value("${admin.email}")
  private String adminEmail;

  @Override
  public void sentLoginOtp(String email, USER_ROLE role) throws Exception {
    String LOGIN_PREFIX = "login_";

    if (email.startsWith(LOGIN_PREFIX)) {
      email = email.substring(LOGIN_PREFIX.length());
    }

    if (role != null && role.equals(USER_ROLE.ROLE_SELLER)) {
      if (sellerRepository.findByEmail(email).isEmpty()) {
        throw new Exception("Seller not found with email: " + email);
      }
    }

    String otp = OtpUtil.generateOtp();

    Optional<VerificationCode> existingCode = verificationCodeRepository.findFirstByEmailOrderByExpiryDateDesc(email);

    VerificationCode verificationCode = existingCode.orElse(new VerificationCode());
    verificationCode.setOtp(otp);
    verificationCode.setEmail(email);
    verificationCode.setExpiryDate(LocalDateTime.now().plusMinutes(60));

    verificationCodeRepository.save(verificationCode);

    emailService.sendOtpEmailWithTemplate(email, otp);
  }

  @Override
  public String createUser(RegisterRequest request) throws Exception {

    Optional<VerificationCode> optionalCode = verificationCodeRepository.findFirstByEmailOrderByExpiryDateDesc(request.email());

    validationService.validateEmailUniqueness(request.email());

    if (optionalCode.isEmpty() || !optionalCode.get().getOtp().equals(request.otp())) {
      throw new Exception("Invalid or expired OTP.");
    }

    Optional<User> optionalUser = userRepository.findByEmail(request.email());

    if (optionalUser.isEmpty()) {
      User createdUser = new User();
      createdUser.setEmail(request.email());
      createdUser.setFullName(request.fullName());
      createdUser.setRole(USER_ROLE.ROLE_CUSTOMER);
      createdUser.setMobile("");
      createdUser.setPassword(passwordEncoder.encode(request.otp()));

      User savedUser = userRepository.save(createdUser);

      Cart cart = new Cart();
      cart.setUser(savedUser);
      cartRepository.save(cart);
    }

    List<GrantedAuthority> authorities = new ArrayList<>();
    authorities.add(new SimpleGrantedAuthority(USER_ROLE.ROLE_CUSTOMER.toString()));

    Authentication authentication = new UsernamePasswordAuthenticationToken(request.email(), null, authorities);
    SecurityContextHolder.getContext().setAuthentication(authentication);

    return jwtProvider.generateToken(authentication);
  }

  @Override
  public AuthResponse login(LoginRequest request) {
    if (request.getEmail().equals(adminEmail)) {
      return loginAdmin(request);
    }
    return loginUserWithOtp(request);
  }

  private AuthResponse loginAdmin(LoginRequest request) {
    String username = request.getEmail();
    String password = request.getPassword();

    Authentication authentication = authenticateAdmin(username, password);
    SecurityContextHolder.getContext().setAuthentication(authentication);

    String token = jwtProvider.generateToken(authentication);
    return new AuthResponse(token, "Login do Admin bem-sucedido", USER_ROLE.ROLE_ADMIN);
  }

  private Authentication authenticateAdmin(String username, String password) {
    UserDetails userDetails = customUserService.loadUserByUsername(username);

    if (userDetails == null) {
      throw new BadCredentialsException("Email ou senha inválidos");
    }

    if (!passwordEncoder.matches(password, userDetails.getPassword())) {
      throw new BadCredentialsException("Email ou senha inválidos");
    }
    
    return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
  }

  private AuthResponse loginUserWithOtp(LoginRequest request) {
    String username = request.getEmail();
    String otp = request.getOtp();

    Authentication authentication = authenticate(username, otp);
    SecurityContextHolder.getContext().setAuthentication(authentication);

    String token = jwtProvider.generateToken(authentication);
    AuthResponse authResponse = new AuthResponse(token, "Login bem-sucedido", null);

    Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
    String roleName = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();
    authResponse.setRole(USER_ROLE.valueOf(roleName));

    return authResponse;
  }

  private Authentication authenticate(String username, String otp) {

    UserDetails userDetails = customerUserService.loadUserByUsername(username);

    String SELLER_PREFIX = "seller_";

    if (username.startsWith(SELLER_PREFIX)) {
      username = username.substring(SELLER_PREFIX.length());
    }

    if (userDetails == null) {
      throw new BadCredentialsException("invalid email");
    }

    Optional<VerificationCode> optionalCode = verificationCodeRepository.findFirstByEmailOrderByExpiryDateDesc(username);

    if (optionalCode.isEmpty() || !optionalCode.get().getOtp().equals(otp)) {
      throw new BadCredentialsException("wrong login code");
    }

    if (optionalCode.get().getExpiryDate().isBefore(LocalDateTime.now())) {
      throw new BadCredentialsException("OTP expired");
    }

    return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
  }
}