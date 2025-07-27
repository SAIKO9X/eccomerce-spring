import { ThemeProvider } from "@mui/material";
import { customerTheme } from "./theme/customerTheme";
import { Navbar } from "./costumer/components/header/NavBar";
import { DetailsPage } from "./costumer/pages/DetailsPage";
import { CartPage } from "./costumer/pages/CartPage";
import { CheckoutPage } from "./costumer/pages/CheckoutPage";
import { ProductPage } from "./costumer/pages/ProductPage";
import { ProfilePage } from "./costumer/pages/ProfilePage";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { HomePage } from "./costumer/pages/HomePage";
import { SellerDashboard } from "./seller/pages/SellerDashboard";
import { AdminDashboard } from "./admin/pages/AdminDashboard";
import { useEffect, useRef } from "react";
import { fetchSellerProfile } from "./state/seller/sellerSlice";
import { AuthPage } from "./costumer/pages/AuthPage";
import { getUserProfile, initializeAuth } from "./state/authSlice";
import { PaymentSuccess } from "./costumer/pages/PaymentSuccess";
import { WishlistPage } from "./costumer/pages/WishlistPage";
import { homeCategories } from "./data/homeCategories";
import { createHomeCategories } from "./state/customer/customerSlice";
import { CategoriesList } from "./costumer/components/categories/CategoryList";
import { CreateReviewPage } from "./costumer/components/footer/CreateReviewPage";
import { SearchResultsPage } from "./costumer/components/products/SearchResultsPage";
import { BecomeSellerPage } from "./seller/pages/BecomeSellerPage";
import { VerifySellerEmailPage } from "./seller/components/becomeSeller/VerifySellerEmailPage";

import { useAppDispatch, useAppSelector } from "./state/store";

export const App = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { seller, auth, home } = useAppSelector((store) => store);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    dispatch(initializeAuth());
    const jwt = localStorage.getItem("jwt");

    if (jwt) {
      const role = localStorage.getItem("role");
      if (role === "ROLE_SELLER") {
        dispatch(fetchSellerProfile(jwt));
      } else if (role === "ROLE_CUSTOMER" || role === "ROLE_ADMIN") {
        dispatch(getUserProfile({ jwt }));
      }
    }

    if (
      !home.homePageData &&
      !home.loading &&
      !hasInitializedRef.current &&
      isMounted
    ) {
      hasInitializedRef.current = true;
      dispatch(createHomeCategories({ homeCategories }))
        .unwrap()
        .then(() => {
          if (isMounted)
            console.log("Home categories initialized successfully");
        })
        .catch((error) => {
          if (isMounted)
            console.error("Failed to initialize home categories:", error);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch, home.homePageData, home.loading]);

  useEffect(() => {
    const { isLoggedIn, role } = auth;
    const { pathname } = location;

    if (isLoggedIn) {
      if (pathname === "/login" || pathname === "/become-seller") {
        if (role === "ROLE_ADMIN") {
          navigate("/admin");
        } else if (role === "ROLE_SELLER") {
          navigate("/seller");
        } else {
          navigate("/");
        }
        return;
      }

      if (pathname.startsWith("/admin") && role !== "ROLE_ADMIN") {
        navigate("/");
      } else if (pathname.startsWith("/seller") && role !== "ROLE_SELLER") {
        navigate("/");
      } else if (pathname.startsWith("/account") && role !== "ROLE_CUSTOMER") {
        navigate("/");
      }
    } else {
      if (
        pathname.startsWith("/account") ||
        pathname.startsWith("/seller") ||
        pathname.startsWith("/admin")
      ) {
        navigate("/login");
      }
    }
  }, [auth.isLoggedIn, auth.role, seller.profile, navigate, location.pathname]);

  const pathsToHideNavbar = [
    "/login",
    "/become-seller",
    "/verify-seller-email",
  ];

  const isAdminOrSellerPath =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/seller");

  const isHomePage = location.pathname === "/";

  const showNavbar =
    !pathsToHideNavbar.includes(location.pathname) &&
    !isAdminOrSellerPath &&
    !isHomePage;

  return (
    <ThemeProvider theme={customerTheme}>
      {showNavbar && <Navbar />}
      <div className="overflow-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/payment-success/:orderId"
            element={<PaymentSuccess />}
          />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/categories-list" element={<CategoriesList />} />
          <Route path="/products/:category" element={<ProductPage />} />
          <Route
            path="/reviews/:productId/create"
            element={<CreateReviewPage />}
          />
          <Route
            path="/product-details/:categoryId/:name/:productId"
            element={<DetailsPage />}
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/become-seller/*" element={<BecomeSellerPage />} />
          <Route path="/account/*" element={<ProfilePage />} />
          <Route path="/seller/*" element={<SellerDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/search-results" element={<SearchResultsPage />} />
          <Route
            path="/verify-seller-email"
            element={<VerifySellerEmailPage />}
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
};
