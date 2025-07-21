package com.ecommerce.controllers;

import com.ecommerce.model.entities.Cart;
import com.ecommerce.model.entities.CartItem;
import com.ecommerce.model.entities.Product;
import com.ecommerce.model.entities.User;
import com.ecommerce.request.AddItemRequest;
import com.ecommerce.response.MessageResponse;
import com.ecommerce.services.CartItemService;
import com.ecommerce.services.CartService;
import com.ecommerce.services.ProductService;
import com.ecommerce.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
@Tag(name = "Carrinho de Compras", description = "Endpoints para gerenciar o carrinho do usuário")
public class CartController {

  private final CartService cartService;
  private final CartItemService cartItemService;
  private final UserService userService;
  private final ProductService productService;

  @GetMapping
  @Operation(summary = "Busca o carrinho do usuário autenticado", description = "Retorna o carrinho de compras completo do usuário logado.")
  @ApiResponse(responseCode = "200", description = "Carrinho retornado com sucesso")
  public ResponseEntity<Cart> findUserCart(@RequestHeader("Authorization") String jwt) throws Exception {
    User user = userService.findUserByJwtToken(jwt);
    Cart cart = cartService.findUserCart(user);

    return ResponseEntity.ok(cart);
  }

  @PutMapping("/add")
  @Operation(summary = "Adiciona um item ao carrinho", description = "Adiciona um produto específico ao carrinho do usuário autenticado.")
  @ApiResponse(responseCode = "200", description = "Item adicionado com sucesso")
  public ResponseEntity<Cart> addItemToCart(@RequestHeader("Authorization") String jwt, @RequestBody AddItemRequest request) throws Exception {
    User user = userService.findUserByJwtToken(jwt);
    Product product = productService.findProductById(request.productId());

    cartService.addCartItem(user, product, request.size(), request.quantity());
    Cart cart = cartService.findUserCart(user);

    return ResponseEntity.ok(cart);
  }

  @DeleteMapping("/item/{cartItemId}")
  @Operation(summary = "Remove um item do carrinho", description = "Remove um item específico do carrinho do usuário autenticado.")
  @ApiResponse(responseCode = "200", description = "Item removido com sucesso")
  public ResponseEntity<MessageResponse> deleteCartItem(@RequestHeader("Authorization") String jwt, @PathVariable Long cartItemId) throws Exception {
    User user = userService.findUserByJwtToken(jwt);
    cartItemService.removeCartItem(user.getId(), cartItemId);

    MessageResponse response = new MessageResponse();
    response.setMessage("Item removed from cart successfully");

    return ResponseEntity.ok(response);
  }

  @PutMapping("/item/{cartItemId}")
  @Operation(summary = "Atualiza um item no carrinho", description = "Atualiza a quantidade de um item específico no carrinho.")
  @ApiResponse(responseCode = "200", description = "Item atualizado com sucesso")
  @ApiResponse(responseCode = "400", description = "Requisição inválida (ex: quantidade menor ou igual a zero)")
  public ResponseEntity<?> updateCartItem(
    @RequestHeader("Authorization") String jwt,
    @PathVariable Long cartItemId,
    @RequestBody CartItem cartItem
  ) throws Exception {

    User user = userService.findUserByJwtToken(jwt);

    if (cartItem.getQuantity() <= 0) {
      return ResponseEntity.badRequest().body("Quantity must be greater than zero");
    }

    CartItem updatedItem = cartItemService.updateCartItem(user.getId(), cartItemId, cartItem);

    return ResponseEntity.ok(updatedItem);
  }

  @DeleteMapping("/clear")
  @Operation(summary = "Limpa o carrinho", description = "Remove todos os itens do carrinho do usuário autenticado.")
  @ApiResponse(responseCode = "200", description = "Carrinho limpo com sucesso")
  public ResponseEntity<MessageResponse> clearCart(@RequestHeader("Authorization") String jwt) throws Exception {
    User user = userService.findUserByJwtToken(jwt);
    cartService.clearCart(user);
    
    MessageResponse response = new MessageResponse();
    response.setMessage("Carrinho limpo com sucesso");

    return ResponseEntity.ok(response);
  }
}