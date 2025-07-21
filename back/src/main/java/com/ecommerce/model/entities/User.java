package com.ecommerce.model.entities;

import com.ecommerce.domain.enums.USER_ROLE;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList; // Mantenha como ArrayList ou List
import java.util.HashSet;
import java.util.List;      // Mantenha como ArrayList ou List
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_user")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
  private List<Address> addresses = new ArrayList<>();

  @JsonIgnore
  @ManyToMany
  private Set<Coupon> usedCoupons = new HashSet<>();

  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  private String password;

  private String email;
  private String fullName;
  private String mobile;

  @Enumerated(EnumType.STRING)
  private USER_ROLE role = USER_ROLE.ROLE_CUSTOMER;
}