package com.ecommerce.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ApplyCouponRequest {
  private String apply;
  private String code;
  private BigDecimal orderValue;
}