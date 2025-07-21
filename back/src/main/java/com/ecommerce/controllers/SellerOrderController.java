package com.ecommerce.controllers;

import com.ecommerce.domain.enums.OrderStatus;
import com.ecommerce.model.entities.Order;
import com.ecommerce.model.entities.Seller;
import com.ecommerce.services.OrderService;
import com.ecommerce.services.SellerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/seller/orders")
@Tag(name = "Pedidos (Vendedor)", description = "Endpoints para o vendedor gerenciar seus pedidos")
public class SellerOrderController {

  private final OrderService orderService;
  private final SellerService sellerService;

  @GetMapping
  @Operation(summary = "Lista todos os pedidos do vendedor", description = "Retorna uma lista de todos os pedidos associados ao vendedor autenticado.")
  @ApiResponse(responseCode = "200", description = "Pedidos retornados com sucesso")
  public ResponseEntity<List<Order>> getAllOrders(@RequestHeader("Authorization") String jwt) throws Exception {
    Seller seller = sellerService.getSellerByJwtToken(jwt);
    List<Order> orders = orderService.sellersOrder(seller.getId());

    return ResponseEntity.ok(orders);
  }

  @PatchMapping("/{orderId}/status/{orderStatus}")
  @Operation(summary = "Atualiza o status de um pedido", description = "Altera o status de um pedido específico (ex: ENVIADO, ENTREGUE).")
  @ApiResponse(responseCode = "200", description = "Status do pedido atualizado com sucesso")
  @ApiResponse(responseCode = "404", description = "Pedido não encontrado")
  public ResponseEntity<Order> updateOrderStatus(
    @PathVariable Long orderId,
    @PathVariable OrderStatus orderStatus
  ) throws Exception {
    Order order = orderService.updateOrderStatus(orderId, orderStatus);

    return ResponseEntity.ok(order);
  }
}