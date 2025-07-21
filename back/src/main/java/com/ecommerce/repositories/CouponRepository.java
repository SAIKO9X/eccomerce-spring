package com.ecommerce.repositories;

import com.ecommerce.model.entities.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponRepository extends JpaRepository<Coupon, Long> {

  Coupon findByCode(String code);
}
