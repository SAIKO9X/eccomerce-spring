package com.ecommerce.controllers;

import com.ecommerce.domain.enums.CouponStatus;
import com.ecommerce.model.entities.Cart;
import com.ecommerce.model.entities.Coupon;
import com.ecommerce.model.entities.User;
import com.ecommerce.request.ApplyCouponRequest;
import com.ecommerce.services.CouponService;
import com.ecommerce.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/coupons")
@Tag(name = "Cupons", description = "Endpoints para gerenciamento e aplicação de cupons")
public class AdminCouponController {

  private final CouponService couponService;
  private final UserService userService;

  @PostMapping("/apply")
  @Operation(summary = "Aplica ou remove um cupom do carrinho", description = "Aplica um cupom se o campo 'apply' for 'true', ou o remove caso contrário.")
  @ApiResponse(responseCode = "200", description = "Operação com o cupom realizada com sucesso")
  public ResponseEntity<?> applyCoupon(@RequestBody ApplyCouponRequest request, @RequestHeader("Authorization") String jwt) throws Exception {
    User user = userService.findUserByJwtToken(jwt);
    Cart cart;

    if ("true".equalsIgnoreCase(request.getApply())) {
      cart = couponService.applyCoupon(request.getCode(), request.getOrderValue(), user);
    } else {
      cart = couponService.removeCoupon(request.getCode(), user);
    }
    
    return ResponseEntity.ok(cart);
  }

  @PostMapping("/admin/create")
  @Operation(summary = "Cria um novo cupom", description = "Endpoint administrativo para criar um novo cupom de desconto.")
  @ApiResponse(responseCode = "200", description = "Cupom criado com sucesso")
  public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon) {
    Coupon createdCoupon = couponService.createCoupon(coupon);
    return ResponseEntity.ok(createdCoupon);
  }

  @DeleteMapping("/admin/delete/{id}")
  @Operation(summary = "Deleta um cupom", description = "Endpoint administrativo para remover um cupom permanentemente.")
  @ApiResponse(responseCode = "200", description = "Cupom deletado com sucesso")
  public ResponseEntity<?> deleteCoupon(@PathVariable Long id) throws Exception {
    couponService.deleteCoupon(id);
    return ResponseEntity.ok("coupon deleted successfully");
  }

  @GetMapping("/admin/all")
  @Operation(summary = "Lista todos os cupons", description = "Endpoint administrativo para obter uma lista de todos os cupons cadastrados.")
  @ApiResponse(responseCode = "200", description = "Lista de cupons retornada com sucesso")
  public ResponseEntity<List<Coupon>> getAllCoupons() {
    List<Coupon> coupons = couponService.findAllCoupons();
    return ResponseEntity.ok(coupons);
  }

  @GetMapping("/admin/by-status")
  @Operation(summary = "Filtra cupons por status", description = "Endpoint administrativo para listar cupons com base em seu status (ATIVO, EXPIRADO, etc.).")
  @ApiResponse(responseCode = "200", description = "Lista de cupons filtrada retornada com sucesso")
  public ResponseEntity<List<Coupon>> getCouponsByStatus(@RequestParam CouponStatus status) {
    List<Coupon> coupons = couponService.findCouponsByStatus(status);
    return ResponseEntity.ok(coupons);
  }

  @PutMapping("/admin/activate/{id}")
  @Operation(summary = "Ativa um cupom", description = "Endpoint administrativo para ativar um cupom específico.")
  @ApiResponse(responseCode = "200", description = "Cupom ativado com sucesso")
  public ResponseEntity<Coupon> activateCoupon(@PathVariable Long id) throws Exception {
    Coupon updatedCoupon = couponService.activateCoupon(id);
    return ResponseEntity.ok(updatedCoupon);
  }

  @PutMapping("/admin/deactivate/{id}")
  @Operation(summary = "Desativa um cupom", description = "Endpoint administrativo para desativar um cupom específico.")
  @ApiResponse(responseCode = "200", description = "Cupom desativado com sucesso")
  public ResponseEntity<Coupon> deactivateCoupon(@PathVariable Long id) throws Exception {
    Coupon updatedCoupon = couponService.deactivateCoupon(id);
    return ResponseEntity.ok(updatedCoupon);
  }
}