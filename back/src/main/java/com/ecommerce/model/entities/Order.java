package com.ecommerce.model.entities;

import com.ecommerce.domain.enums.OrderStatus;
import com.ecommerce.domain.enums.PaymentStatus;
import com.ecommerce.model.dto.PaymentDetails;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_order")
public class Order {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @ManyToOne
  private User user;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<OrderItem> orderItems = new ArrayList<>();

  @ManyToOne
  @JsonIgnore
  private PaymentOrder paymentOrder;

  @ManyToOne
  private Address orderAddress;

  private String orderId;
  private Long sellerId;
  private int totalItem;
  private BigDecimal totalBasePrice = BigDecimal.ZERO;
  private BigDecimal totalSellingPrice = BigDecimal.ZERO;
  private BigDecimal discount = BigDecimal.ZERO;

  @Enumerated(EnumType.STRING)
  private OrderStatus orderStatus;

  @Embedded
  private PaymentDetails paymentDetails;

  @Enumerated(EnumType.STRING)
  private PaymentStatus paymentStatus = PaymentStatus.PENDING;

  private LocalDateTime orderDate = LocalDateTime.now();
  private LocalDateTime deliverDate = orderDate.plusDays(7);
}
