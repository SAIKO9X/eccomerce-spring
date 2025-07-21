package com.ecommerce.repositories;

import com.ecommerce.model.entities.Deal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DealRepository extends JpaRepository<Deal, Long> {
}
