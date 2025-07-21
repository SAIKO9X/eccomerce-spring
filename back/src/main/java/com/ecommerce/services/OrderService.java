package com.ecommerce.services;

import com.ecommerce.domain.enums.OrderStatus;
import com.ecommerce.model.entities.*;

import java.util.List;
import java.util.Set;

public interface OrderService {

  Set<Order> createOrder(User user, Address shippingAddress, List<Long> cartItemIds) throws Exception;

  Order findOrderById(Long id) throws Exception;

  List<Order> usersOrderHistory(Long userId);

  List<Order> sellersOrder(Long sellerId);

  Order updateOrderStatus(Long orderId, OrderStatus orderStatus) throws Exception;

  Order cancelOrder(Long orderId, User user) throws Exception;

  OrderItem findOrderItemById(Long id) throws Exception;

  void saveAll(Set<Order> orders);
}
