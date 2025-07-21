package com.ecommerce.model.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_product")
public class Product {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @ManyToOne
  private Category category;

  @ManyToOne
  private Seller seller;

  @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Review> reviews = new ArrayList<>();

  private String title;

  private String description;

  private BigDecimal basePrice = BigDecimal.ZERO;

  private BigDecimal sellingPrice = BigDecimal.ZERO;

  private int discountPercent;

  private int quantity;

  private int totalReviews = 0;

  private Double averageRating = 0.0;

  private LocalDateTime createdAt = LocalDateTime.now();

  @ElementCollection
  private List<String> sizes = new ArrayList<>();

  @ElementCollection
  private List<String> colors = new ArrayList<>();

  @ElementCollection
  private List<String> images = new ArrayList<>();
}