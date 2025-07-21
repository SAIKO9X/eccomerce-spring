package com.ecommerce.repositories;

import com.ecommerce.domain.enums.PaymentOrderStatus;
import com.ecommerce.model.entities.PaymentOrder;
import com.ecommerce.model.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface PaymentOrderRepository extends JpaRepository<PaymentOrder, Long> {

  PaymentOrder findByPaymentLinkId(String paymentLinkId);

  List<PaymentOrder> findByUserAndStatus(User user, PaymentOrderStatus status);
}
