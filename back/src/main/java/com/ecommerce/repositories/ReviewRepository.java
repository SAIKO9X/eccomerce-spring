package com.ecommerce.repositories;

import com.ecommerce.model.entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

  List<Review> findByProductId(Long productId);

  List<Review> findByUserId(Long userId);
}
