package com.ecommerce.repositories;

import com.ecommerce.model.entities.SellerReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerReportRepository extends JpaRepository<SellerReport, Long> {

  SellerReport findBySellerId(Long sellerId);
}
