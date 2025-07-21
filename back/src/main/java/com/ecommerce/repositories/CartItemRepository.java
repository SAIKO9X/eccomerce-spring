package com.ecommerce.repositories;

import com.ecommerce.model.entities.Cart;
import com.ecommerce.model.entities.CartItem;
import com.ecommerce.model.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

  CartItem findByCartAndProductAndSize(Cart cart, Product product, String size);
}
