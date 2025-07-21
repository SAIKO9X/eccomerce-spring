package com.ecommerce.domain.enums;

public enum AccountStatus {
  PENDING_VERIFICATION, // Account is created but not yet verified
  ACTIVE,               // Account is active in good standing
  SUSPEND,              // Account is temporarily suspend, possibly due to violations
  DEACTIVATED,          // Account is deactivated, user may have chosen to deactivated it
  BANNED,               // Account is permanently banned due to severe violations
  CLOSED                // Account is closed, possibly to user request
}
