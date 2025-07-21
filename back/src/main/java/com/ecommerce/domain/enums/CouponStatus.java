package com.ecommerce.domain.enums;

public enum CouponStatus {
  ACTIVE,      // Cupom está ativo e dentro do período de validade
  EXPIRED,     // Cupom expirou (data atual > validityEndDate)
  PENDING,     // Cupom ainda não começou (data atual < validityStartDate)
  INACTIVE,    // Cupom foi desativado pelo administrador (isActive = false)
  SCHEDULED    // Cupom está agendado para começar em uma data futura
}