package com.ecommerce.model.entities;

import com.ecommerce.domain.enums.PaymentMethod;
import com.ecommerce.domain.enums.PaymentOrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_payment_order")
public class PaymentOrder {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @ManyToOne
  private User user;

  @OneToMany
  private Set<Order> orders = new HashSet<>();

  private Long amount;

  @Enumerated(EnumType.STRING)
  private PaymentOrderStatus status = PaymentOrderStatus.PENDING;

  @Enumerated(EnumType.STRING)
  private PaymentMethod paymentMethod;

  private String paymentLinkId;
}
