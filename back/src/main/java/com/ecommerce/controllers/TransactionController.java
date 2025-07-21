package com.ecommerce.controllers;

import com.ecommerce.model.entities.Seller;
import com.ecommerce.model.entities.Transaction;
import com.ecommerce.services.SellerService;
import com.ecommerce.services.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/transactions")
@Tag(name = "Transações", description = "Endpoints para consultar transações")
public class TransactionController {

  private final TransactionService transactionService;
  private final SellerService sellerService;

  @GetMapping("/seller")
  @Operation(summary = "Lista as transações do vendedor", description = "Retorna uma lista de todas as transações associadas ao vendedor autenticado.")
  @ApiResponse(responseCode = "200", description = "Transações retornadas com sucesso")
  public ResponseEntity<List<Transaction>> getTransactionBySeller(@RequestHeader("Authorization") String jwt) throws Exception {
    Seller seller = sellerService.getSellerByJwtToken(jwt);
    List<Transaction> transactions = transactionService.getTransactionsBySellerId(seller);

    return ResponseEntity.ok(transactions);
  }

  @GetMapping
  @Operation(summary = "Lista todas as transações (Admin)", description = "Retorna uma lista de todas as transações no sistema. Requer privilégios de administrador.")
  @ApiResponse(responseCode = "200", description = "Transações retornadas com sucesso")
  public ResponseEntity<List<Transaction>> getAllTransactions() {
    List<Transaction> transactions = transactionService.getAllTransactions();
    
    return ResponseEntity.ok(transactions);
  }
}