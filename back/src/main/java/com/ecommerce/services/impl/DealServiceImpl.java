package com.ecommerce.services.impl;

import com.ecommerce.domain.enums.DealType;
import com.ecommerce.model.entities.Category;
import com.ecommerce.model.entities.Deal;
import com.ecommerce.model.entities.Product;
import com.ecommerce.repositories.CategoryRepository;
import com.ecommerce.repositories.DealRepository;
import com.ecommerce.repositories.ProductRepository;
import com.ecommerce.services.DealService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DealServiceImpl implements DealService {

  private final DealRepository dealRepository;
  private final CategoryRepository categoryRepository;
  private final ProductRepository productRepository;

  @Override
  public List<Deal> getDeals() {
    return dealRepository.findAll();
  }

  @Override
  public Deal createDeal(Deal deal) throws Exception {
    if (deal.getDealType() == null) {
      throw new Exception("Tipo de promoção (CATEGORY ou PRODUCT) é obrigatório.");
    }

    if (deal.getDealType() == DealType.CATEGORY) {
      if (deal.getCategory() == null || deal.getCategory().getId() == null) {
        throw new Exception("Categoria é obrigatória para promoções de categoria.");
      }
      Category category = categoryRepository.findById(deal.getCategory().getId())
        .orElseThrow(() -> new Exception("Categoria não encontrada."));
      deal.setCategory(category);
      deal.setProduct(null);
      deal.setProductDiscountPercent(null);
    } else if (deal.getDealType() == DealType.PRODUCT) {
      if (deal.getProduct() == null || deal.getProduct().getId() == null) {
        throw new Exception("Produto é obrigatório para promoções de produto.");
      }
      Product product = productRepository.findById(deal.getProduct().getId())
        .orElseThrow(() -> new Exception("Produto não encontrado."));
      deal.setProduct(product);
      deal.setCategory(null);
      deal.setDiscount(null);
    }

    return dealRepository.save(deal);
  }

  @Override
  public Deal updateDeal(Deal deal, Long id) throws Exception {
    Deal existingDeal = dealRepository.findById(id)
      .orElseThrow(() -> new Exception("Promoção não encontrada"));

    if (deal.getDealType() != null) {
      existingDeal.setDealType(deal.getDealType());
    }

    if (deal.getDealType() == DealType.CATEGORY) {
      if (deal.getCategory() != null && deal.getCategory().getId() != null) {
        Category category = categoryRepository.findById(deal.getCategory().getId())
          .orElseThrow(() -> new Exception("Categoria não encontrada."));
        existingDeal.setCategory(category);
      }
      existingDeal.setProduct(null);
      existingDeal.setProductDiscountPercent(null);

      if (deal.getDiscount() != null) {
        existingDeal.setDiscount(deal.getDiscount());
      }
      if (deal.getDealName() != null) {
        existingDeal.setDealName(deal.getDealName());
      }
      if (deal.getDealImage() != null) {
        existingDeal.setDealImage(deal.getDealImage());
      }
      if (deal.getOriginalPrice() != null) {
        existingDeal.setOriginalPrice(deal.getOriginalPrice());
      }
      if (deal.getDiscountedPrice() != null) {
        existingDeal.setDiscountedPrice(deal.getDiscountedPrice());
      }
    } else if (deal.getDealType() == DealType.PRODUCT) {
      if (deal.getProduct() != null && deal.getProduct().getId() != null) {
        Product product = productRepository.findById(deal.getProduct().getId())
          .orElseThrow(() -> new Exception("Produto não encontrado."));
        existingDeal.setProduct(product);
      }
      existingDeal.setCategory(null);
      existingDeal.setDiscount(null);

      if (deal.getProductDiscountPercent() != null) {
        existingDeal.setProductDiscountPercent(deal.getProductDiscountPercent());
      }
      if (deal.getOriginalPrice() != null) {
        existingDeal.setOriginalPrice(deal.getOriginalPrice());
      }
      if (deal.getDiscountedPrice() != null) {
        existingDeal.setDiscountedPrice(deal.getDiscountedPrice());
      }
    }

    return dealRepository.save(existingDeal);
  }

  @Override
  public void deleteDeal(Long id) throws Exception {
    Deal deal = dealRepository.findById(id)
      .orElseThrow(() -> new Exception("Promoção não encontrada"));
    dealRepository.delete(deal);
  }
}