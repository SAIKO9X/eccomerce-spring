package com.ecommerce.model.entities;

import com.ecommerce.domain.enums.CouponStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_coupon")
public class Coupon {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @ManyToMany(mappedBy = "usedCoupons")
  private Set<User> usedByUsers = new HashSet<>();

  private String code;
  private double discountPercentage;
  private LocalDate validityStartDate;
  private LocalDate validityEndDate;
  private BigDecimal minimumOrderValue;
  private boolean isActive = true;

  @Transient
  private CouponStatus status;

  @PostLoad
  public void calculateStatus() {
    LocalDate today = LocalDate.now();

    if (validityStartDate == null || validityEndDate == null) {
      this.status = CouponStatus.PENDING;
      return;
    }
    if (!isActive) {
      this.status = CouponStatus.INACTIVE;
    } else if (validityStartDate.isAfter(today)) {
      this.status = CouponStatus.SCHEDULED;
    } else if (validityEndDate.isBefore(today)) {
      this.status = CouponStatus.EXPIRED;
    } else if (validityStartDate.isBefore(today) || validityStartDate.isEqual(today)) {
      this.status = CouponStatus.ACTIVE;
    } else {
      this.status = CouponStatus.PENDING;
    }
  }
}