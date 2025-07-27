package com.ecommerce.model.dto;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BusinessDetails {
  private String businessName;
  private String businessEmail;
  private String businessMobile;
  private String logo;
}
