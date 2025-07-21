package com.ecommerce.model.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DashboardMetrics {
  private long totalSales;
  private BigDecimal totalEarnings;
  private long canceledOrders;
  private BigDecimal totalRefunds;

  public DashboardMetrics(long totalSales, BigDecimal totalEarnings, long canceledOrders, BigDecimal totalRefunds) {
    this.totalSales = totalSales;
    this.totalEarnings = totalEarnings;
    this.canceledOrders = canceledOrders;
    this.totalRefunds = totalRefunds;
  }
}