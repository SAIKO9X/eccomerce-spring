package com.ecommerce.services;

import com.ecommerce.domain.enums.CouponStatus;
import com.ecommerce.model.entities.Cart;
import com.ecommerce.model.entities.Coupon;
import com.ecommerce.model.entities.User;

import java.math.BigDecimal;
import java.util.List;

public interface CouponService {

  Cart applyCoupon(String code, BigDecimal orderValue, User user) throws Exception;

  Cart removeCoupon(String code, User user) throws Exception;

  void findCouponById(Long id) throws Exception;

  Coupon createCoupon(Coupon coupon);

  List<Coupon> findAllCoupons();

  void deleteCoupon(Long id) throws Exception;

  List<Coupon> findCouponsByStatus(CouponStatus status);

  Coupon activateCoupon(Long id) throws Exception;

  Coupon deactivateCoupon(Long id) throws Exception;
}
