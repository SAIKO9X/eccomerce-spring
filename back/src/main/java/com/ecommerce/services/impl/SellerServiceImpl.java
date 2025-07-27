package com.ecommerce.services.impl;

import com.ecommerce.domain.enums.AccountStatus;
import com.ecommerce.domain.enums.USER_ROLE;
import com.ecommerce.exceptions.SellerException;
import com.ecommerce.model.entities.Address;
import com.ecommerce.model.entities.Seller;
import com.ecommerce.providers.JWTProvider;
import com.ecommerce.repositories.AddressRepository;
import com.ecommerce.repositories.SellerRepository;
import com.ecommerce.services.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {

  private final SellerRepository sellerRepository;
  private final JWTProvider jwtProvider;
  private final PasswordEncoder passwordEncoder;
  private final AddressRepository addressRepository;


  @Override
  public Seller getSellerByJwtToken(String token) throws Exception {
    String email = jwtProvider.getEmailFromJwtToken(token);
    return this.getSellerByEmail(email);
  }

  @Override
  public Seller getSellerById(Long id) throws SellerException {
    return sellerRepository.findById(id).orElseThrow(() -> new SellerException("Vendedor não encontrado com o id: " + id));
  }

  @Override
  public Seller getSellerByEmail(String email) throws Exception {
    return sellerRepository.findByEmail(email)
      .orElseThrow(() -> new Exception("Vendedor não encontrado com o email: " + email));
  }

  @Override
  public List<Seller> getAllSellers(AccountStatus status) {
    return sellerRepository.findByAccountStatus(status);
  }

  @Override
  public Seller createSeller(Seller seller) throws Exception {
    String sellerEmail = seller.getBusinessDetails().getBusinessEmail();

    if (sellerRepository.findByEmail(sellerEmail).isPresent()) {
      throw new Exception("Já existe um vendedor com esse e-mail, use um e-mail diferente");
    }

    Address savedAddress = addressRepository.save(seller.getPickupAddress());

    Seller newSeller = new Seller();
    newSeller.setEmail(sellerEmail);
    newSeller.setSellerName(seller.getSellerName());
    newSeller.setCNPJ(seller.getCNPJ());
    newSeller.setPickupAddress(savedAddress);
    newSeller.setRole(USER_ROLE.ROLE_SELLER);
    newSeller.setMobile(seller.getMobile());
    newSeller.setBusinessDetails(seller.getBusinessDetails());
    newSeller.setBankDetails(seller.getBankDetails());

    return sellerRepository.saveAndFlush(newSeller);
  }

  @Override
  public void deleteSeller(Long id) throws Exception {
    Seller seller = getSellerById(id);
    sellerRepository.delete(seller);
  }

  @Override
  public Seller updateSeller(Seller seller, Long id) throws Exception {
    Seller existingSeller = getSellerById(id);

    if (seller.getSellerName() != null) {
      existingSeller.setSellerName(seller.getSellerName());
    }
    if (seller.getEmail() != null) {
      existingSeller.setEmail(seller.getEmail());
    }
    if (seller.getMobile() != null) {
      existingSeller.setMobile(seller.getMobile());
    }
    if (seller.getCNPJ() != null) {
      existingSeller.setCNPJ(seller.getCNPJ());
    }
    if (seller.getBusinessDetails() != null && seller.getBusinessDetails().getLogo() != null) {
      existingSeller.getBusinessDetails().setLogo(seller.getBusinessDetails().getLogo());
    }
    if (seller.getBusinessDetails() != null && seller.getBusinessDetails().getBusinessName() != null) {
      existingSeller.getBusinessDetails().setBusinessName(seller.getBusinessDetails().getBusinessName());
    }
    if (
      seller.getBankDetails() != null &&
        seller.getBankDetails().getAccountHoldName() != null &&
        seller.getBankDetails().getAccountNumber() != null &&
        seller.getBankDetails().getIfscCode() != null
    ) {
      existingSeller.getBankDetails().setAccountHoldName(seller.getBankDetails().getAccountHoldName());
      existingSeller.getBankDetails().setAccountNumber(seller.getBankDetails().getAccountNumber());
      existingSeller.getBankDetails().setIfscCode(seller.getBankDetails().getIfscCode());
    }
    if (
      seller.getPickupAddress() != null &&
        seller.getPickupAddress().getAddress() != null &&
        seller.getPickupAddress().getRecipient() != null &&
        seller.getPickupAddress().getMobile() != null &&
        seller.getPickupAddress().getCity() != null &&
        seller.getPickupAddress().getState() != null
    ) {
      existingSeller.getPickupAddress().setAddress(seller.getPickupAddress().getAddress());
      existingSeller.getPickupAddress().setRecipient(seller.getPickupAddress().getRecipient());
      existingSeller.getPickupAddress().setMobile(seller.getPickupAddress().getMobile());
      existingSeller.getPickupAddress().setCity(seller.getPickupAddress().getCity());
      existingSeller.getPickupAddress().setState(seller.getPickupAddress().getState());
    }
    if (seller.getCNPJ() != null) {
      existingSeller.setCNPJ(seller.getCNPJ());
    }

    return sellerRepository.save(existingSeller);
  }

  @Override
  public Seller verifyEmail(String email, String otp) throws Exception {
    Seller seller = getSellerByEmail(email);
    seller.setEmailVerified(true);
    seller.setAccountStatus(AccountStatus.ACTIVE);
    return sellerRepository.save(seller);
  }

  @Override
  public Seller updateSellerAccountStatus(Long sellerId, AccountStatus status) throws Exception {
    Seller seller = getSellerById(sellerId);
    seller.setAccountStatus(status);
    return sellerRepository.save(seller);
  }
}