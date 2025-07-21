package com.ecommerce.services;

import com.ecommerce.model.entities.Product;
import com.ecommerce.model.entities.User;
import com.ecommerce.model.entities.Wishlist;

public interface WishlistService {

  Wishlist createWishlist(User user);

  Wishlist getWishlistByUserId(User user);

  Wishlist addProductToWishlist(User user, Product product);
}
