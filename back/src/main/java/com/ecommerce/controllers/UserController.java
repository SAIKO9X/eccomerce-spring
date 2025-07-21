package com.ecommerce.controllers;

import com.ecommerce.model.entities.Address;
import com.ecommerce.model.entities.User;
import com.ecommerce.repositories.AddressRepository;
import com.ecommerce.response.MessageResponse;
import com.ecommerce.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
@Tag(name = "Usuários", description = "Endpoints para gerenciamento de perfis e endereços de usuários")
public class UserController {

  private final UserService userService;
  private final AddressRepository addressRepository;

  @GetMapping("/profile")
  @Operation(summary = "Busca o perfil do usuário autenticado", description = "Retorna os dados completos do perfil do usuário logado.")
  @ApiResponse(responseCode = "200", description = "Perfil retornado com sucesso")
  public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt) throws Exception {
    User user = userService.findUserByJwtToken(jwt);

    return ResponseEntity.ok(user);
  }

  @PutMapping("/profile")
  @Operation(summary = "Atualiza o perfil do usuário", description = "Permite que o usuário autenticado atualize suas informações de perfil, como nome e celular.")
  @ApiResponse(responseCode = "200", description = "Perfil atualizado com sucesso")
  @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
  public ResponseEntity<User> updateUserProfile(@RequestHeader("Authorization") String jwt, @RequestBody User reqUser) throws Exception {
    User user = userService.findUserByJwtToken(jwt);
    User updatedUser = userService.updateUser(user.getId(), reqUser);
    
    return ResponseEntity.ok(updatedUser);
  }

  @PostMapping("/address")
  @Operation(summary = "Adiciona um novo endereço", description = "Adiciona um novo endereço de entrega ao perfil do usuário autenticado.")
  @ApiResponse(responseCode = "201", description = "Endereço adicionado com sucesso")
  public ResponseEntity<Address> addAddress(@RequestHeader("Authorization") String jwt, @RequestBody Address address) throws Exception {
    User user = userService.findUserByJwtToken(jwt);

    address.setUser(user);
    Address savedAddress = addressRepository.save(address);

    return ResponseEntity.status(HttpStatus.CREATED).body(savedAddress);
  }

  @PutMapping("/address/{addressId}")
  @Operation(summary = "Atualiza um endereço existente", description = "Atualiza os dados de um endereço de entrega específico do usuário.")
  @ApiResponse(responseCode = "200", description = "Endereço atualizado com sucesso")
  @ApiResponse(responseCode = "404", description = "Endereço ou usuário não encontrado")
  public ResponseEntity<Address> updateUserAddress(
    @RequestHeader("Authorization") String jwt,
    @PathVariable Long addressId,
    @RequestBody Address address
  ) throws Exception {
    User user = userService.findUserByJwtToken(jwt);
    Address updatedAddress = userService.updateUserAddress(user.getId(), addressId, address);

    return ResponseEntity.ok(updatedAddress);
  }

  @DeleteMapping("/address/{addressId}")
  @Operation(summary = "Deleta um endereço", description = "Remove um endereço de entrega do perfil do usuário.")
  @ApiResponse(responseCode = "200", description = "Endereço deletado com sucesso")
  @ApiResponse(responseCode = "404", description = "Endereço ou usuário não encontrado")
  public ResponseEntity<MessageResponse> deleteUserAddress(@RequestHeader("Authorization") String jwt, @PathVariable Long addressId) throws Exception {
    User user = userService.findUserByJwtToken(jwt);
    userService.deleteUserAddress(user.getId(), addressId);

    return ResponseEntity.ok(new MessageResponse("Address deleted successfully"));
  }
}