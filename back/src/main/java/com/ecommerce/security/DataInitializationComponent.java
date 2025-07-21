package com.ecommerce.security;

import com.ecommerce.domain.enums.USER_ROLE;
import com.ecommerce.model.entities.User;
import com.ecommerce.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializationComponent implements CommandLineRunner {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @Value("${admin.email}")
  private String adminEmail;

  @Value("${admin.password}")
  private String adminPassword;

  @Value("${admin.fullName}")
  private String adminFullName;

  @Override
  public void run(String... args) throws Exception {
    initializerAdminUser();
  }

  private void initializerAdminUser() {
    if (userRepository.findByEmail(adminEmail) == null) {
      User adminUser = new User();
      adminUser.setPassword(passwordEncoder.encode(adminPassword));
      adminUser.setFullName(adminFullName);
      adminUser.setEmail(adminEmail);
      adminUser.setRole(USER_ROLE.ROLE_ADMIN);

      userRepository.save(adminUser);
    }
  }
}
