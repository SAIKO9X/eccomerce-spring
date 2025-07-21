package com.ecommerce.services;

import com.ecommerce.model.entities.User;
import com.ecommerce.model.entities.Address; // Importar Address

public interface UserService {

  User findUserByJwtToken(String token) throws Exception;

  User findUserByEmail(String email) throws Exception;

  User updateUser(Long userId, User reqUser) throws Exception;

  Address updateUserAddress(Long userId, Long addressId, Address address) throws Exception;

  User updateAdmin(Long userId, User reqUser) throws Exception;

  void deleteUserAddress(Long userId, Long addressId) throws Exception;
}