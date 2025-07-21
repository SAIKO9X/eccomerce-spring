package com.ecommerce.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_cart")
public class Cart {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @OneToOne
  private User user;

  @ToString.Exclude
  @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<CartItem> cartItems = new HashSet<>();

  private BigDecimal totalSellingPrice;
  private int totalItem;
  private BigDecimal totalBasePrice;
  private BigDecimal discount;
  private String couponCode;
}
