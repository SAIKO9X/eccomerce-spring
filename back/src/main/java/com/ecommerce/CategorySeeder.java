package com.ecommerce;

import com.ecommerce.model.entities.Category;
import com.ecommerce.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CategorySeeder implements CommandLineRunner {

  private final CategoryService categoryService;

  @Override
  public void run(String... args) throws Exception {
    System.out.println("Iniciando seeding de categorias...");
    List<Category> seeded = categoryService.seedInitialCategories();
    System.out.println("Categorias seedadas: " + seeded.size());
  }
}