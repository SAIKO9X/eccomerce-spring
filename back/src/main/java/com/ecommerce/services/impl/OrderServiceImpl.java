package com.ecommerce.services.impl;

import com.ecommerce.domain.enums.OrderStatus;
import com.ecommerce.domain.enums.PaymentStatus;
import com.ecommerce.model.dto.PaymentDetails;
import com.ecommerce.model.entities.*;
import com.ecommerce.repositories.*;
import com.ecommerce.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

  private final OrderRepository orderRepository;
  private final AddressRepository addressRepository;
  private final OrderItemRepository orderItemRepository;
  private final CouponRepository couponRepository;
  private final UserRepository userRepository;
  private final CartRepository cartRepository;

  @Override
  public Set<Order> createOrder(User user, Address shippingAddress, List<Long> cartItemIds) throws Exception {
    Address address = addressRepository.save(shippingAddress);
    Cart cart = cartRepository.findByUserId(user.getId());

    List<CartItem> selectedItems = cart.getCartItems().stream()
      .filter(item -> cartItemIds.contains(item.getId()))
      .toList();

    Map<Long, List<CartItem>> itemsBySeller = selectedItems.stream()
      .collect(Collectors.groupingBy(item -> item.getProduct().getSeller().getId()));

    Set<Order> orders = new HashSet<>();

    for (Map.Entry<Long, List<CartItem>> entry : itemsBySeller.entrySet()) {
      Long sellerId = entry.getKey();
      List<CartItem> items = entry.getValue();

      BigDecimal totalOrderPrice = items.stream()
        .map(CartItem::getSellingPrice)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

      int totalItem = items.stream().mapToInt(CartItem::getQuantity).sum();

      Order createdOrder = new Order();
      createdOrder.setUser(user);
      createdOrder.setSellerId(sellerId);
      createdOrder.setTotalBasePrice(totalOrderPrice);
      createdOrder.setTotalSellingPrice(totalOrderPrice);
      createdOrder.setTotalItem(totalItem);
      createdOrder.setOrderAddress(address);
      createdOrder.setOrderStatus(OrderStatus.PENDING);

      PaymentDetails paymentDetails = new PaymentDetails();
      paymentDetails.setStatus(PaymentStatus.PENDING);
      createdOrder.setPaymentDetails(paymentDetails);

      Order savedOrder = orderRepository.save(createdOrder);
      orders.add(savedOrder);

      List<OrderItem> orderItems = new ArrayList<>();
      for (CartItem item : items) {
        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(savedOrder);
        orderItem.setBasePrice(item.getBasePrice());
        orderItem.setProduct(item.getProduct());
        orderItem.setQuantity(item.getQuantity());
        orderItem.setSize(item.getSize());
        orderItem.setUserId(item.getUserId());
        orderItem.setSellingPrice(item.getSellingPrice());
        orderItems.add(orderItem);
      }
      orderItemRepository.saveAll(orderItems);
      savedOrder.getOrderItems().addAll(orderItems);
    }

    cart.getCartItems().removeIf(item -> cartItemIds.contains(item.getId()));
    cartRepository.save(cart);

    return orders;
  }

  @Override
  public Order findOrderById(Long id) throws Exception {
    return orderRepository.findById(id).orElseThrow(() -> new Exception("order not found..."));
  }

  @Override
  public List<Order> usersOrderHistory(Long userId) {
    return orderRepository.findByUserIdAndPaymentStatus(userId, PaymentStatus.COMPLETED);
  }

  @Override
  public List<Order> sellersOrder(Long sellerId) {
    return orderRepository.findBySellerId(sellerId);
  }

  @Override
  public Order updateOrderStatus(Long orderId, OrderStatus orderStatus) throws Exception {
    Order order = findOrderById(orderId);
    order.setOrderStatus(orderStatus);
    return orderRepository.save(order);
  }

  @Override
  public Order cancelOrder(Long orderId, User user) throws Exception {
    Order order = findOrderById(orderId);

    if (!user.getId().equals(order.getUser().getId())) {
      throw new Exception("you don't have access to this order");
    }

    order.setOrderStatus(OrderStatus.CANCELLED);
    return orderRepository.save(order);
  }

  @Override
  public OrderItem findOrderItemById(Long id) throws Exception {
    return orderItemRepository.findById(id).orElseThrow(() -> new Exception("order item not exists"));
  }

  @Override
  public void saveAll(Set<Order> orders) {
    orderRepository.saveAll(orders);
  }
}