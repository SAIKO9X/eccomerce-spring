package com.ecommerce.services;

import com.ecommerce.model.entities.Cart;
import com.ecommerce.model.entities.CartItem;
import com.ecommerce.model.entities.Product;
import com.ecommerce.model.entities.User;

public interface CartService {

  CartItem addCartItem(User user, Product product, String size, int quantity);

  Cart findUserCart(User user);
  
  void clearCart(User user);
}
