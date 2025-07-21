package com.ecommerce.model.dto;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankDetails {
  private String accountNumber;
  private String accountHoldName;
  private String ifscCode;
}
