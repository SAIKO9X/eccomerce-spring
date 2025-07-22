package com.ecommerce.security;

import com.ecommerce.providers.JWTProvider;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtTokenValidator extends OncePerRequestFilter {

  private final JWTProvider jwtProvider;

  @Value("${security.token.secret}")
  private String secretKey;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    String header = request.getHeader("Authorization");

    if (header != null) {
      try {
        var token = this.jwtProvider.validateToken(header);
        String email = String.valueOf(token.get("email"));
        String authorities = String.valueOf(token.get("authorities"));

        List<GrantedAuthority> auth = AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);
        Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, auth);
        SecurityContextHolder.getContext().setAuthentication(authentication);
      } catch (ExpiredJwtException e) {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.getWriter().write("Token expired");
        return;
      } catch (JwtException e) {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.getWriter().write("Invalid token");
        return;
      }
    }

    filterChain.doFilter(request, response);
  }
}
