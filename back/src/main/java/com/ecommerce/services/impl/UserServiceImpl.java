package com.ecommerce.services.impl;

import com.ecommerce.model.entities.Address;
import com.ecommerce.model.entities.User;
import com.ecommerce.providers.JWTProvider;
import com.ecommerce.repositories.AddressRepository;
import com.ecommerce.repositories.UserRepository;
import com.ecommerce.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final JWTProvider jwtProvider;
  private final AddressRepository addressRepository;
  private final PasswordEncoder passwordEncoder;

  @Override
  @Transactional
  public User findUserByJwtToken(String token) throws Exception {
    String email = jwtProvider.getEmailFromJwtToken(token);
    User user = this.findUserByEmail(email);

    user.getAddresses().size();

    return user;
  }

  @Override
  public User findUserByEmail(String email) throws Exception {
    return userRepository.findByEmail(email)
      .orElseThrow(() -> new Exception("user not found with this email: " + email));
  }

  @Override
  public User updateUser(Long userId, User reqUser) throws Exception {
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new Exception("user not found with id: " + userId));

    if (reqUser.getFullName() != null) {
      user.setFullName(reqUser.getFullName());
    }

    if (reqUser.getMobile() != null) {
      user.setMobile(reqUser.getMobile());
    }

    if (reqUser.getAvatar() != null) {
      user.setAvatar(reqUser.getAvatar());
    }

    return userRepository.save(user);
  }

  @Override
  public Address updateUserAddress(Long userId, Long addressId, Address address) throws Exception {
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new Exception("User not found with id: " + userId));

    Address existingAddress = addressRepository.findById(addressId)
      .orElseThrow(() -> new Exception("Address not found with id: " + addressId));

    if (!user.getAddresses().contains(existingAddress)) {
      throw new Exception("Address does not belong to the user.");
    }

    if (address.getRecipient() != null) existingAddress.setRecipient(address.getRecipient());
    if (address.getAddress() != null) existingAddress.setAddress(address.getAddress());
    if (address.getCity() != null) existingAddress.setCity(address.getCity());
    if (address.getState() != null) existingAddress.setState(address.getState());
    if (address.getCep() != null) existingAddress.setCep(address.getCep());
    if (address.getMobile() != null) existingAddress.setMobile(address.getMobile());

    return addressRepository.save(existingAddress);
  }

  @Override
  public void deleteUserAddress(Long userId, Long addressId) throws Exception {
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new Exception("User not found with id: " + userId));

    Address address = addressRepository.findById(addressId)
      .orElseThrow(() -> new Exception("Address not found with id: " + addressId));

    user.getAddresses().remove(address);
    userRepository.save(user);
    addressRepository.delete(address);
  }

  @Override
  public User updateAdmin(Long userId, User reqUser) throws Exception {
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new Exception("User not found with id: " + userId));

    if (reqUser.getFullName() != null) {
      user.setFullName(reqUser.getFullName());
    }
    if (reqUser.getEmail() != null) {
      user.setEmail(reqUser.getEmail());
    }
    if (reqUser.getPassword() != null && !reqUser.getPassword().isEmpty()) {
      user.setPassword(passwordEncoder.encode(reqUser.getPassword()));
    }

    return userRepository.save(user);
  }
}