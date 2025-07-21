package com.ecommerce.controllers;

import com.ecommerce.domain.enums.AccountStatus;
import com.ecommerce.model.entities.Seller;
import com.ecommerce.model.entities.User;
import com.ecommerce.services.SellerService;
import com.ecommerce.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
@Tag(name = "Admin", description = "Endpoints para operações administrativas")
public class AdminController {

  private final SellerService sellerService;
  private final UserService userService;

  @PatchMapping("/sellers/{id}/status/{status}")
  @Operation(summary = "Atualiza o status de um vendedor", description = "Altera o status da conta de um vendedor (ex: ATIVO, SUSPENSO, BANIDO).")
  @ApiResponse(responseCode = "200", description = "Status do vendedor atualizado com sucesso")
  @ApiResponse(responseCode = "404", description = "Vendedor não encontrado")
  public ResponseEntity<Seller> updateSellerStatus(@PathVariable Long id, @PathVariable AccountStatus status) throws Exception {
    Seller updatedSeller = sellerService.updateSellerAccountStatus(id, status);
    return ResponseEntity.ok(updatedSeller);
  }

  @PutMapping("/profile")
  @Operation(summary = "Atualiza o perfil do administrador", description = "Permite que o administrador autenticado atualize suas próprias informações de perfil.")
  @ApiResponse(responseCode = "200", description = "Perfil do administrador atualizado com sucesso")
  @ApiResponse(responseCode = "404", description = "Administrador não encontrado")
  public ResponseEntity<User> updateAdminProfile(@RequestHeader("Authorization") String jwt, @RequestBody User reqUser) throws Exception {
    User admin = userService.findUserByJwtToken(jwt);
    User updatedAdmin = userService.updateAdmin(admin.getId(), reqUser);
    return ResponseEntity.ok(updatedAdmin);
  }
}