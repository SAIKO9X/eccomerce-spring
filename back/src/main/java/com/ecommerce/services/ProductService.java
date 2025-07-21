package com.ecommerce.services;

import com.ecommerce.exceptions.ProductException;
import com.ecommerce.model.entities.Product;
import com.ecommerce.model.entities.Seller;
import com.ecommerce.request.CreateProductRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {

  Product createProduct(CreateProductRequest request, Seller seller) throws ProductException;

  void deleteProduct(Long productId) throws ProductException;

  Product updateProduct(Long productId, Product product) throws ProductException;

  Product findProductById(Long productId) throws ProductException;

  List<Product> searchProducts(String query);

  List<Product> getProductsBySellerId(Long sellerId);

  Page<Product> getAllProducts(
    String category,
    String brand,
    String colors,
    String sizes,
    Integer minPrice,
    Integer maxPrice,
    Integer minDiscount,
    String sort,
    String stock,
    Integer pageNumber
  );

  List<Product> findSimilarProducts(Long productId) throws ProductException;
}
