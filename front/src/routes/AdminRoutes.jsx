import { Route, Routes } from "react-router-dom";
import { CouponPage } from "../admin/pages/CouponPage";
import { DealPage } from "../admin/pages/DealPage";
import { CreateCouponForm } from "../admin/component/coupon/CreateCouponForm";
import { SellersTable } from "../admin/pages/SellersTable";
import { CarouselDashboard } from "../admin/pages/CarouselDashboard";
import { ShopByCategoryPage } from "../admin/pages/ShopByCategoryPage";
import { CreateCategoriesPage } from "../admin/pages/CreateCategoriesPage";
import { AdminProfilePage } from "../admin/pages/AdminProfilePage";

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SellersTable />} />
      <Route path="/coupon" element={<CouponPage />} />
      <Route path="/add-coupon" element={<CreateCouponForm />} />
      <Route path="/home-carousel" element={<CarouselDashboard />} />
      <Route path="/shop-by-category" element={<ShopByCategoryPage />} />
      <Route path="/deals" element={<DealPage />} />
      <Route path="/categories" element={<CreateCategoriesPage />} />
      <Route path="/account" element={<AdminProfilePage />} />
    </Routes>
  );
};
