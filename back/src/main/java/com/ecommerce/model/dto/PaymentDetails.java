package com.ecommerce.model.dto;

import com.ecommerce.domain.enums.PaymentStatus;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class PaymentDetails {
  private String paymentId;
  private String paymentLinkId;
  private PaymentStatus status;
}