package com.ecommerce.services;

import com.ecommerce.model.entities.Product;
import com.ecommerce.model.entities.Review;
import com.ecommerce.model.entities.User;
import com.ecommerce.request.CreateReviewRequest;

import java.util.List;

public interface ReviewService {

  Review createReview(CreateReviewRequest request, User user, Product product);

  List<Review> getReviewByProductId(Long productId);

  Review updateReview(Long reviewId, String reviewText, double rating, Long userId) throws Exception;

  void deleteReview(Long reviewId, Long userId) throws Exception;

  Review getReviewById(Long reviewId) throws Exception;

  List<Review> getReviewsByUserId(Long userId);
}
