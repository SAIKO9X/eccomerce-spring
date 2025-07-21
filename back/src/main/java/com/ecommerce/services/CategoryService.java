package com.ecommerce.services;

import com.ecommerce.model.entities.Category;

import java.util.List;

public interface CategoryService {

  List<Category> getAllCategories();

  Category createCategory(Category category) throws Exception;

  Category updateCategory(Category category, Long id) throws Exception;

  void deleteCategory(Long id) throws Exception;

  List<Category> seedInitialCategories();
}