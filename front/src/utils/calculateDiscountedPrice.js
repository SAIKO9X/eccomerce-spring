export const calculateDiscountedPrice = (sellingPrice, discountPercent) => {
  if (!discountPercent) return sellingPrice;
  return sellingPrice - sellingPrice * (discountPercent / 100);
};
