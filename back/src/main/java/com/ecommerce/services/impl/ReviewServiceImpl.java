package com.ecommerce.services.impl;

import com.ecommerce.model.entities.Product;
import com.ecommerce.model.entities.Review;
import com.ecommerce.model.entities.User;
import com.ecommerce.repositories.ProductRepository;
import com.ecommerce.repositories.ReviewRepository;
import com.ecommerce.request.CreateReviewRequest;
import com.ecommerce.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

  private final ReviewRepository reviewRepository;
  private final ProductRepository productRepository;

  @Override
  public Review createReview(CreateReviewRequest request, User user, Product product) {
    Review review = new Review();
    review.setUser(user);
    review.setProduct(product);
    review.setReviewText(request.getReviewText());
    review.setRating(request.getReviewRating());
    review.setProductImages(request.getProductImages());

    reviewRepository.save(review);
    updateProductRating(product);

    return review;
  }

  @Override
  public List<Review> getReviewByProductId(Long productId) {
    return reviewRepository.findByProductId(productId);
  }

  @Override
  public Review updateReview(Long reviewId, String reviewText, double rating, Long userId) throws Exception {
    Review review = getReviewById(reviewId);

    if (review.getUser().getId().equals(userId)) {
      review.setReviewText(reviewText);
      review.setRating(rating);
      reviewRepository.save(review);
      updateProductRating(review.getProduct());
      return review;
    }

    throw new Exception("you cant update this review");
  }

  @Override
  public void deleteReview(Long reviewId, Long userId) throws Exception {
    Review review = getReviewById(reviewId);
    Product product = review.getProduct();

    if (!review.getUser().getId().equals(userId)) {
      throw new Exception("Você não pode excluir esta avaliação");
    }

    reviewRepository.delete(review);
    updateProductRating(product);
  }

  @Override
  public Review getReviewById(Long reviewId) throws Exception {
    return reviewRepository.findById(reviewId).orElseThrow(() -> new Exception("review not found"));
  }

  @Override
  public List<Review> getReviewsByUserId(Long userId) {
    return reviewRepository.findByUserId(userId);
  }

  private void updateProductRating(Product product) {
    List<Review> reviews = reviewRepository.findByProductId(product.getId());
    if (reviews.isEmpty()) {
      product.setAverageRating(0.0);
      product.setTotalReviews(0);
    } else {
      double average = reviews.stream().mapToDouble(Review::getRating).average().orElse(0.0);
      product.setAverageRating(average);
      product.setTotalReviews(reviews.size());
    }
    productRepository.save(product);
  }
}