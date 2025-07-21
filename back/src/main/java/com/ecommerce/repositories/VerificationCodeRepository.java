package com.ecommerce.repositories;

import com.ecommerce.model.entities.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {

  Optional<VerificationCode> findFirstByEmailOrderByExpiryDateDesc(String email);

  VerificationCode findByOtp(String otp);
}
