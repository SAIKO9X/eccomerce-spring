package com.ecommerce.model.entities;

import com.ecommerce.domain.enums.HomeCategorySection;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_home_category")
public class HomeCategory {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String name;

  private String image;

  private Integer discount;

  private String categoryId;

  private String textButton;

  private String topText;

  private HomeCategorySection section;
}
