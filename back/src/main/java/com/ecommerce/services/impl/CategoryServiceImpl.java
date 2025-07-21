package com.ecommerce.services.impl;

import com.ecommerce.model.entities.Category;
import com.ecommerce.repositories.CategoryRepository;
import com.ecommerce.services.CategoryService;
import com.ecommerce.utils.category.MainCategoryData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

  private final CategoryRepository categoryRepository;

  @Override
  public List<Category> getAllCategories() {
    return categoryRepository.findAll();
  }

  @Override
  public Category createCategory(Category category) throws Exception {
    if (categoryRepository.findByCategoryId(category.getCategoryId()).isPresent()) {
      throw new Exception("Categoria com categoryId " + category.getCategoryId() + " já existe.");
    }
    return categoryRepository.save(category);
  }

  @Override
  public Category updateCategory(Category category, Long id) throws Exception {
    Category existingCategory = categoryRepository.findById(id)
      .orElseThrow(() -> new Exception("Categoria não encontrada com id: " + id));

    if (category.getName() != null) existingCategory.setName(category.getName());
    if (category.getCategoryId() != null) {
      if (categoryRepository.findByCategoryId(category.getCategoryId()).isPresent() && !category.getCategoryId().equals(existingCategory.getCategoryId())) {
        throw new Exception("categoryId já existe.");
      }
      existingCategory.setCategoryId(category.getCategoryId());
    }
    if (category.getLevel() != null) existingCategory.setLevel(category.getLevel());
    if (category.getParentCategory() != null) existingCategory.setParentCategory(category.getParentCategory());

    return categoryRepository.save(existingCategory);
  }

  @Override
  public void deleteCategory(Long id) throws Exception {
    Category category = categoryRepository.findById(id)
      .orElseThrow(() -> new Exception("Categoria não encontrada com id: " + id));
    categoryRepository.delete(category);
  }

  @Override
  public List<Category> seedInitialCategories() {
    List<Category> seededCategories = new ArrayList<>();

    // Seeding de mainCategories (Level 1)
    for (MainCategoryData.MainCategory category : MainCategoryData.mainCategories) {
      if (categoryRepository.findByCategoryId(category.categoryId()).isEmpty()) {
        Category cat = new Category();
        cat.setCategoryId(category.categoryId());
        cat.setName(category.name());
        cat.setLevel(category.level());
        cat.setParentCategory(null);
        seededCategories.add(categoryRepository.save(cat));
      }
    }

    // Seeding de categoryTwo (Level 2) - electronicsLevelTwo, furnitureLevelTwo, menLevelTwo, womenLevelTwo
    Map<String, Category> levelOneMap = categoryRepository.findByLevel(1).stream()
      .collect(Collectors.toMap(Category::getCategoryId, Function.identity()));

    // Electronics Level 2
    for (MainCategoryData.CategoryLevelTwo cat : MainCategoryData.electronicsLevelTwo) {
      if (categoryRepository.findByCategoryId(cat.categoryId()).isEmpty()) {
        Category parent = levelOneMap.get(cat.parentCategoryId());
        Category category = new Category();
        category.setCategoryId(cat.categoryId());
        category.setName(cat.name());
        category.setLevel(2);
        category.setParentCategory(parent);
        seededCategories.add(categoryRepository.save(category));
      }
    }

    // Furniture Level 2
    for (MainCategoryData.CategoryLevelTwo cat : MainCategoryData.furnitureLevelTwo) {
      if (categoryRepository.findByCategoryId(cat.categoryId()).isEmpty()) {
        Category parent = levelOneMap.get(cat.parentCategoryId());
        Category category = new Category();
        category.setCategoryId(cat.categoryId());
        category.setName(cat.name());
        category.setLevel(2);
        category.setParentCategory(parent);
        seededCategories.add(categoryRepository.save(category));
      }
    }

    // Men Level 2
    for (MainCategoryData.CategoryLevelTwo cat : MainCategoryData.menLevelTwo) {
      if (categoryRepository.findByCategoryId(cat.categoryId()).isEmpty()) {
        Category parent = levelOneMap.get(cat.parentCategoryId());
        Category category = new Category();
        category.setCategoryId(cat.categoryId());
        category.setName(cat.name());
        category.setLevel(2);
        category.setParentCategory(parent);
        seededCategories.add(categoryRepository.save(category));
      }
    }

    // Women Level 2
    for (MainCategoryData.CategoryLevelTwo cat : MainCategoryData.womenLevelTwo) {
      if (categoryRepository.findByCategoryId(cat.categoryId()).isEmpty()) {
        Category parent = levelOneMap.get(cat.parentCategoryId());
        Category category = new Category();
        category.setCategoryId(cat.categoryId());
        category.setName(cat.name());
        category.setLevel(2);
        category.setParentCategory(parent);
        seededCategories.add(categoryRepository.save(category));
      }
    }

    // Seeding de categoryThree (Level 3) - electronicsLevelThree, furnitureLevelThree, menLevelThree, womenLevelThree
    Map<String, Category> levelTwoMap = categoryRepository.findByLevel(2).stream()
      .collect(Collectors.toMap(Category::getCategoryId, Function.identity()));

    // Electronics Level 3
    for (MainCategoryData.CategoryLevelThree cat : MainCategoryData.electronicsLevelThree) {
      if (categoryRepository.findByCategoryId(cat.categoryId()).isEmpty()) {
        Category parent = levelTwoMap.get(cat.parentCategoryId());
        Category category = new Category();
        category.setCategoryId(cat.categoryId());
        category.setName(cat.name());
        category.setLevel(3);
        category.setParentCategory(parent);
        seededCategories.add(categoryRepository.save(category));
      }
    }

    // Furniture Level 3
    for (MainCategoryData.CategoryLevelThree cat : MainCategoryData.furnitureLevelThree) {
      if (categoryRepository.findByCategoryId(cat.categoryId()).isEmpty()) {
        Category parent = levelTwoMap.get(cat.parentCategoryId());
        Category category = new Category();
        category.setCategoryId(cat.categoryId());
        category.setName(cat.name());
        category.setLevel(3);
        category.setParentCategory(parent);
        seededCategories.add(categoryRepository.save(category));
      }
    }

    // Men Level 3
    for (MainCategoryData.CategoryLevelThree cat : MainCategoryData.menLevelThree) {
      if (categoryRepository.findByCategoryId(cat.categoryId()).isEmpty()) {
        Category parent = levelTwoMap.get(cat.parentCategoryId());
        Category category = new Category();
        category.setCategoryId(cat.categoryId());
        category.setName(cat.name());
        category.setLevel(3);
        category.setParentCategory(parent);
        seededCategories.add(categoryRepository.save(category));
      }
    }

    // Women Level 3
    for (MainCategoryData.CategoryLevelThree cat : MainCategoryData.womenLevelThree) {
      if (categoryRepository.findByCategoryId(cat.categoryId()).isEmpty()) {
        Category parent = levelTwoMap.get(cat.parentCategoryId());
        Category category = new Category();
        category.setCategoryId(cat.categoryId());
        category.setName(cat.name());
        category.setLevel(3);
        category.setParentCategory(parent);
        seededCategories.add(categoryRepository.save(category));
      }
    }
    
    return seededCategories;
  }
}