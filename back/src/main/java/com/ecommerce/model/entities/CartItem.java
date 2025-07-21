package com.ecommerce.model.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_cart_item")
public class CartItem {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @JsonIgnore
  @ManyToOne()
  @JoinColumn(name = "cart_id")
  private Cart cart;

  @ManyToOne()
  private Product product;

  private String size;
  private int quantity = 1;
  private BigDecimal basePrice = BigDecimal.ZERO;
  private BigDecimal sellingPrice = BigDecimal.ZERO;
  private Long userId;
}
