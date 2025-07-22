package com.ecommerce.model.entities;

import com.ecommerce.domain.enums.AccountStatus;
import com.ecommerce.domain.enums.USER_ROLE;
import com.ecommerce.model.dto.BankDetails;
import com.ecommerce.model.dto.BusinessDetails;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_seller")
public class Seller {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @OneToOne(cascade = CascadeType.ALL)
  private Address pickupAddress = new Address();

  private String sellerName;
  private String mobile;
  private String CNPJ;

  @Email
  private String email;

  @Embedded
  private BusinessDetails businessDetails = new BusinessDetails();

  @Embedded
  private BankDetails bankDetails = new BankDetails();

  @Enumerated(EnumType.STRING)
  private USER_ROLE role = USER_ROLE.ROLE_SELLER;

  @Enumerated(EnumType.STRING)
  private AccountStatus accountStatus = AccountStatus.PENDING_VERIFICATION;

  private boolean isEmailVerified = false;
}
