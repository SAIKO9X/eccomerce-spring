import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { thunk } from "redux-thunk";
import sellerSlice from "./seller/sellerSlice";
import sellerProductSlice from "./seller/sellerProductSlice";
import cartSlice from "./customer/cartSlice";
import orderSlice from "./customer/orderSlice";
import wishlistSlice from "./customer/wishlistSlice";
import authSlice from "./authSlice";
import productSlice from "./customer/productSlice";
import sellerOrderSlice from "./seller/sellerOrderSlice";
import transactionSlice from "./seller/transactionSlice";
import sellerAuthSlice from "./seller/sellerAuthSlice";
import homeSlice from "./customer/customerSlice";
import adminSlice from "./admin/adminSlice";
import dealSlice from "./admin/dealSlice";
import adminCategorySlice from "./admin/adminCategorySlice";
import reviewSlice from "./customer/reviewSlice";
import adminCouponSlice from "./admin/adminCouponSlice";
import couponSlice from "./customer/couponSlice";

const rootReducer = combineReducers({
  // Customer
  cart: cartSlice,
  home: homeSlice,
  order: orderSlice,
  wishlist: wishlistSlice,
  products: productSlice,
  reviews: reviewSlice,
  coupon: couponSlice,

  // Seller
  seller: sellerSlice,
  sellerProduct: sellerProductSlice,
  sellerOrder: sellerOrderSlice,
  transactions: transactionSlice,
  sellerAuthSlice: sellerAuthSlice,

  // Admin
  adminSlice: adminSlice,
  deal: dealSlice,
  auth: authSlice,
  categories: adminCategorySlice,
  adminCoupon: adminCouponSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
