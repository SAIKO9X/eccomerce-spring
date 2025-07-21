package com.ecommerce.controllers;

import com.ecommerce.model.entities.Category;
import com.ecommerce.response.MessageResponse;
import com.ecommerce.services.CategoryService;
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
@RequestMapping("/admin/categories")
@Tag(name = "Categorias", description = "Endpoints para gerenciamento de categorias de produtos")
public class CategoryController {

  private final CategoryService categoryService;

  @GetMapping
  @Operation(summary = "Lista todas as categorias", description = "Retorna uma lista com todas as categorias cadastradas no sistema.")
  @ApiResponse(responseCode = "200", description = "Lista de categorias retornada com sucesso")
  public ResponseEntity<List<Category>> getAllCategories() {
    List<Category> categories = categoryService.getAllCategories();
    return ResponseEntity.ok(categories);
  }

  @PostMapping
  @Operation(summary = "Cria uma nova categoria", description = "Adiciona uma nova categoria ao sistema.")
  @ApiResponse(responseCode = "201", description = "Categoria criada com sucesso")
  @ApiResponse(responseCode = "400", description = "Categoria com 'categoryId' já existente")
  public ResponseEntity<Category> createCategory(@RequestBody Category category) throws Exception {
    Category createdCategory = categoryService.createCategory(category);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
  }

  @PatchMapping("/{id}")
  @Operation(summary = "Atualiza uma categoria existente", description = "Atualiza os dados de uma categoria com base no seu ID.")
  @ApiResponse(responseCode = "200", description = "Categoria atualizada com sucesso")
  @ApiResponse(responseCode = "404", description = "Categoria não encontrada")
  public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category category) throws Exception {
    Category updatedCategory = categoryService.updateCategory(category, id);
    return ResponseEntity.ok(updatedCategory);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Deleta uma categoria", description = "Remove uma categoria do sistema com base no seu ID.")
  @ApiResponse(responseCode = "200", description = "Categoria deletada com sucesso")
  @ApiResponse(responseCode = "404", description = "Categoria não encontrada")
  public ResponseEntity<MessageResponse> deleteCategory(@PathVariable Long id) throws Exception {
    categoryService.deleteCategory(id);
    MessageResponse response = new MessageResponse("Categoria deletada");
    return ResponseEntity.ok(response);
  }
}