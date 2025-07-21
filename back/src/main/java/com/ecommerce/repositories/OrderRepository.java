package com.ecommerce.repositories;

import com.ecommerce.domain.enums.PaymentStatus;
import com.ecommerce.model.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

  List<Order> findByUserId(Long userId);

  List<Order> findBySellerId(Long sellerId);

  List<Order> findByUserIdAndPaymentStatus(Long userId, PaymentStatus paymentStatus);
}
