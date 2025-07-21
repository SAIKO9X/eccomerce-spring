package com.ecommerce.repositories;

import com.ecommerce.model.entities.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

  Wishlist findByUserId(Long userId);
}
