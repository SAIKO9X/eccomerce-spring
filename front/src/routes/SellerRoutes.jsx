import { Route, Routes } from "react-router-dom";
import { Dashboard } from "../seller/pages/Dashboard";
import { ProductsPage } from "../seller/pages/ProductsPage";
import { OrdersPage } from "../seller/pages/OrdersPage";
import { ProfilePage } from "../seller/pages/ProfilePage";
import { PaymentPage } from "../seller/pages/PaymentPage";
import { AddProductsPage } from "../seller/pages/AddProductsPage";

export const SellerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/add-product" element={<AddProductsPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/payments" element={<PaymentPage />} />
      <Route path="/account" element={<ProfilePage />} />
    </Routes>
  );
};
