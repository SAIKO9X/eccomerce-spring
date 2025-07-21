package com.ecommerce.request;

import com.ecommerce.domain.enums.USER_ROLE;
import lombok.Data;

@Data
public class LoginOtpRequest {
  private String email;
  private String otp;
  private USER_ROLE role;
}
