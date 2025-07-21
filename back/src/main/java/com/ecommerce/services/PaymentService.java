package com.ecommerce.services;

import com.ecommerce.domain.enums.PaymentMethod;
import com.ecommerce.model.entities.Order;
import com.ecommerce.model.entities.PaymentOrder;
import com.ecommerce.model.entities.User;
import com.ecommerce.response.PaymentLinkResponse;
import com.mercadopago.resources.preference.Preference;

import java.util.Set;

public interface PaymentService {

  PaymentOrder createOrder(User user, Set<Order> orders, PaymentMethod paymentMethod);

  PaymentOrder getPaymentOrderById(Long orderId) throws Exception;

  PaymentOrder getPaymentOrderByPaymentId(String paymentLinkId) throws Exception;

  Boolean ProceedPaymentOrder(PaymentOrder paymentOrder, String paymentId, String paymentLinkId);

  Preference createMercadoPagoPaymentLink(User user, Long amount, Long orderId);

  PaymentLinkResponse createStripePaymentLink(User user, Long amount, Long orderId);
}
