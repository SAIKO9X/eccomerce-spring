package com.ecommerce.model.dto;

import com.ecommerce.model.entities.Deal;
import com.ecommerce.model.entities.HomeCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Home {
  private List<HomeCategory> carousel;
  private List<HomeCategory> shopCategories;
  private List<HomeCategory> dealCategories;
  private List<Deal> deals;
}
