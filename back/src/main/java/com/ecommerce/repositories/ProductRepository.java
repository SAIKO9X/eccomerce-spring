package com.ecommerce.repositories;

import com.ecommerce.model.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

  List<Product> findBySellerId(Long sellerId);

  @Query("SELECT p FROM Product p WHERE" +
    "(:query IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')))" +
    "OR (:query IS NULL OR LOWER(p.category.name) LIKE LOWER(CONCAT('%', :query, '%')))"
  )
  List<Product> searchProduct(@Param("query") String query);

  List<Product> findByDiscountPercentGreaterThan(int discountPercent);

  List<Product> findByCategoryParentCategoryId(Long parentCategoryId);
}
