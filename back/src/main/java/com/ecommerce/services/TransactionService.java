package com.ecommerce.services;

import com.ecommerce.model.entities.Order;
import com.ecommerce.model.entities.Seller;
import com.ecommerce.model.entities.Transaction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface TransactionService {

  void createTransaction(Order order);
  
  Transaction getTransactionByOrderId(Long orderId);

  List<Transaction> getTransactionsBySellerId(Seller seller);

  List<Transaction> getAllTransactions();

  List<Transaction> getTransactionsBySellerIdAndDateRange(Seller seller, LocalDateTime start, LocalDateTime end);

  Map<LocalDate, BigDecimal> getDailyEarnings(Seller seller, LocalDateTime start, LocalDateTime end);

  Map<String, BigDecimal> getMonthlyEarnings(Seller seller, int year);

  Map<String, BigDecimal> getWeeklyEarnings(Seller seller, int year, int month);

  Map<String, BigDecimal> getHourlyEarnings(Seller seller, LocalDate date);
}
