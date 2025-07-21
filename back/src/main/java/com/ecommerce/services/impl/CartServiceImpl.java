package com.ecommerce.services.impl;

import com.ecommerce.model.entities.Cart;
import com.ecommerce.model.entities.CartItem;
import com.ecommerce.model.entities.Product;
import com.ecommerce.model.entities.User;
import com.ecommerce.repositories.CartItemRepository;
import com.ecommerce.repositories.CartRepository;
import com.ecommerce.services.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

  private final CartRepository cartRepository;
  private final CartItemRepository cartItemRepository;

  @Override
  public CartItem addCartItem(User user, Product product, String size, int quantity) {
    Cart cart = findUserCart(user);

    CartItem isPresent = cartItemRepository.findByCartAndProductAndSize(cart, product, size);

    if (isPresent == null) {
      CartItem cartItem = new CartItem();
      cartItem.setProduct(product);
      cartItem.setQuantity(quantity);
      cartItem.setUserId(user.getId());
      cartItem.setSize(size);

      cartItem.setBasePrice(product.getBasePrice().multiply(BigDecimal.valueOf(quantity)));
      cartItem.setSellingPrice(product.getSellingPrice().multiply(BigDecimal.valueOf(quantity)));

      cart.getCartItems().add(cartItem);
      cartItem.setCart(cart);

      return cartItemRepository.save(cartItem);
    }

    return isPresent;
  }

  @Override
  @Transactional
  public Cart findUserCart(User user) {
    Cart cart = cartRepository.findByUserId(user.getId());

    if (cart == null) {
      try {
        cart = new Cart();
        cart.setUser(user);
        cart.setCartItems(new HashSet<>());
        cart = cartRepository.save(cart);
      } catch (DataIntegrityViolationException e) {
        cart = cartRepository.findByUserId(user.getId());
        if (cart == null) {
          throw new RuntimeException("Erro ao criar ou buscar o carrinho para o usuário: " + user.getId(), e);
        }
      }
    }

    BigDecimal totalPrice = BigDecimal.ZERO;
    BigDecimal totalDiscountedPrice = BigDecimal.ZERO;
    int totalItem = 0;

    for (CartItem cartItem : cart.getCartItems()) {
      totalPrice = totalPrice.add(cartItem.getBasePrice());
      totalDiscountedPrice = totalDiscountedPrice.add(cartItem.getSellingPrice());
      totalItem += cartItem.getQuantity();
    }

    cart.setTotalBasePrice(totalPrice);
    cart.setTotalSellingPrice(totalDiscountedPrice);
    cart.setTotalItem(totalItem);
    cart.setDiscount(totalPrice.subtract(totalDiscountedPrice));

    return cart;
  }

  @Override
  public void clearCart(User user) {
    Cart cart = cartRepository.findByUserId(user.getId());
    cart.getCartItems().clear();
    cartRepository.save(cart);
  }
}
