import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../state/store";
import { searchProducts } from "../../../state/customer/productSlice";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  FavoriteBorder,
  ShoppingBagOutlined,
  Search,
} from "@mui/icons-material";
import { CategorySheet } from "./CategorySheet";
import { useAppSelector } from "../../../state/store";
import { fetchCategories } from "../../../state/admin/adminCategorySlice";
import { findUserCart } from "../../../state/customer/cartSlice";

export const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const searchInputRef = useRef(null);
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const { auth, cart } = useAppSelector((state) => state);
  const { categories, loading: categoriesLoading } = useAppSelector(
    (state) => state.categories
  );

  const mainCategories = categories.filter((cat) => cat.level === 1);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (auth.user) {
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        dispatch(findUserCart(jwt));
      }
    }
  }, [auth.user, dispatch]);

  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }

    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target) &&
        !event.target.closest(".search-icon")
      ) {
        setIsSearchVisible(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchVisible]);

  if (categoriesLoading) return null;

  const userInitial = auth.user?.fullName?.charAt(0)?.toUpperCase() || "";
  const cartItemCount =
    cart?.cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      dispatch(searchProducts(searchQuery))
        .unwrap()
        .then(() => {
          navigate("/search-results");
          setIsSearchVisible(false);
          setSearchQuery("");
        })
        .catch((error) => console.error("Erro na pesquisa:", error));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleSearchVisibility = () => {
    setIsSearchVisible((prev) => !prev);
  };

  return (
    <nav className="sticky z-10 top-0 left-0 right-0 bg-white">
      <Box>
        <div className="flex items-center justify-between px-5 h-[70px] border-b border-b-black/10">
          {isLarge && (
            <ul className="flex items-center font-medium text-gray-800">
              {mainCategories.map((item) => (
                <li
                  key={item.id}
                  className="hover:border-b-2 h-[70px] px-4 border-primary cursor-pointer flex items-center transition-all duration-100 ease-in-out"
                  onMouseLeave={() => setShowCategorySheet(false)}
                  onMouseEnter={() => {
                    setShowCategorySheet(true);
                    setSelectedCategory(item.categoryId);
                  }}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}

          <div
            className={`${
              isLarge ? "absolute left-1/2 transform -translate-x-1/2" : "block"
            } flex items-center gap-2`}
          >
            {!isLarge && (
              <IconButton>
                <MenuIcon />
              </IconButton>
            )}
            <h1
              onClick={() => navigate("/")}
              className="cursor-pointer text-lg md:text-2xl font-semibold font-playfair text-primary uppercase"
            >
              {isLarge ? "ecommerce" : "eco"}
            </h1>
          </div>

          <div className="flex gap-1 lg:gap-4 items-center">
            <div className="relative flex items-center">
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isSearchVisible ? "w-48 opacity-100 mr-2" : "w-0 opacity-0"
                }`}
              >
                <TextField
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Pesquisar produtos..."
                  size="small"
                  className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <IconButton
                onClick={toggleSearchVisibility}
                className="search-icon"
              >
                <Search color="primary" />
              </IconButton>
            </div>

            {auth.user ? (
              <>
                <IconButton onClick={() => navigate("/wishlist")}>
                  <FavoriteBorder color="primary" />
                </IconButton>

                <div
                  onClick={() => navigate("/cart")}
                  className="flex items-center justify-center gap-2 bg-black/90 p-2 rounded-full cursor-pointer"
                >
                  <ShoppingBagOutlined color="secondary" />
                  <span className="bg-white/30 text-white rounded-full px-2">
                    {cartItemCount}
                  </span>
                </div>

                <Button
                  className="flex items-center gap-2"
                  onClick={() => navigate("/account/orders")}
                >
                  <Avatar
                    className="cursor-pointer"
                    sx={{ width: 29, height: 29 }}
                  >
                    {userInitial}
                  </Avatar>
                  <p>{auth.user?.fullName}</p>
                </Button>
              </>
            ) : (
              // Se não estiver logado, mostra apenas o botão de login
              <Button
                onClick={() => navigate("/login")}
                size="small"
                variant="outlined"
              >
                fazer login
              </Button>
            )}
          </div>
        </div>

        {showCategorySheet && (
          <div
            onMouseLeave={() => setShowCategorySheet(false)}
            onMouseEnter={() => setShowCategorySheet(true)}
            className="absolute z-50 top-[4.41rem] left-5 right-5"
          >
            <CategorySheet selectedCategory={selectedCategory} />
          </div>
        )}
      </Box>
    </nav>
  );
};
