package com.ecommerce.controllers;

import com.ecommerce.exceptions.ProductException;
import com.ecommerce.model.entities.Product;
import com.ecommerce.model.entities.Seller;
import com.ecommerce.request.CreateProductRequest;
import com.ecommerce.services.ProductService;
import com.ecommerce.services.SellerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sellers/products")
@Tag(name = "Produtos (Vendedor)", description = "Endpoints para o vendedor gerenciar seus produtos")
public class SellerProductController {

  private final ProductService productService;
  private final SellerService sellerService;

  @GetMapping
  @Operation(summary = "Lista os produtos do vendedor", description = "Retorna uma lista de todos os produtos associados ao vendedor autenticado.")
  @ApiResponse(responseCode = "200", description = "Produtos listados com sucesso")
  public ResponseEntity<List<Product>> getProductBySellerId(@RequestHeader("Authorization") String jwt) throws Exception {
    Seller seller = sellerService.getSellerByJwtToken(jwt);
    List<Product> products = productService.getProductsBySellerId(seller.getId());

    return ResponseEntity.ok(products);
  }

  @PostMapping
  @Operation(summary = "Cria um novo produto", description = "Adiciona um novo produto ao catálogo do vendedor autenticado.")
  @ApiResponse(responseCode = "201", description = "Produto criado com sucesso")
  @ApiResponse(responseCode = "400", description = "Dados do produto inválidos")
  public ResponseEntity<Product> createProduct(@RequestHeader("Authorization") String jwt, @RequestBody CreateProductRequest request) throws Exception {
    Seller seller = sellerService.getSellerByJwtToken(jwt);
    Product product = productService.createProduct(request, seller);

    return ResponseEntity.status(HttpStatus.CREATED).body(product);
  }

  @DeleteMapping("/{productId}")
  @Operation(summary = "Deleta um produto", description = "Remove um produto do catálogo do vendedor com base no ID do produto.")
  @ApiResponse(responseCode = "200", description = "Produto deletado com sucesso")
  @ApiResponse(responseCode = "404", description = "Produto não encontrado")
  @ApiResponse(responseCode = "500", description = "Erro inesperado no servidor")
  public ResponseEntity<String> deleteProduct(@PathVariable Long productId) {
    try {
      productService.deleteProduct(productId);
      return ResponseEntity.ok("Produto deletado com sucesso.");
    } catch (ProductException e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erro ao deletar produto: " + e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro inesperado ao deletar produto: " + e.getMessage());
    }
  }

  @PutMapping("/{productId}")
  @Operation(summary = "Atualiza um produto existente", description = "Atualiza as informações de um produto existente.")
  @ApiResponse(responseCode = "200", description = "Produto atualizado com sucesso")
  @ApiResponse(responseCode = "404", description = "Produto não encontrado")
  public ResponseEntity<Product> updateProduct(@PathVariable Long productId, @RequestBody Product product) throws ProductException {
    Product updateProduct = productService.updateProduct(productId, product);
    
    return ResponseEntity.ok(updateProduct);
  }
}