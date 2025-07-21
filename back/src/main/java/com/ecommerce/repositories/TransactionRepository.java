package com.ecommerce.repositories;

import com.ecommerce.model.entities.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

  List<Transaction> findBySellerId(Long sellerId);

  Transaction findByOrderId(Long orderId);

  List<Transaction> findBySellerIdAndDateBetween(Long sellerId, LocalDateTime start, LocalDateTime end);
}
