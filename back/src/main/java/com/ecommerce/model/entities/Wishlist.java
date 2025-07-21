package com.ecommerce.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_wishlist")
public class Wishlist {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @OneToOne
  private User user;

  @ManyToMany
  @ToString.Exclude
  private Set<Product> products = new HashSet<>();
}
