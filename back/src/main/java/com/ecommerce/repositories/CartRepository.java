package com.ecommerce.repositories;

import com.ecommerce.model.entities.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {

  Cart findByUserId(Long userId);
}
