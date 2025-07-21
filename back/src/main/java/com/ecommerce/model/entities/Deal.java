package com.ecommerce.model.entities;

import com.ecommerce.domain.enums.DealType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_deal")
public class Deal {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @ManyToOne
  private Category category;

  @OneToOne
  private Product product;

  @Enumerated(EnumType.STRING)
  private DealType dealType;

  private String dealName;

  private String dealImage;

  private Integer discount;

  private Integer productDiscountPercent;

  private BigDecimal originalPrice;

  private BigDecimal discountedPrice;
}