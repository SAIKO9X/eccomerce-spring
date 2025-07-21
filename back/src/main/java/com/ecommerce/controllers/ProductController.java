package com.ecommerce.controllers;

import com.ecommerce.exceptions.ProductException;
import com.ecommerce.model.entities.Product;
import com.ecommerce.services.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/products")
@Tag(name = "Produtos", description = "Endpoints para consulta e busca de produtos")
public class ProductController {

  private final ProductService productService;

  @GetMapping("/{productId}")
  @Operation(summary = "Busca um produto pelo ID", description = "Retorna os detalhes de um único produto com base no seu ID.")
  @ApiResponse(responseCode = "200", description = "Produto encontrado com sucesso")
  @ApiResponse(responseCode = "404", description = "Produto não encontrado")
  public ResponseEntity<Product> getProductById(@PathVariable Long productId) throws ProductException {
    Product product = productService.findProductById(productId);
    return ResponseEntity.ok(product);
  }

  @GetMapping("/search")
  @Operation(summary = "Busca produtos por texto", description = "Realiza uma busca textual no nome dos produtos e em suas categorias.")
  @ApiResponse(responseCode = "200", description = "Busca realizada com sucesso")
  public ResponseEntity<List<Product>> searchProduct(@RequestParam(required = false) String query) {
    List<Product> products = productService.searchProducts(query);
    return ResponseEntity.ok(products);
  }

  @GetMapping
  @Operation(summary = "Lista e filtra todos os produtos", description = "Retorna uma página de produtos com base em múltiplos filtros como categoria, cor, tamanho, preço e desconto.")
  @ApiResponse(responseCode = "200", description = "Produtos listados com sucesso")
  public ResponseEntity<Page<Product>> getAllProducts(
    @RequestParam(required = false) String category,
    @RequestParam(required = false) String brand,
    @RequestParam(required = false) String colors,
    @RequestParam(required = false) String sizes,
    @RequestParam(required = false) Integer minPrice,
    @RequestParam(required = false) Integer maxPrice,
    @RequestParam(required = false) Integer minDiscount,
    @RequestParam(required = false) String sort,
    @RequestParam(required = false) String stock,
    @RequestParam(required = false, defaultValue = "0") Integer pageNumber
  ) {
    Page<Product> products = productService.getAllProducts(
      category, brand, colors, sizes, minPrice, maxPrice, minDiscount, sort, stock, pageNumber
    );
    return ResponseEntity.ok(products);
  }

  @GetMapping("/{productId}/similar")
  @Operation(summary = "Busca produtos similares", description = "Retorna uma lista de produtos que pertencem à mesma categoria secundária do produto informado.")
  @ApiResponse(responseCode = "200", description = "Produtos similares encontrados com sucesso")
  @ApiResponse(responseCode = "404", description = "Produto original não encontrado")
  public ResponseEntity<List<Product>> getSimilarProducts(@PathVariable Long productId) throws ProductException {
    List<Product> similarProducts = productService.findSimilarProducts(productId);
    return ResponseEntity.ok(similarProducts);
  }
}