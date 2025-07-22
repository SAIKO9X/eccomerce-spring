package com.ecommerce.services.impl;

import com.ecommerce.exceptions.ProductException;
import com.ecommerce.model.entities.Category;
import com.ecommerce.model.entities.Product;
import com.ecommerce.model.entities.Seller;
import com.ecommerce.repositories.CategoryRepository;
import com.ecommerce.repositories.ProductRepository;
import com.ecommerce.request.CreateProductRequest;
import com.ecommerce.services.CategoryService;
import com.ecommerce.services.ProductService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

  private final ProductRepository productRepository;
  private final CategoryRepository categoryRepository;
  private final CategoryService categoryService;

  @Override
  public Product createProduct(CreateProductRequest request, Seller seller) throws ProductException {
    Category category3 = categoryRepository.findByCategoryId(request.getCategory3())
      .orElseThrow(() -> new ProductException("Categoria de nível 3 não encontrada: " + request.getCategory3()));

    int discountPercentage = calculateDiscountPercentage(request.getBasePrice(), request.getSellingPrice());

    Product product = new Product();
    product.setSeller(seller);
    product.setCategory(category3);
    product.setDescription(request.getDescription());
    product.setCreatedAt(LocalDateTime.now());
    product.setTitle(request.getTitle());
    product.setColors(request.getColors());
    product.setSizes(request.getSizes());
    product.setSellingPrice(request.getSellingPrice());
    product.setImages(request.getImages());
    product.setBasePrice(request.getBasePrice());
    product.setDiscountPercent(discountPercentage);
    product.setQuantity(request.getQuantity());
    product.setTotalReviews(0);
    product.setAverageRating(0.0);

    return productRepository.save(product);
  }

  @Override
  public void deleteProduct(Long productId) throws ProductException {
    Product product = findProductById(productId);
    productRepository.delete(product);
  }

  @Override
  public Product updateProduct(Long productId, Product reqProduct) throws ProductException {
    Product existingProduct = findProductById(productId);

    // Atualiza os campos simples
    if (reqProduct.getTitle() != null) {
      existingProduct.setTitle(reqProduct.getTitle());
    }
    if (reqProduct.getDescription() != null) {
      existingProduct.setDescription(reqProduct.getDescription());
    }
    if (reqProduct.getBasePrice() != null) {
      existingProduct.setBasePrice(reqProduct.getBasePrice());
    }
    if (reqProduct.getSellingPrice() != null) {
      existingProduct.setSellingPrice(reqProduct.getSellingPrice());
    }
    if (reqProduct.getQuantity() > 0) {
      existingProduct.setQuantity(reqProduct.getQuantity());
    }
    if (reqProduct.getColors() != null) {
      existingProduct.setColors(reqProduct.getColors());
    }
    if (reqProduct.getSizes() != null) {
      existingProduct.setSizes(reqProduct.getSizes());
    }
    if (reqProduct.getImages() != null) {
      existingProduct.setImages(reqProduct.getImages());
    }

    if (reqProduct.getCategory() != null && reqProduct.getCategory().getCategoryId() != null) {
      Category newCategory = categoryRepository.findByCategoryId(reqProduct.getCategory().getCategoryId())
        .orElseThrow(() -> new ProductException("Categoria não encontrada: " + reqProduct.getCategory().getCategoryId()));
      existingProduct.setCategory(newCategory);
    }

    existingProduct.setDiscountPercent(
      calculateDiscountPercentage(existingProduct.getBasePrice(), existingProduct.getSellingPrice())
    );

    return productRepository.save(existingProduct);
  }


  @Override
  public Product findProductById(Long productId) throws ProductException {
    return productRepository.findById(productId)
      .orElseThrow(() -> new ProductException("product not found with id: " + productId));
  }

  @Override
  public List<Product> searchProducts(String query) {
    return productRepository.searchProduct(query);
  }

  @Override
  public List<Product> getProductsBySellerId(Long sellerId) {
    return productRepository.findBySellerId(sellerId);
  }

  @Override
  public Page<Product> getAllProducts(String category, String brand, String colors, String sizes, Integer minPrice, Integer maxPrice, Integer minDiscount, String sort, String stock, Integer pageNumber) {
    Specification<Product> spec = (root, query, criteriaBuilder) -> {
      List<Predicate> predicates = new ArrayList<>();

      if (category != null && !category.isEmpty()) {
        List<String> categoryIds = categoryService.getCategoryAndDescendantIds(category);

        if (!categoryIds.isEmpty()) {
          Join<Product, Category> categoryJoin = root.join("category");
          predicates.add(categoryJoin.get("categoryId").in(categoryIds));
        } else {
          return criteriaBuilder.disjunction();
        }
      }

      if (colors != null && !colors.isEmpty()) {
        Predicate colorPredicate = criteriaBuilder.isMember(colors, root.get("colors"));
        predicates.add(colorPredicate);
      }

      if (sizes != null && !sizes.isEmpty()) {
        Predicate sizePredicate = criteriaBuilder.isMember(sizes, root.get("sizes"));
        predicates.add(sizePredicate);
      }

      if (minPrice != null) {
        predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("sellingPrice"), minPrice));
      }

      if (maxPrice != null) {
        predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("sellingPrice"), maxPrice));
      }

      if (minDiscount != null) {
        predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("discountPercent"), minDiscount));
      }

      if (stock != null) {
        predicates.add(criteriaBuilder.equal(root.get("stock"), stock));
      }

      return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    };

    Pageable pageable;

    if (sort != null && !sort.isEmpty()) {
      pageable = switch (sort) {
        case "price_low" ->
          PageRequest.of(pageNumber != null ? pageNumber : 0, 10, Sort.by("sellingPrice").ascending());
        case "price_high" ->
          PageRequest.of(pageNumber != null ? pageNumber : 0, 10, Sort.by("sellingPrice").descending());
        default -> PageRequest.of(pageNumber != null ? pageNumber : 0, 10, Sort.unsorted());
      };
    } else {
      pageable = PageRequest.of(pageNumber != null ? pageNumber : 0, 10, Sort.unsorted());
    }

    return productRepository.findAll(spec, pageable);
  }

  private int calculateDiscountPercentage(BigDecimal basePrice, BigDecimal sellingPrice) {
    if (basePrice == null || sellingPrice == null || basePrice.compareTo(BigDecimal.ZERO) <= 0) {
      return 0;
    }

    BigDecimal discount = basePrice.subtract(sellingPrice);
    if (discount.compareTo(BigDecimal.ZERO) < 0) {
      return 0;
    }

    return discount.multiply(BigDecimal.valueOf(100))
      .divide(basePrice, 0, RoundingMode.HALF_UP)
      .intValue();
  }

  @Override
  public List<Product> findSimilarProducts(Long productId) throws ProductException {
    Product currentProduct = findProductById(productId);
    Category currentCategory = currentProduct.getCategory();

    Category secondaryCategory = currentCategory.getParentCategory();
    if (secondaryCategory == null || secondaryCategory.getLevel() != 2) {
      throw new ProductException("Categoria secundária não encontrada para o produto: " + productId);
    }

    return productRepository.findByCategoryParentCategoryId(secondaryCategory.getId())
      .stream()
      .filter(product -> !product.getId().equals(productId))
      .collect(Collectors.toList());
  }
}