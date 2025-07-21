package com.ecommerce.services.impl;

import com.ecommerce.domain.enums.DealType;
import com.ecommerce.domain.enums.HomeCategorySection;
import com.ecommerce.model.dto.Home;
import com.ecommerce.model.entities.Category;
import com.ecommerce.model.entities.Deal;
import com.ecommerce.model.entities.HomeCategory;
import com.ecommerce.model.entities.Product;
import com.ecommerce.repositories.CategoryRepository;
import com.ecommerce.repositories.DealRepository;
import com.ecommerce.repositories.ProductRepository;
import com.ecommerce.services.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeServiceImpl implements HomeService {

  private final DealRepository dealRepository;
  private final ProductRepository productRepository;
  private final CategoryRepository categoryRepository;

  @Override
  public Home createHomePageData(List<HomeCategory> allCategories) {
    List<HomeCategory> carouselCategories = allCategories.stream()
      .filter(category -> category.getSection() == HomeCategorySection.CAROUSEL)
      .collect(Collectors.toList());

    List<HomeCategory> shopByCategories = allCategories.stream()
      .filter(category -> category.getSection() == HomeCategorySection.SHOP_BY_CATEGORIES)
      .collect(Collectors.toList());

    List<HomeCategory> dealCategories = allCategories.stream()
      .filter(category -> category.getSection() == HomeCategorySection.DEALS)
      .toList();

    List<Deal> createdDeals;
    List<Deal> existingDeals = dealRepository.findAll();
    if (existingDeals.isEmpty()) {
      List<Deal> deals = new ArrayList<>();
      for (HomeCategory homeCategory : dealCategories) {
        Category category = categoryRepository.findByCategoryId(homeCategory.getCategoryId())
          .orElseThrow(() -> new RuntimeException("Categoria não encontrada: " + homeCategory.getCategoryId()));

        if (existingDeals.stream().noneMatch(deal ->
          deal.getCategory() != null &&
            deal.getCategory().getId().equals(category.getId()) &&
            deal.getDealName().equals(homeCategory.getName()) &&
            deal.getDealImage().equals(homeCategory.getImage()))) {
          Deal categoryDeal = getDeal(homeCategory);
          deals.add(categoryDeal);
        }
      }

      List<Product> promotedProducts = productRepository.findByDiscountPercentGreaterThan(0);
      for (Product product : promotedProducts) {
        Deal productDeal = new Deal();
        productDeal.setDealType(DealType.PRODUCT);
        productDeal.setProduct(product);
        productDeal.setOriginalPrice(product.getBasePrice());
        productDeal.setDiscountedPrice(product.getSellingPrice());
        productDeal.setProductDiscountPercent(product.getDiscountPercent());
        productDeal.setCategory(null);
        productDeal.setDiscount(null);
        deals.add(productDeal);
      }
      if (!deals.isEmpty()) {
        createdDeals = dealRepository.saveAll(deals);
      } else {
        createdDeals = existingDeals;
      }
    } else {
      createdDeals = existingDeals;
    }

    Home home = new Home();
    home.setCarousel(carouselCategories);
    home.setShopCategories(shopByCategories);
    home.setDealCategories(dealCategories);
    home.setDeals(createdDeals);

    return home;
  }

  private Deal getDeal(HomeCategory homeCategory) {
    Deal categoryDeal = new Deal();
    categoryDeal.setDealType(DealType.CATEGORY);

    Category category = categoryRepository.findByCategoryId(homeCategory.getCategoryId())
      .orElseThrow(() -> new RuntimeException("Categoria não encontrada: " + homeCategory.getCategoryId()));
    categoryDeal.setCategory(category);

    categoryDeal.setDealName(homeCategory.getName());
    categoryDeal.setDealImage(homeCategory.getImage());

    int discount = homeCategory.getDiscount() != null ? homeCategory.getDiscount() : 10;
    categoryDeal.setDiscount(discount);

    BigDecimal originalPrice = new BigDecimal("100.00");
    categoryDeal.setOriginalPrice(originalPrice);

    BigDecimal discountMultiplier = BigDecimal.valueOf(discount).divide(BigDecimal.valueOf(100));
    BigDecimal discountAmount = originalPrice.multiply(discountMultiplier);
    BigDecimal discountedPrice = originalPrice.subtract(discountAmount);
    categoryDeal.setDiscountedPrice(discountedPrice);

    categoryDeal.setProduct(null);
    categoryDeal.setProductDiscountPercent(null);
    return categoryDeal;
  }
}