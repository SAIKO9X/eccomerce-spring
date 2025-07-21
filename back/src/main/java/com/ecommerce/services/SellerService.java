package com.ecommerce.services;

import com.ecommerce.domain.enums.AccountStatus;
import com.ecommerce.exceptions.SellerException;
import com.ecommerce.model.entities.Seller;

import java.util.List;

public interface SellerService {

  Seller getSellerByJwtToken(String token) throws Exception;

  Seller getSellerById(Long id) throws SellerException;

  Seller getSellerByEmail(String email) throws Exception;

  List<Seller> getAllSellers(AccountStatus status);

  Seller createSeller(Seller seller) throws Exception;

  void deleteSeller(Long id) throws Exception;

  Seller updateSeller(Seller seller, Long id) throws Exception;

  Seller verifyEmail(String email, String otp) throws Exception;

  Seller updateSellerAccountStatus(Long sellerId, AccountStatus status) throws Exception;
}
