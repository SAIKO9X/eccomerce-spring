package com.ecommerce.controllers;

import com.ecommerce.domain.enums.DealType;
import com.ecommerce.model.entities.Category;
import com.ecommerce.model.entities.Deal;
import com.ecommerce.model.entities.Product;
import com.ecommerce.response.MessageResponse;
import com.ecommerce.services.DealService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/deals")
@Tag(name = "Promoções (Admin)", description = "Endpoints para criar e gerenciar promoções de produtos ou categorias")
public class DealController {

  private final DealService dealService;

  @PostMapping
  @Operation(summary = "Cria uma nova promoção",
    description = "Cria uma promoção baseada em um 'dealType'. Se for 'CATEGORY', os parâmetros de categoria são necessários. Se for 'PRODUCT', os de produto são necessários.")
  @ApiResponse(responseCode = "201", description = "Promoção criada com sucesso")
  @ApiResponse(responseCode = "400", description = "Parâmetros inválidos ou faltando")
  public ResponseEntity<Deal> createDeals(
    @RequestParam("dealType") String dealType,
    @RequestParam(value = "discount", required = false) Integer discount,
    @RequestParam(value = "categoryId", required = false) Long categoryId,
    @RequestParam(value = "productId", required = false) Long productId,
    @RequestParam(value = "productDiscountPercent", required = false) Integer productDiscountPercent,
    @RequestParam(value = "originalPrice", required = false) String originalPrice,
    @RequestParam(value = "discountedPrice", required = false) String discountedPrice,
    @RequestParam(value = "dealName", required = false) String dealName,
    @RequestParam(value = "dealImage", required = false) String dealImage
  ) throws Exception {
    Deal deal = new Deal();
    deal.setDealType(DealType.valueOf(dealType));

    try {
      if ("CATEGORY".equals(dealType)) {
        if (categoryId == null) {
          throw new IllegalArgumentException("Categoria é obrigatória para promoções de categoria.");
        }
        deal.setCategory(new Category());
        deal.getCategory().setId(categoryId);
        deal.setDiscount(discount);
        deal.setDealName(dealName);
        deal.setDealImage(dealImage);
        if (originalPrice != null) deal.setOriginalPrice(new BigDecimal(originalPrice));
        if (discountedPrice != null) deal.setDiscountedPrice(new BigDecimal(discountedPrice));
      } else if ("PRODUCT".equals(dealType)) {
        if (productId == null) {
          throw new IllegalArgumentException("Produto é obrigatório para promoções de produto.");
        }
        deal.setProduct(new Product());
        deal.getProduct().setId(productId);
        deal.setProductDiscountPercent(productDiscountPercent);
        deal.setOriginalPrice(originalPrice != null ? new BigDecimal(originalPrice) : null);
        deal.setDiscountedPrice(discountedPrice != null ? new BigDecimal(discountedPrice) : null);
      }

      Deal createdDeal = dealService.createDeal(deal);
      return ResponseEntity.status(HttpStatus.CREATED).body(createdDeal);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }
  }

  @PatchMapping("/{id}")
  @Operation(summary = "Atualiza uma promoção existente",
    description = "Atualiza os dados de uma promoção com base em seu ID e 'dealType'.")
  @ApiResponse(responseCode = "200", description = "Promoção atualizada com sucesso")
  @ApiResponse(responseCode = "400", description = "Parâmetros inválidos")
  @ApiResponse(responseCode = "404", description = "Promoção não encontrada")
  public ResponseEntity<Deal> updateDeal(
    @PathVariable Long id,
    @RequestParam("dealType") String dealType,
    @RequestParam(value = "discount", required = false) Integer discount,
    @RequestParam(value = "categoryId", required = false) Long categoryId,
    @RequestParam(value = "productId", required = false) Long productId,
    @RequestParam(value = "productDiscountPercent", required = false) Integer productDiscountPercent,
    @RequestParam(value = "originalPrice", required = false) String originalPrice,
    @RequestParam(value = "discountedPrice", required = false) String discountedPrice,
    @RequestParam(value = "dealName", required = false) String dealName,
    @RequestParam(value = "dealImage", required = false) String dealImage
  ) throws Exception {

    Deal deal = new Deal();
    deal.setDealType(DealType.valueOf(dealType));

    try {
      if ("CATEGORY".equals(dealType)) {
        if (categoryId != null) {
          deal.setCategory(new Category());
          deal.getCategory().setId(categoryId);
        }
        deal.setDiscount(discount);
        deal.setDealName(dealName);
        deal.setDealImage(dealImage);
        if (originalPrice != null) deal.setOriginalPrice(new BigDecimal(originalPrice));
        if (discountedPrice != null) deal.setDiscountedPrice(new BigDecimal(discountedPrice));
      } else if ("PRODUCT".equals(dealType)) {
        if (productId != null) {
          deal.setProduct(new Product());
          deal.getProduct().setId(productId);
        }
        deal.setProductDiscountPercent(productDiscountPercent);
        if (originalPrice != null) deal.setOriginalPrice(new BigDecimal(originalPrice));
        if (discountedPrice != null) deal.setDiscountedPrice(new BigDecimal(discountedPrice));
      }

      Deal updatedDeal = dealService.updateDeal(deal, id);
      return ResponseEntity.ok(updatedDeal);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Deleta uma promoção", description = "Remove uma promoção do sistema com base no seu ID.")
  @ApiResponse(responseCode = "200", description = "Promoção deletada com sucesso")
  @ApiResponse(responseCode = "404", description = "Promoção não encontrada")
  @ApiResponse(responseCode = "500", description = "Erro interno ao deletar a promoção")
  public ResponseEntity<MessageResponse> deleteDeal(@PathVariable Long id) throws Exception {
    try {
      dealService.deleteDeal(id);
      MessageResponse response = new MessageResponse("Promoção deletada");
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(new MessageResponse("Erro ao deletar promoção: " + e.getMessage()));
    }
  }

  @GetMapping
  @Operation(summary = "Lista todas as promoções", description = "Retorna uma lista com todas as promoções cadastradas.")
  @ApiResponse(responseCode = "200", description = "Lista de promoções retornada com sucesso")
  public ResponseEntity<List<Deal>> getAllDeals() {
    try {
      List<Deal> deals = dealService.getDeals();
      return ResponseEntity.ok(deals);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
  }

  @ExceptionHandler(Exception.class)
  @Operation(summary = "Manipulador de exceções", description = "Captura exceções gerais na controller e retorna uma resposta de erro padronizada.", hidden = true)
  public ResponseEntity<MessageResponse> handleException(Exception e) {
    MessageResponse response = new MessageResponse();
    response.setMessage("Erro: " + e.getMessage());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
  }
}