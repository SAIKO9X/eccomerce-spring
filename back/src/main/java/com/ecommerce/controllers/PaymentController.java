package com.ecommerce.controllers;

import com.ecommerce.domain.enums.PaymentOrderStatus;
import com.ecommerce.model.entities.Order;
import com.ecommerce.model.entities.PaymentOrder;
import com.ecommerce.model.entities.Seller;
import com.ecommerce.model.entities.SellerReport;
import com.ecommerce.response.MessageResponse;
import com.ecommerce.services.PaymentService;
import com.ecommerce.services.SellerReportService;
import com.ecommerce.services.SellerService;
import com.ecommerce.services.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payment")
@Tag(name = "Pagamento", description = "Endpoints para processamento de pagamentos")
public class PaymentController {

  private final PaymentService paymentService;
  private final SellerService sellerService;
  private final SellerReportService sellerReportService;
  private final TransactionService transactionService;

  @GetMapping("/{paymentId}")
  @Operation(summary = "Processa a confirmação de um pagamento", description = "Endpoint de callback para ser chamado pelo gateway de pagamento após a conclusão. Ele finaliza o pedido e atualiza os relatórios.")
  @ApiResponse(responseCode = "200", description = "Pagamento processado com sucesso ou status de já processado retornado")
  public ResponseEntity<MessageResponse> paymentSuccess(
    @PathVariable String paymentId,
    @RequestParam String paymentLinkId
  ) throws Exception {
    PaymentOrder paymentOrder = paymentService.getPaymentOrderByPaymentId(paymentLinkId);

    if (paymentOrder.getStatus() != PaymentOrderStatus.PENDING) {
      MessageResponse response = new MessageResponse();
      response.setMessage("Payment already processed");
      return ResponseEntity.ok(response);
    }

    boolean paymentSuccess = paymentService.ProceedPaymentOrder(paymentOrder, paymentId, paymentLinkId);

    if (paymentSuccess) {
      for (Order order : paymentOrder.getOrders()) {
        if (transactionService.getTransactionByOrderId(order.getId()) == null) {
          transactionService.createTransaction(order);
        }
        Seller seller = sellerService.getSellerById(order.getSellerId());
        SellerReport report = sellerReportService.getSellerReport(seller);
        report.setTotalOrders(report.getTotalOrders() + 1);
        report.setTotalEarnings(report.getTotalEarnings().add(order.getTotalSellingPrice()));
        report.setTotalSales(report.getTotalSales().add(BigDecimal.valueOf(order.getOrderItems().size())));
        sellerReportService.updateSellerReport(report);
      }
    }

    MessageResponse response = new MessageResponse();
    response.setMessage("Payment Successful");
    
    return ResponseEntity.ok(response);
  }
}