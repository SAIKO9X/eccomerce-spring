export const sumCartItemBasePrice = (cart) => {
  return cart.reduce(
    (total, item) => total + item.basePrice * item.quantity,
    0
  );
};

export const sumCartItemSellingPrice = (cart) => {
  return cart.reduce(
    (total, item) => total + item.sellingPrice * item.quantity,
    0
  );
};
