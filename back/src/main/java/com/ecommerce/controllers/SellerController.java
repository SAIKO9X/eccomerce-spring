package com.ecommerce.controllers;

import com.ecommerce.domain.enums.AccountStatus;
import com.ecommerce.domain.enums.OrderStatus;
import com.ecommerce.domain.enums.PaymentStatus;
import com.ecommerce.exceptions.SellerException;
import com.ecommerce.model.dto.DashboardMetrics;
import com.ecommerce.model.entities.Seller;
import com.ecommerce.model.entities.SellerReport;
import com.ecommerce.model.entities.Transaction;
import com.ecommerce.model.entities.VerificationCode;
import com.ecommerce.repositories.VerificationCodeRepository;
import com.ecommerce.request.LoginRequest;
import com.ecommerce.response.AuthResponse;
import com.ecommerce.services.AuthService;
import com.ecommerce.services.SellerReportService;
import com.ecommerce.services.SellerService;
import com.ecommerce.services.TransactionService;
import com.ecommerce.services.impl.EmailService;
import com.ecommerce.utils.OtpUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/sellers")
@Tag(name = "Vendedores", description = "Endpoints para registro, autenticação e gerenciamento de vendedores")
public class SellerController {

  private final SellerService sellerService;
  private final SellerReportService sellerReportService;
  private final EmailService emailService;
  private final AuthService authService;
  private final VerificationCodeRepository verificationCodeRepository;
  private final TransactionService transactionService;

  @PostMapping("/login")
  @Operation(summary = "Login do vendedor", description = "Autentica um vendedor usando e-mail e OTP.")
  @ApiResponse(responseCode = "200", description = "Login bem-sucedido")
  @ApiResponse(responseCode = "401", description = "Credenciais inválidas")
  public ResponseEntity<AuthResponse> loginSeller(@RequestBody LoginRequest request) {
    String otp = request.getOtp();
    String email = request.getEmail();

    request.setEmail("seller_" + email);
    request.setOtp(otp);
    AuthResponse authResponse = authService.login(request);

    return ResponseEntity.ok(authResponse);
  }

  @PatchMapping("/verify/{otp}")
  @Operation(summary = "Verifica o e-mail do vendedor", description = "Confirma o e-mail de um vendedor usando o OTP enviado.")
  @ApiResponse(responseCode = "200", description = "E-mail verificado com sucesso")
  @ApiResponse(responseCode = "400", description = "Código OTP inválido ou expirado")
  public ResponseEntity<Seller> verifySellerEmail(@PathVariable String otp) throws Exception {
    VerificationCode verificationCode = verificationCodeRepository.findByOtp(otp);

    if (verificationCode == null || !verificationCode.getOtp().equals(otp)) {
      throw new Exception("wrong otp code");
    }

    Seller seller = sellerService.verifyEmail(verificationCode.getEmail(), otp);

    return ResponseEntity.ok(seller);
  }

  @PostMapping
  @Operation(summary = "Cria uma conta de vendedor", description = "Registra um novo vendedor e envia um e-mail de verificação.")
  @ApiResponse(responseCode = "201", description = "Vendedor criado com sucesso")
  @ApiResponse(responseCode = "400", description = "E-mail já está em uso")
  public ResponseEntity<Seller> createSeller(@RequestBody Seller seller) throws Exception {
    Seller savedSeller = sellerService.createSeller(seller);

    String otp = OtpUtil.generateOtp();

    VerificationCode verificationCode = new VerificationCode();
    verificationCode.setOtp(otp);
    verificationCode.setEmail(seller.getEmail());

    verificationCode.setExpiryDate(LocalDateTime.now().plusHours(24));
    verificationCodeRepository.save(verificationCode);

    String frontend_url = "http://localhost:5173//verify_seller";
    String verificationLink = frontend_url + "?otp=" + otp;

    emailService.sendSellerVerificationEmail(savedSeller.getEmail(), savedSeller.getSellerName(), verificationLink);

    return new ResponseEntity<>(savedSeller, HttpStatus.CREATED);
  }

