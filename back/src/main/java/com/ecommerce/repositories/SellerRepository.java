package com.ecommerce.repositories;

import com.ecommerce.domain.enums.AccountStatus;
import com.ecommerce.model.entities.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SellerRepository extends JpaRepository<Seller, Long> {

  Seller findByEmail(String email);

  List<Seller> findByAccountStatus(AccountStatus status);
}
