package com.ecommerce.services.impl;

import com.ecommerce.domain.enums.PaymentMethod;
import com.ecommerce.domain.enums.PaymentOrderStatus;
import com.ecommerce.domain.enums.PaymentStatus;
import com.ecommerce.model.entities.Order;
import com.ecommerce.model.entities.PaymentOrder;
import com.ecommerce.model.entities.User;
import com.ecommerce.repositories.OrderRepository;
import com.ecommerce.repositories.PaymentOrderRepository;
import com.ecommerce.response.PaymentLinkResponse;
import com.ecommerce.services.PaymentService;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.*;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

  private final PaymentOrderRepository paymentOrderRepository;
  private final OrderRepository orderRepository;

  @Value("${stripe.secret.key}")
  String stripeSecretKey;

  @Value("${mercadopago.access.token}")
  private String mercadoPagoAccessToken;

  @Value("${mercadopago.public.key}")
  private String mercadoPagoPublicKey;

  @Value("${web.base.url}")
  private String webBaseUrl;

  @Override
  public PaymentOrder createOrder(User user, Set<Order> orders, PaymentMethod paymentMethod) {
    long amount = orders.stream()
      .map(order -> order.getTotalSellingPrice().multiply(BigDecimal.valueOf(100)).longValue())
      .reduce(0L, Long::sum);

    PaymentOrder paymentOrder = new PaymentOrder();
    paymentOrder.setAmount(amount);
    paymentOrder.setUser(user);
    paymentOrder.setOrders(orders);
    paymentOrder.setPaymentMethod(paymentMethod);

    return paymentOrderRepository.save(paymentOrder);
  }

  @Override
  public PaymentOrder getPaymentOrderById(Long orderId) throws Exception {
    return paymentOrderRepository.findById(orderId).orElseThrow(
      () -> new Exception("payment order not found")
    );
  }

  @Override
  public PaymentOrder getPaymentOrderByPaymentId(String paymentLinkId) throws Exception {
    PaymentOrder paymentOrder = paymentOrderRepository.findByPaymentLinkId(paymentLinkId);

    if (paymentOrder == null) {
      throw new Exception("payment order not found with payment link id");
    }

    return paymentOrder;
  }

  @Override
  public Boolean ProceedPaymentOrder(PaymentOrder paymentOrder, String paymentId, String paymentLinkId) {
    if (PaymentOrderStatus.PENDING.equals(paymentOrder.getStatus())) {
      try {
        if (paymentOrder.getPaymentMethod().equals(PaymentMethod.MERCADO_PAGO)) {
          MercadoPagoConfig.setAccessToken(mercadoPagoAccessToken);
          PaymentClient paymentClient = new PaymentClient();
          Payment payment = paymentClient.get(Long.parseLong(paymentId));
          String status = payment.getStatus();

          if ("approved".equals(status)) {
            updateOrdersAsPaid(paymentOrder);
            paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
            paymentOrderRepository.save(paymentOrder);
            return true;
          } else if ("rejected".equals(status)) {
            paymentOrder.setStatus(PaymentOrderStatus.FAILED);
            paymentOrderRepository.save(paymentOrder);
            return false;
          }

        } else if (paymentOrder.getPaymentMethod().equals(PaymentMethod.STRIPE)) {
          System.out.println("Processando pagamento via STRIPE...");
          Stripe.apiKey = stripeSecretKey;
          Session session = Session.retrieve(paymentLinkId);
          System.out.println("Status da sessão Stripe: " + session.getStatus());

          if ("complete".equals(session.getStatus())) {
            updateOrdersAsPaid(paymentOrder);
            paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
            paymentOrderRepository.save(paymentOrder);
            return true;
          } else {
            paymentOrder.setStatus(PaymentOrderStatus.FAILED);
            paymentOrderRepository.save(paymentOrder);
            return false;
          }
        }
      } catch (MPApiException | MPException | StripeException e) {
        throw new RuntimeException("Erro ao processar o pagamento: " + e.getMessage());
      }
    }
    return false;
  }

  private void updateOrdersAsPaid(PaymentOrder paymentOrder) {
    Set<Order> orders = paymentOrder.getOrders();
    for (Order order : orders) {
      order.setPaymentStatus(PaymentStatus.COMPLETED);
      orderRepository.save(order);
    }
  }

  @Override
  public Preference createMercadoPagoPaymentLink(User user, Long amount, Long orderId) {
    try {
      MercadoPagoConfig.setAccessToken(mercadoPagoAccessToken);
      PreferenceClient client = new PreferenceClient();

      List<PreferenceItemRequest> items = List.of(
        PreferenceItemRequest.builder()
          .id(orderId.toString())
          .title("Pagamento do Pedido #" + orderId)
          .quantity(1)
          .currencyId("BRL")
          .unitPrice(new BigDecimal(amount).divide(BigDecimal.valueOf(100)))
          .build()
      );

      // Validate webBaseUrl
      if (webBaseUrl == null || webBaseUrl.isEmpty()) {
        throw new IllegalArgumentException("webBaseUrl is not configured properly");
      }
      String successUrl = webBaseUrl + "/payment-success/" + orderId;
      System.out.println("Success URL: " + successUrl); // Log for debugging

      PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
        .success(successUrl)
        .failure(webBaseUrl + "/payment-failure")
        .pending(webBaseUrl + "/payment-pending")
        .build();

      PreferencePayerRequest payer = PreferencePayerRequest.builder()
        .name(user.getFullName())
        .email(user.getEmail())
        .build();

      PreferenceRequest preferenceRequest = PreferenceRequest.builder()
        .items(items)
        .payer(payer)
        .backUrls(backUrls)
        .autoReturn("approved")
        .build();

      return client.create(preferenceRequest);

    } catch (MPApiException e) {
      System.err.println("Erro da API do Mercado Pago: " + e.getApiResponse().getContent());
      System.err.println("Status Code: " + e.getApiResponse().getStatusCode());
      System.err.println("Headers: " + e.getApiResponse().getHeaders());
      throw new RuntimeException("Erro ao criar link de pagamento Mercado Pago: " + e.getApiResponse().getContent(), e);
    } catch (MPException e) {
      System.err.println("Erro geral do Mercado Pago: " + e.getMessage());
      throw new RuntimeException("Erro ao criar link de pagamento Mercado Pago: " + e.getMessage(), e);
    }
  }

  @Override
  public PaymentLinkResponse createStripePaymentLink(User user, Long amount, Long orderId) {
    Stripe.apiKey = stripeSecretKey;

    try {
      String successUrl = webBaseUrl + "/payment-success/" + orderId + "?paymentLinkId={CHECKOUT_SESSION_ID}";

      SessionCreateParams params = SessionCreateParams.builder()
        .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
        .setMode(SessionCreateParams.Mode.PAYMENT)
        .setSuccessUrl(successUrl)
        .setCancelUrl(webBaseUrl + "/payment-cancel/")
        .addLineItem(SessionCreateParams.LineItem.builder()
          .setQuantity(1L)
          .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
            .setCurrency("BRL")
            .setUnitAmount(amount)
            .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
              .setName("spring ecommerce payment")
              .build())
            .build())
          .build())
        .build();

      Session session = Session.create(params);

      PaymentLinkResponse response = new PaymentLinkResponse();
      response.setPayment_link_url(session.getUrl());
      response.setPayment_link_id(session.getId());

      return response;
    } catch (StripeException e) {
      throw new RuntimeException("Erro ao criar link de pagamento Stripe: " + e.getMessage());
    }
  }
}