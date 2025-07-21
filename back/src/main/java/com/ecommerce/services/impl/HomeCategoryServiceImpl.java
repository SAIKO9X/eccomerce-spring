package com.ecommerce.services.impl;

import com.ecommerce.model.entities.HomeCategory;
import com.ecommerce.repositories.HomeCategoryRepository;
import com.ecommerce.services.HomeCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeCategoryServiceImpl implements HomeCategoryService {

  private final HomeCategoryRepository homeCategoryRepository;

  @Override
  public HomeCategory createHomeCategory(HomeCategory homeCategory) {
    return homeCategoryRepository.save(homeCategory);
  }

  @Override
  public List<HomeCategory> createCategories(List<HomeCategory> homeCategories) {
    List<HomeCategory> existingCategories = homeCategoryRepository.findAll();

    List<HomeCategory> newCategories = homeCategories.stream()
      .filter(newCat -> existingCategories.stream()
        .noneMatch(existing ->
          existing.getCategoryId().equals(newCat.getCategoryId()) &&
            existing.getSection().equals(newCat.getSection()) &&
            existing.getName().equals(newCat.getName()) &&
            existing.getImage().equals(newCat.getImage())))
      .collect(Collectors.toList());

    if (!newCategories.isEmpty()) {
      homeCategoryRepository.saveAll(newCategories);
    }
    return homeCategoryRepository.findAll();
  }

  @Override
  public HomeCategory updateHomeCategory(HomeCategory category, Long id) throws Exception {
    HomeCategory existingCategory = homeCategoryRepository.findById(id)
      .orElseThrow(() -> new Exception("Categoria não encontrada"));

    System.out.println("Received category data: " + category);

    if (category.getImage() != null) {
      existingCategory.setImage(category.getImage());
    }
    if (category.getCategoryId() != null) {
      existingCategory.setCategoryId(category.getCategoryId());
    }
    if (category.getName() != null) {
      existingCategory.setName(category.getName());
    }
    if (category.getSection() != null) {
      existingCategory.setSection(category.getSection());
    }
    if (category.getTextButton() != null) {
      existingCategory.setTextButton(category.getTextButton());
    }
    if (category.getTopText() != null) {
      existingCategory.setTopText(category.getTopText());
    }
    if (category.getDiscount() != null) {
      existingCategory.setDiscount(category.getDiscount());
    }

    HomeCategory savedCategory = homeCategoryRepository.save(existingCategory);
    System.out.println("Updated category: " + savedCategory);
    return savedCategory;
  }

  @Override
  public List<HomeCategory> getAllHomeCategories() {
    return homeCategoryRepository.findAll();
  }

  @Override
  public void deleteHomeCategory(Long id) throws Exception {
    HomeCategory category = homeCategoryRepository.findById(id)
      .orElseThrow(() -> new Exception("Categoria não encontrada"));
    homeCategoryRepository.delete(category);
  }
}