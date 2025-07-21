package com.ecommerce.services.impl;

import com.ecommerce.repositories.SellerRepository;
import com.ecommerce.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ValidationService {

  private final UserRepository userRepository;
  private final SellerRepository sellerRepository;

  public void validateEmailUniqueness(String email) throws Exception {
    if (userRepository.findByEmail(email) != null || sellerRepository.findByEmail(email) != null) {
      throw new Exception("Email already in use by another user or seller.");
    }
  }
}
