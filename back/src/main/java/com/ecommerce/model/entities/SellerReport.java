package com.ecommerce.model.entities;

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
@Table(name = "tb_seller_report")
public class SellerReport {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @OneToOne
  private Seller seller;

  private BigDecimal totalEarnings = BigDecimal.ZERO;
  private BigDecimal totalSales = BigDecimal.ZERO;
  private BigDecimal totalRefunds = BigDecimal.ZERO;
  private BigDecimal totalTax = BigDecimal.ZERO;
  private BigDecimal netEarnings = BigDecimal.ZERO;
  private int totalOrders = 0;
  private int canceledOrders = 0;
  private int totalTransactions = 0;
}
