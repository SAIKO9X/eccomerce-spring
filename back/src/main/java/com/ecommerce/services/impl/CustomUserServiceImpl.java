package com.ecommerce.services.impl;

import com.ecommerce.domain.enums.USER_ROLE;
import com.ecommerce.model.entities.Seller;
import com.ecommerce.model.entities.User;
import com.ecommerce.repositories.SellerRepository;
import com.ecommerce.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserServiceImpl implements UserDetailsService {

  private final UserRepository userRepository;
  private final SellerRepository sellerRepository;
  private static final String SELLER_PREFIX = "seller_";

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

    if (username.startsWith(SELLER_PREFIX)) {
      String actualUsername = username.substring(SELLER_PREFIX.length());
      Optional<Seller> seller = sellerRepository.findByEmail(actualUsername);
      if (seller.isPresent()) {
        return buildUserDetails(seller.get().getEmail(), seller.get().getPassword(), seller.get().getRole());
      }
    } else {
      Optional<User> user = userRepository.findByEmail(username);
      if (user.isPresent()) {
        return buildUserDetails(user.get().getEmail(), user.get().getPassword(), user.get().getRole());
      }
    }

    throw new UsernameNotFoundException("Usuário ou vendedor não encontrado com o email: " + username);
  }

  private UserDetails buildUserDetails(String email, String password, USER_ROLE role) {

    if (role == null) {
      role = USER_ROLE.ROLE_CUSTOMER;
    }

    List<GrantedAuthority> authorityList = new ArrayList<>();
    authorityList.add(new SimpleGrantedAuthority(role.toString()));

    return new org.springframework.security.core.userdetails.User(email, password, authorityList);
  }
}