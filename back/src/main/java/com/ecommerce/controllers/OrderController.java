package com.ecommerce.controllers;

import com.ecommerce.domain.enums.PaymentMethod;
import com.ecommerce.model.entities.*;
import com.ecommerce.repositories.PaymentOrderRepository;
import com.ecommerce.response.PaymentLinkResponse;
import com.ecommerce.services.*;
import com.mercadopago.resources.preference.Preference;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
@Tag(name = "Pedidos", description = "Endpoints para criar e gerenciar pedidos de compra")
public class OrderController {

  private final OrderService orderService;
  private final UserService userService;
  private final SellerService sellerService;
  private final SellerReportService sellerReportService;
  private final PaymentService paymentService;
  private final PaymentOrderRepository paymentOrderRepository;

  @PostMapping
  @Operation(summary = "Cria um novo pedido e gera um link de pagamento",
    description = "Cria um ou mais pedidos a partir dos itens do carrinho, associa a um endereço de entrega e gera um link de pagamento (Stripe ou Mercado Pago).")
  @ApiResponse(responseCode = "201", description = "Pedido criado e link de pagamento gerado com sucesso")
  public ResponseEntity<PaymentLinkResponse> createOrder(
    @RequestBody Address shippingAddress,
    @RequestParam PaymentMethod paymentMethod,
    @RequestHeader("Authorization") String jwt,
    @RequestParam List<Long> cartItemIds
  ) throws Exception {
    User user = userService.findUserByJwtToken(jwt);

    Set<Order> orders = orderService.createOrder(user, shippingAddress, cartItemIds);
    PaymentOrder paymentOrder = paymentService.createOrder(user, orders, paymentMethod);

    for (Order order : orders) {
      order.setPaymentOrder(paymentOrder);
    }

    orderService.saveAll(orders);

    PaymentLinkResponse response = new PaymentLinkResponse();

    if (paymentMethod.equals(PaymentMethod.MERCADO_PAGO)) {
      Preference preference = paymentService.createMercadoPagoPaymentLink(user, paymentOrder.getAmount(), paymentOrder.getId());
      response.setPayment_link_url(preference.getInitPoint());
      response.setPayment_link_id(preference.getId());
      paymentOrder.setPaymentLinkId(preference.getId());
      paymentOrderRepository.save(paymentOrder);
    } else {
      PaymentLinkResponse stripeResponse = paymentService.createStripePaymentLink(user, paymentOrder.getAmount(), paymentOrder.getId());
      response.setPayment_link_url(stripeResponse.getPayment_link_url());
      response.setPayment_link_id(stripeResponse.getPayment_link_id());
      paymentOrder.setPaymentLinkId(stripeResponse.getPayment_link_id());
      paymentOrderRepository.save(paymentOrder);
    }

    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @GetMapping("/user")
  @Operation(summary = "Busca o histórico de pedidos do usuário", description = "Retorna uma lista de todos os pedidos concluídos pelo usuário autenticado.")
  @ApiResponse(responseCode = "200", description = "Histórico de pedidos retornado com sucesso")
  public ResponseEntity<List<Order>> usersOrderHistory(@RequestHeader("Authorization") String jwt) throws Exception {
    User user = userService.findUserByJwtToken(jwt);
    List<Order> orders = orderService.usersOrderHistory(user.getId());
    return ResponseEntity.ok(orders);
  }

  @GetMapping("/{orderId}")
  @Operation(summary = "Busca um pedido pelo ID", description = "Retorna os detalhes de um pedido específico com base no seu ID.")
  @ApiResponse(responseCode = "200", description = "Pedido retornado com sucesso")
  @ApiResponse(responseCode = "404", description = "Pedido não encontrado")
  public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) throws Exception {
    Order orders = orderService.findOrderById(orderId);
    return ResponseEntity.ok(orders);
  }

  @GetMapping("/item/{orderItemId}")
  @Operation(summary = "Busca um item de pedido pelo ID", description = "Retorna os detalhes de um item de pedido específico.")
  @ApiResponse(responseCode = "200", description = "Item de pedido retornado com sucesso")
  @ApiResponse(responseCode = "404", description = "Item de pedido não encontrado")
  public ResponseEntity<OrderItem> getOrderItemById(@PathVariable Long orderItemId) throws Exception {
    OrderItem item = orderService.findOrderItemById(orderItemId);
    return ResponseEntity.ok(item);
  }

  @PutMapping("/{orderId}/cancel")
  @Operation(summary = "Cancela um pedido", description = "Permite que um usuário autenticado cancele um de seus próprios pedidos.")
  @ApiResponse(responseCode = "200", description = "Pedido cancelado com sucesso")
  @ApiResponse(responseCode = "404", description = "Pedido não encontrado")
  public ResponseEntity<Order> cancelOrder(@PathVariable Long orderId, @RequestHeader("Authorization") String jwt) throws Exception {
    User user = userService.findUserByJwtToken(jwt);
    Order order = orderService.cancelOrder(orderId, user);

    Seller seller = sellerService.getSellerById(order.getSellerId());
    SellerReport report = sellerReportService.getSellerReport(seller);

    report.setCanceledOrders(report.getCanceledOrders() + 1);
    report.setTotalRefunds(report.getTotalRefunds().add(order.getTotalSellingPrice()));
    sellerReportService.updateSellerReport(report);

    return ResponseEntity.ok(order);
  }
}