  @GetMapping("/{id}")
  @Operation(summary = "Busca um vendedor pelo ID", description = "Retorna os detalhes de um vendedor específico.")
  @ApiResponse(responseCode = "200", description = "Vendedor encontrado")
  @ApiResponse(responseCode = "404", description = "Vendedor não encontrado")
  public ResponseEntity<Seller> getSellerById(@PathVariable Long id) throws SellerException {
    Seller seller = sellerService.getSellerById(id);

    return ResponseEntity.ok(seller);
  }

  @GetMapping("/profile")
  @Operation(summary = "Busca o perfil do vendedor autenticado", description = "Retorna os dados do vendedor logado, a partir do token JWT.")
  @ApiResponse(responseCode = "200", description = "Perfil do vendedor retornado com sucesso")
  public ResponseEntity<Seller> getSellerByJwt(@RequestHeader("Authorization") String jwt) throws Exception {
    Seller seller = sellerService.getSellerByJwtToken(jwt);

    return ResponseEntity.ok(seller);
  }

  @GetMapping("/report")
  @Operation(summary = "Obtém o relatório de vendas do vendedor", description = "Retorna um relatório com as métricas de vendas do vendedor autenticado.")
  @ApiResponse(responseCode = "200", description = "Relatório retornado com sucesso")
  public ResponseEntity<SellerReport> getSellerReport(@RequestHeader("Authorization") String jwt) throws Exception {
    Seller seller = sellerService.getSellerByJwtToken(jwt);
    SellerReport report = sellerReportService.getSellerReport(seller);

    return ResponseEntity.ok(report);
  }

  @GetMapping
  @Operation(summary = "Lista todos os vendedores (Admin)", description = "Retorna uma lista de vendedores, opcionalmente filtrada por status da conta.")
  @ApiResponse(responseCode = "200", description = "Lista de vendedores retornada com sucesso")
  public ResponseEntity<List<Seller>> getAllSellers(@RequestParam(required = false) AccountStatus status) throws Exception {
    List<Seller> sellers = sellerService.getAllSellers(status);
    return ResponseEntity.ok(sellers);
  }

