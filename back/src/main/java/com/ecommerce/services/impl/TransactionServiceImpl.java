package com.ecommerce.services.impl;

import com.ecommerce.domain.enums.PaymentStatus;
import com.ecommerce.model.entities.Order;
import com.ecommerce.model.entities.Seller;
import com.ecommerce.model.entities.Transaction;
import com.ecommerce.repositories.SellerRepository;
import com.ecommerce.repositories.TransactionRepository;
import com.ecommerce.services.TransactionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.WeekFields;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

  private final TransactionRepository transactionRepository;
  private final SellerRepository sellerRepository;

  @Override
  public void createTransaction(Order order) {
    Seller seller = sellerRepository.findById(order.getSellerId())
      .orElseThrow(() -> new RuntimeException("Vendedor não encontrado"));
    Transaction transaction = new Transaction();
    transaction.setSeller(seller);
    transaction.setCustomer(order.getUser());
    transaction.setOrder(order);
    transactionRepository.save(transaction);
  }

  @Override
  public Transaction getTransactionByOrderId(Long orderId) {
    return transactionRepository.findByOrderId(orderId);
  }

  @Override
  public List<Transaction> getTransactionsBySellerId(Seller seller) {
    return transactionRepository.findBySellerId(seller.getId());
  }

  @Override
  public List<Transaction> getAllTransactions() {
    return transactionRepository.findAll();
  }

  @Override
  public List<Transaction> getTransactionsBySellerIdAndDateRange(Seller seller, LocalDateTime start, LocalDateTime end) {
    return transactionRepository.findBySellerIdAndDateBetween(seller.getId(), start, end);
  }

  @Override
  public Map<LocalDate, BigDecimal> getDailyEarnings(Seller seller, LocalDateTime start, LocalDateTime end) {
    List<Transaction> transactions = getTransactionsBySellerIdAndDateRange(seller, start, end);
    return transactions.stream()
      .filter(t -> t.getOrder().getPaymentStatus() == PaymentStatus.COMPLETED)
      .collect(Collectors.groupingBy(
        t -> t.getDate().toLocalDate(),
        Collectors.mapping(t -> t.getOrder().getTotalSellingPrice(), Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
      ));
  }

  @Override
  public Map<String, BigDecimal> getMonthlyEarnings(Seller seller, int year) {
    LocalDateTime start = LocalDateTime.of(year, 1, 1, 0, 0);
    LocalDateTime end = LocalDateTime.of(year, 12, 31, 23, 59);
    List<Transaction> transactions = transactionRepository.findBySellerIdAndDateBetween(seller.getId(), start, end);
    return transactions.stream()
      .filter(t -> t.getOrder().getPaymentStatus() == PaymentStatus.COMPLETED)
      .collect(Collectors.groupingBy(
        t -> t.getDate().getMonth().toString(),
        Collectors.mapping(t -> t.getOrder().getTotalSellingPrice(), Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
      ));
  }

  @Override
  public Map<String, BigDecimal> getWeeklyEarnings(Seller seller, int year, int month) {
    LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);
    LocalDateTime end = start.plusMonths(1).minusSeconds(1);
    List<Transaction> transactions = transactionRepository.findBySellerIdAndDateBetween(seller.getId(), start, end);
    return transactions.stream()
      .filter(t -> t.getOrder().getPaymentStatus() == PaymentStatus.COMPLETED)
      .collect(Collectors.groupingBy(
        t -> "Semana " + t.getDate().get(WeekFields.ISO.weekOfMonth()),
        Collectors.mapping(t -> t.getOrder().getTotalSellingPrice(), Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
      ));
  }

  @Override
  public Map<String, BigDecimal> getHourlyEarnings(Seller seller, LocalDate date) {
    LocalDateTime start = date.atStartOfDay();
    LocalDateTime end = date.atTime(23, 59, 59);
    List<Transaction> transactions = transactionRepository.findBySellerIdAndDateBetween(seller.getId(), start, end);
    return transactions.stream()
      .filter(t -> t.getOrder().getPaymentStatus() == PaymentStatus.COMPLETED)
      .collect(Collectors.groupingBy(
        t -> String.format("%02d:00", t.getDate().getHour()),
        Collectors.mapping(t -> t.getOrder().getTotalSellingPrice(), Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
      ));
  }
}