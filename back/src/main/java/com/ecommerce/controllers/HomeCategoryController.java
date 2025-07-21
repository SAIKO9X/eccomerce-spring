package com.ecommerce.controllers;

import com.ecommerce.model.dto.Home;
import com.ecommerce.model.entities.HomeCategory;
import com.ecommerce.services.HomeCategoryService;
import com.ecommerce.services.HomeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Categorias da Home (Admin)", description = "Endpoints para gerenciar as seções de categorias na página inicial")
public class HomeCategoryController {

  private final HomeCategoryService homeCategoryService;
  private final HomeService homeService;

  @PostMapping("/home/categories")
  @Operation(summary = "Cria as categorias da página inicial", description = "Recebe uma lista de categorias e as popula nas seções da página inicial (Carrossel, Vitrine, etc.).")
  @ApiResponse(responseCode = "201", description = "Categorias da home criadas e dados da página inicial retornados")
  public ResponseEntity<Home> createHomeCategories(@RequestBody List<HomeCategory> homeCategories) {
    List<HomeCategory> categories = homeCategoryService.createCategories(homeCategories);
    Home home = homeService.createHomePageData(categories);

    return ResponseEntity.status(HttpStatus.CREATED).body(home);
  }

  @GetMapping("/admin/home-category")
  @Operation(summary = "Lista todas as categorias da home", description = "Retorna uma lista de todas as categorias configuradas para a página inicial.")
  @ApiResponse(responseCode = "200", description = "Lista de categorias retornada com sucesso")
  public ResponseEntity<List<HomeCategory>> getHomeCategory() {
    List<HomeCategory> categories = homeCategoryService.getAllHomeCategories();
    return ResponseEntity.ok(categories);
  }

  @PatchMapping("/admin/home-category/{id}")
  @Operation(summary = "Atualiza uma categoria da home", description = "Atualiza os dados de uma categoria da página inicial específica.")
  @ApiResponse(responseCode = "200", description = "Categoria atualizada com sucesso")
  @ApiResponse(responseCode = "404", description = "Categoria não encontrada")
  public ResponseEntity<HomeCategory> updateHomeCategory(@PathVariable Long id, @RequestBody HomeCategory homeCategory) throws Exception {
    HomeCategory updatedCategory = homeCategoryService.updateHomeCategory(homeCategory, id);
    return ResponseEntity.ok(updatedCategory);
  }

  @DeleteMapping("/admin/home-category/{id}")
  @Operation(summary = "Deleta uma categoria da home", description = "Remove uma categoria da configuração da página inicial.")
  @ApiResponse(responseCode = "200", description = "Categoria deletada com sucesso")
  @ApiResponse(responseCode = "404", description = "Categoria não encontrada")
  public ResponseEntity<String> deleteHomeCategory(@PathVariable Long id) throws Exception {
    homeCategoryService.deleteHomeCategory(id);
    return ResponseEntity.ok("Categoria deletada com sucesso");
  }
}