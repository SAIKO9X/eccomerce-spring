package com.ecommerce.controllers;

import com.ecommerce.model.entities.Product;
import com.ecommerce.model.entities.Review;
import com.ecommerce.model.entities.User;
import com.ecommerce.request.CreateReviewRequest;
import com.ecommerce.response.MessageResponse;
import com.ecommerce.services.ProductService;
import com.ecommerce.services.ReviewService;
import com.ecommerce.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Tag(name = "Avaliações (Reviews)", description = "Endpoints para criar e gerenciar avaliações de produtos")
public class ReviewController {

  private final ReviewService reviewService;
  private final ProductService productService;
  private final UserService userService;

  @GetMapping("/products/{productId}/reviews")
  @Operation(summary = "Lista as avaliações de um produto", description = "Retorna todas as avaliações associadas a um ID de produto específico.")
  @ApiResponse(responseCode = "200", description = "Avaliações listadas com sucesso")
  public ResponseEntity<List<Review>> getReviewsByProductId(@PathVariable Long productId) {
    List<Review> reviews = reviewService.getReviewByProductId(productId);

    return ResponseEntity.ok(reviews);
  }

  @PostMapping("/products/{productId}/reviews")
  @Operation(summary = "Cria uma nova avaliação", description = "Permite que um usuário autenticado crie uma nova avaliação para um produto.")
  @ApiResponse(responseCode = "200", description = "Avaliação criada com sucesso")
  @ApiResponse(responseCode = "404", description = "Produto não encontrado")
  public ResponseEntity<Review> writeReview(
    @RequestBody CreateReviewRequest request,
    @RequestHeader("Authorization") String jwt,
    @PathVariable Long productId
  ) throws Exception {
    User user = userService.findUserByJwtToken(jwt);
    Product product = productService.findProductById(productId);
    Review review = reviewService.createReview(request, user, product);

    return ResponseEntity.ok(review);
  }

  @PatchMapping("/reviews/{reviewId}")
  @Operation(summary = "Atualiza uma avaliação existente", description = "Permite que um usuário autenticado atualize sua própria avaliação.")
  @ApiResponse(responseCode = "200", description = "Avaliação atualizada com sucesso")
  @ApiResponse(responseCode = "404", description = "Avaliação não encontrada")
  public ResponseEntity<Review> updateReview(
    @RequestBody CreateReviewRequest request,
    @RequestHeader("Authorization") String jwt,
    @PathVariable Long reviewId
  ) throws Exception {
    User user = userService.findUserByJwtToken(jwt);
    Review review = reviewService.updateReview(reviewId, request.getReviewText(), request.getReviewRating(), user.getId());

    return ResponseEntity.ok(review);
  }

  @DeleteMapping("/reviews/{reviewId}")
  @Operation(summary = "Deleta uma avaliação", description = "Permite que um usuário autenticado delete sua própria avaliação.")
  @ApiResponse(responseCode = "200", description = "Avaliação deletada com sucesso")
  @ApiResponse(responseCode = "404", description = "Avaliação não encontrada")
  public ResponseEntity<MessageResponse> deleteReview(@RequestHeader("Authorization") String jwt, @PathVariable Long reviewId) throws Exception {
    User user = userService.findUserByJwtToken(jwt);
    reviewService.deleteReview(reviewId, user.getId());

    MessageResponse response = new MessageResponse();
    response.setMessage("Review Deleted Successfully");

    return ResponseEntity.ok(response);
  }

  @GetMapping("/reviews/user/{userId}")
  @Operation(summary = "Busca avaliações por ID de usuário", description = "Retorna todas as avaliações feitas por um usuário específico.")
  @ApiResponse(responseCode = "200", description = "Avaliações retornadas com sucesso")
  public ResponseEntity<List<Review>> getReviewsByUserId(@PathVariable Long userId) throws Exception {
    List<Review> reviews = reviewService.getReviewsByUserId(userId);

    return ResponseEntity.ok(reviews);
  }
}