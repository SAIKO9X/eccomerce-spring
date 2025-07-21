package com.ecommerce.services.impl;

import com.ecommerce.domain.enums.CouponStatus;
import com.ecommerce.model.entities.Cart;
import com.ecommerce.model.entities.Coupon;
import com.ecommerce.model.entities.User;
import com.ecommerce.repositories.CartRepository;
import com.ecommerce.repositories.CouponRepository;
import com.ecommerce.repositories.UserRepository;
import com.ecommerce.services.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

  private final CouponRepository couponRepository;
  private final CartRepository cartRepository;
  private final UserRepository userRepository;

  @Override
  public Cart applyCoupon(String code, BigDecimal orderValue, User user) throws Exception {
    Coupon coupon = couponRepository.findByCode(code);

    Cart cart = cartRepository.findByUserId(user.getId());

    if (coupon == null) {
      throw new Exception("Cupom não encontrado.");
    }

    if (user.getUsedCoupons().contains(coupon)) {
      throw new Exception("Este cupom já foi utilizado por você.");
    }

    if (orderValue.compareTo(coupon.getMinimumOrderValue()) < 0) {
      throw new Exception("O valor do pedido está abaixo do mínimo exigido para este cupom: " + coupon.getMinimumOrderValue());
    }

    if (!coupon.isActive()) {
      throw new Exception("Este cupom não está ativo.");
    }

    if (LocalDate.now().isBefore(coupon.getValidityStartDate())) {
      throw new Exception("Este cupom ainda não é válido. Ele começa em " + coupon.getValidityStartDate());
    }

    if (!LocalDate.now().isBefore(coupon.getValidityEndDate())) {
      throw new Exception("Este cupom expirou em " + coupon.getValidityEndDate());
    }

    BigDecimal discountedPrice = cart.getTotalSellingPrice()
      .multiply(BigDecimal.valueOf(coupon.getDiscountPercentage()))
      .divide(BigDecimal.valueOf(100), RoundingMode.HALF_UP);

    cart.setTotalSellingPrice(cart.getTotalSellingPrice().subtract(discountedPrice));
    cart.setCouponCode(code);
    cartRepository.save(cart);

    return cart;
  }

  @Override
  public Cart removeCoupon(String code, User user) throws Exception {
    Coupon coupon = couponRepository.findByCode(code);

    if (coupon == null) {
      throw new Exception("Cupom não encontrado.");
    }

    Cart cart = cartRepository.findByUserId(user.getId());

    BigDecimal discountedPrice = cart.getTotalSellingPrice()
      .multiply(BigDecimal.valueOf(coupon.getDiscountPercentage()))
      .divide(BigDecimal.valueOf(100), RoundingMode.HALF_UP);

    cart.setTotalSellingPrice(cart.getTotalSellingPrice().add(discountedPrice));
    cart.setCouponCode(null);
    cartRepository.save(cart);

    return cart;
  }

  @Override
  public void findCouponById(Long id) throws Exception {
    couponRepository.findById(id).orElseThrow(() -> new Exception("coupon not found"));
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public Coupon createCoupon(Coupon coupon) {
    coupon.setActive(true);
    return couponRepository.save(coupon);
  }

  @Override
  public List<Coupon> findAllCoupons() {
    return couponRepository.findAll();
  }

  @Override
  @PreAuthorize("hasRole('ADMIN')")
  public void deleteCoupon(Long id) throws Exception {
    Coupon coupon = couponRepository.findById(id)
      .orElseThrow(() -> new Exception("Cupom não encontrado"));

    coupon.getUsedByUsers().forEach(user -> user.getUsedCoupons().remove(coupon));
    coupon.getUsedByUsers().clear();

    userRepository.saveAll(coupon.getUsedByUsers());

    couponRepository.delete(coupon);
  }

  @Override
  public List<Coupon> findCouponsByStatus(CouponStatus status) {
    List<Coupon> allCoupons = couponRepository.findAll();
    return allCoupons.stream()
      .filter(coupon -> {
        coupon.calculateStatus();
        return coupon.getStatus() == status;
      })
      .collect(Collectors.toList());
  }

  @PreAuthorize("hasRole('ADMIN')")
  @Override
  public Coupon activateCoupon(Long id) throws Exception {
    Coupon coupon = couponRepository.findById(id)
      .orElseThrow(() -> new Exception("Cupom não encontrado"));
    coupon.setActive(true);
    return couponRepository.save(coupon);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @Override
  public Coupon deactivateCoupon(Long id) throws Exception {
    Coupon coupon = couponRepository.findById(id)
      .orElseThrow(() -> new Exception("Cupom não encontrado"));
    coupon.setActive(false);
    return couponRepository.save(coupon);
  }
}