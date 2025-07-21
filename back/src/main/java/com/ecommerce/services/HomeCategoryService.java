package com.ecommerce.services;

import com.ecommerce.model.entities.HomeCategory;

import java.util.List;

public interface HomeCategoryService {

  HomeCategory createHomeCategory(HomeCategory homeCategory);

  List<HomeCategory> createCategories(List<HomeCategory> homeCategories);

  HomeCategory updateHomeCategory(HomeCategory category, Long id) throws Exception;

  List<HomeCategory> getAllHomeCategories();

  void deleteHomeCategory(Long id) throws Exception;
}
