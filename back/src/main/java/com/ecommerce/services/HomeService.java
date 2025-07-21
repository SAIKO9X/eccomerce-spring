package com.ecommerce.services;

import com.ecommerce.model.dto.Home;
import com.ecommerce.model.entities.HomeCategory;

import java.util.List;

public interface HomeService {

  Home createHomePageData(List<HomeCategory> allCategories);
}
