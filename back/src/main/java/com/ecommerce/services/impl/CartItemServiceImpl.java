package com.ecommerce.services.impl;

import com.ecommerce.model.entities.CartItem;
import com.ecommerce.model.entities.User;
import com.ecommerce.repositories.CartItemRepository;
import com.ecommerce.repositories.CartRepository;
import com.ecommerce.services.CartItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CartItemServiceImpl implements CartItemService {

  private final CartItemRepository cartItemRepository;

  @Override
  public CartItem updateCartItem(Long userId, Long id, CartItem cartItem) throws Exception {
    CartItem item = findCartItemById(id);

    User cartItemUser = item.getCart().getUser();

    if (cartItemUser.getId().equals(userId)) {
      item.setQuantity(cartItem.getQuantity());
      BigDecimal quantity = BigDecimal.valueOf(cartItem.getQuantity());
      item.setBasePrice(item.getProduct().getBasePrice().multiply(quantity));
      item.setSellingPrice(item.getProduct().getSellingPrice().multiply(quantity));

      return cartItemRepository.save(item);
    }

    throw new Exception("You can't update this cart item");
  }

  @Override
  public void removeCartItem(Long userId, Long cartItemId) throws Exception {
    CartItem item = findCartItemById(cartItemId);

    User cartItemUser = item.getCart().getUser();

    if (cartItemUser.getId().equals(userId)) {
      cartItemRepository.delete(item);
    } else throw new Exception("You can't delete this cart item");
  }

  @Override
  public CartItem findCartItemById(Long id) throws Exception {
    return cartItemRepository.findById(id).orElseThrow(() -> new Exception("Cart item not found with this id: " + id));
  }
}
