package com.ecommerce.model.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_review")
public class Review {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @NotBlank(message = "Review text cannot be blank")
  @Column(columnDefinition = "TEXT")
  private String reviewText;

  @NotNull(message = "Rating cannot be null")
  private double rating;

  @ElementCollection
  private List<String> productImages;

  @JsonIgnore
  @ManyToOne
  private Product product;

  @ManyToOne
  private User user;

  @Column(nullable = false)
  private LocalDateTime createdAt = LocalDateTime.now();
}
