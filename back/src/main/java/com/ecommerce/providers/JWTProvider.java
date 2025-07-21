package com.ecommerce.providers;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Service
public class JWTProvider {

  @Value("${security.token.secret}")
  private String secretKey;

  public Claims validateToken(String token) {
    if (token.startsWith("Bearer ")) {
      token = token.substring(7);
    }

    SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());

    try {
      return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    } catch (JwtException e) {
      throw new JwtException("Invalid token");
    }
  }


  public String generateToken(Authentication auth) {
    Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
    String roles = populateAuthorities(authorities);

    SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());

    return Jwts.builder().issuedAt(new Date()).claim("email", auth.getName()).claim("authorities", roles).signWith(key).compact();
  }

  public String getEmailFromJwtToken(String header) {
    Claims token = validateToken(header);
    return token != null ? String.valueOf(token.get("email")) : null;
  }

  private String populateAuthorities(Collection<? extends GrantedAuthority> authorities) {
    Set<String> auths = new HashSet<>();

    for (GrantedAuthority authority : authorities) {
      auths.add(authority.getAuthority());
    }

    return String.join(",", auths);
  }
}
