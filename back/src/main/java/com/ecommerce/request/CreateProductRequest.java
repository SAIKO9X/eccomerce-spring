package com.ecommerce.request;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateProductRequest {
  private String title;
  private String description;
  private BigDecimal basePrice;
  private BigDecimal sellingPrice;
  private List<String> images;
  private String category;
  private String category2;
  private String category3;
  private List<String> colors;
  private List<String> sizes;
  private int quantity;
}
