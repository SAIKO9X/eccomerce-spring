package com.ecommerce.request;

public record AddItemRequest(
  String size,
  int quantity,
  Long productId
) {
}
