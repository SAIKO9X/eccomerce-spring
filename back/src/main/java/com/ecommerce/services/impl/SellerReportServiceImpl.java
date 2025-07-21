package com.ecommerce.services.impl;

import com.ecommerce.model.entities.Seller;
import com.ecommerce.model.entities.SellerReport;
import com.ecommerce.repositories.SellerReportRepository;
import com.ecommerce.services.SellerReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SellerReportServiceImpl implements SellerReportService {

  private final SellerReportRepository sellerReportRepository;

  @Override
  public SellerReport getSellerReport(Seller seller) {
    SellerReport sellerReport = sellerReportRepository.findBySellerId(seller.getId());

    if (sellerReport == null) {
      SellerReport newSellerReport = new SellerReport();
      newSellerReport.setSeller(seller);
      return sellerReportRepository.save(newSellerReport);
    }

    return sellerReport;
  }

  @Override
  public void updateSellerReport(SellerReport sellerReport) {
    sellerReportRepository.save(sellerReport);
  }
}
