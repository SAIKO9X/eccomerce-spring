package com.ecommerce.services;

import com.ecommerce.model.entities.Seller;
import com.ecommerce.model.entities.SellerReport;

public interface SellerReportService {

  SellerReport getSellerReport(Seller seller);

  void updateSellerReport(SellerReport sellerReport);
}
