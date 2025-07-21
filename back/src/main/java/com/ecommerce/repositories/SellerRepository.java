package com.ecommerce.repositories;

import com.ecommerce.domain.enums.AccountStatus;
import com.ecommerce.model.entities.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SellerRepository extends JpaRepository<Seller, Long> {

  Optional<Seller> findByEmail(String email);

  List<Seller> findByAccountStatus(AccountStatus status);
}