  @PatchMapping
  @Operation(summary = "Atualiza o perfil do vendedor", description = "Permite que o vendedor autenticado atualize seus dados de perfil.")
  @ApiResponse(responseCode = "200", description = "Perfil atualizado com sucesso")
  public ResponseEntity<Seller> updateSeller(@RequestHeader("Authorization") String jwt, @RequestBody Seller seller) throws Exception {
    Seller profile = sellerService.getSellerByJwtToken(jwt);
    Seller updatedSeller = sellerService.updateSeller(seller, profile.getId());

    return ResponseEntity.ok(updatedSeller);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Deleta um vendedor (Admin)", description = "Remove permanentemente um vendedor do sistema.")
  @ApiResponse(responseCode = "204", description = "Vendedor deletado com sucesso")
  @ApiResponse(responseCode = "404", description = "Vendedor não encontrado")
  public ResponseEntity<Void> deleteSeller(@PathVariable Long id) throws Exception {
    sellerService.deleteSeller(id);

    return ResponseEntity.noContent().build();
  }

  @GetMapping("/dashboard/metrics")
  @Operation(summary = "Obtém métricas do dashboard do vendedor", description = "Retorna métricas de vendas, ganhos e pedidos cancelados para um intervalo de tempo.")
  @ApiResponse(responseCode = "200", description = "Métricas retornadas com sucesso")
  public ResponseEntity<DashboardMetrics> getDashboardMetrics(
    @RequestHeader("Authorization") String jwt,
    @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
    @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
  ) throws Exception {
    Seller seller = sellerService.getSellerByJwtToken(jwt);
    List<Transaction> transactions = transactionService.getTransactionsBySellerIdAndDateRange(seller, start, end);

    long totalSales = transactions.stream()
      .filter(t -> t.getOrder().getPaymentStatus() == PaymentStatus.COMPLETED)
      .count();

    BigDecimal totalEarnings = transactions.stream()
      .filter(t -> t.getOrder().getPaymentStatus() == PaymentStatus.COMPLETED)
      .map(t -> t.getOrder().getTotalSellingPrice())
      .reduce(BigDecimal.ZERO, BigDecimal::add);

    long canceledOrders = transactions.stream()
      .filter(t -> t.getOrder().getOrderStatus() == OrderStatus.CANCELLED)
      .count();

    BigDecimal totalRefunds = transactions.stream()
      .filter(t -> t.getOrder().getOrderStatus() == OrderStatus.CANCELLED)
      .map(t -> t.getOrder().getTotalSellingPrice())
      .reduce(BigDecimal.ZERO, BigDecimal::add);

    DashboardMetrics metrics = new DashboardMetrics(totalSales, totalEarnings, canceledOrders, totalRefunds);
    return ResponseEntity.ok(metrics);
  }

  @GetMapping("/dashboard/earnings-chart")
  @Operation(summary = "Dados para gráfico de ganhos diários", description = "Retorna um mapa de ganhos por dia para um intervalo de tempo.")
  @ApiResponse(responseCode = "200", description = "Dados do gráfico retornados com sucesso")
  public ResponseEntity<Map<LocalDate, BigDecimal>> getEarningsChartData(
    @RequestHeader("Authorization") String jwt,
    @RequestParam(required = false) LocalDateTime start,
    @RequestParam(required = false) LocalDateTime end
  ) throws Exception {
    Seller seller = sellerService.getSellerByJwtToken(jwt);
    Map<LocalDate, BigDecimal> dailyEarnings = transactionService.getDailyEarnings(seller, start, end);
    return ResponseEntity.ok(dailyEarnings);
  }

  @GetMapping("/dashboard/earnings-chart/annual")
  @Operation(summary = "Dados para gráfico de ganhos anuais", description = "Retorna um mapa de ganhos por mês para um ano específico.")
  @ApiResponse(responseCode = "200", description = "Dados do gráfico retornados com sucesso")
  public ResponseEntity<Map<String, BigDecimal>> getAnnualEarningsChart(@RequestHeader("Authorization") String jwt, @RequestParam int year) throws Exception {
    Seller seller = sellerService.getSellerByJwtToken(jwt);
    Map<String, BigDecimal> monthlyEarnings = transactionService.getMonthlyEarnings(seller, year);
    return ResponseEntity.ok(monthlyEarnings);
  }

  @GetMapping("/dashboard/earnings-chart/monthly")
  @Operation(summary = "Dados para gráfico de ganhos mensais", description = "Retorna um mapa de ganhos por semana para um mês e ano específicos.")
  @ApiResponse(responseCode = "200", description = "Dados do gráfico retornados com sucesso")
  public ResponseEntity<Map<String, BigDecimal>> getMonthlyEarningsChart(
    @RequestHeader("Authorization") String jwt, @RequestParam int year, @RequestParam int month) throws Exception {
    Seller seller = sellerService.getSellerByJwtToken(jwt);
    Map<String, BigDecimal> weeklyEarnings = transactionService.getWeeklyEarnings(seller, year, month);
    return ResponseEntity.ok(weeklyEarnings);
  }

  @GetMapping("/dashboard/earnings-chart/daily")
  @Operation(summary = "Dados para gráfico de ganhos diários por hora", description = "Retorna um mapa de ganhos por hora para um dia específico.")
  @ApiResponse(responseCode = "200", description = "Dados do gráfico retornados com sucesso")
  public ResponseEntity<Map<String, BigDecimal>> getDailyEarningsChart(
    @RequestHeader("Authorization") String jwt, @RequestParam LocalDate date) throws Exception {
    Seller seller = sellerService.getSellerByJwtToken(jwt);
    Map<String, BigDecimal> hourlyEarnings = transactionService.getHourlyEarnings(seller, date);
    return ResponseEntity.ok(hourlyEarnings);
  }
}