package com.ecommerce.controllers;

import com.ecommerce.model.entities.Product;
import com.ecommerce.model.entities.User;
import com.ecommerce.model.entities.Wishlist;
import com.ecommerce.services.ProductService;
import com.ecommerce.services.UserService;
import com.ecommerce.services.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wishlist")
@Tag(name = "Lista de Desejos", description = "Endpoints para gerenciar a lista de desejos do usuário")
public class WishlistController {

  private final WishlistService wishlistService;
  private final ProductService productService;
  private final UserService userService;

  @PostMapping("/create")
  @Operation(summary = "Cria uma nova lista de desejos", description = "Cria uma lista de desejos para um usuário. Geralmente, isso é feito automaticamente na primeira interação.")
  @ApiResponse(responseCode = "201", description = "Lista de desejos criada com sucesso")
  public ResponseEntity<Wishlist> createWishList(@RequestBody User user) {
    Wishlist wishlist = wishlistService.createWishlist(user);

    return ResponseEntity.status(HttpStatus.CREATED).body(wishlist);
  }

  @GetMapping
  @Operation(summary = "Busca a lista de desejos do usuário", description = "Retorna a lista de desejos do usuário autenticado.")
  @ApiResponse(responseCode = "200", description = "Lista de desejos retornada com sucesso")
  public ResponseEntity<Wishlist> getWishListByUserId(@RequestHeader("Authorization") String jwt) throws Exception {
    User user = userService.findUserByJwtToken(jwt);
    Wishlist wishlist = wishlistService.getWishlistByUserId(user);

    return ResponseEntity.ok(wishlist);
  }

  @PostMapping("/add-product/{productId}")
  @Operation(summary = "Adiciona ou remove um produto da lista de desejos", description = "Se o produto não estiver na lista, ele é adicionado. Se já estiver, ele é removido.")
  @ApiResponse(responseCode = "200", description = "Operação realizada com sucesso")
  @ApiResponse(responseCode = "404", description = "Produto não encontrado")
  public ResponseEntity<Wishlist> addProductToWishList(@PathVariable Long productId, @RequestHeader("Authorization") String jwt) throws Exception {
    User user = userService.findUserByJwtToken(jwt);
    Product product = productService.findProductById(productId);
    Wishlist wishlist = wishlistService.addProductToWishlist(user, product);

    return ResponseEntity.ok(wishlist);
  }
}