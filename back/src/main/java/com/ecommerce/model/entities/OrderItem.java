package com.ecommerce.model.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_order_item")
public class OrderItem {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @ManyToOne
  @JsonIgnore
  private Order order;

  @ManyToOne
  private Product product;

  private String size;
  private int quantity;
  private BigDecimal basePrice = BigDecimal.ZERO;
  private BigDecimal sellingPrice = BigDecimal.ZERO;
  private Long userId;
}