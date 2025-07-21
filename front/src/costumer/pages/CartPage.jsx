import { Button, Divider, TextField } from "@mui/material";
import { CartItem } from "../components/cart/CartItem";
import { PricingCard } from "../components/cart/PricingCard";
import { useEffect, useState } from "react";
import { findUserCart, clearCart } from "../../state/customer/cartSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../state/store";
import {
  applyCoupon,
  clearCoupon,
  removeCoupon,
} from "../../state/customer/couponSlice";

export const CartPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cart } = useAppSelector((store) => store.cart);
  const { loading, error, appliedCoupon } = useAppSelector(
    (store) => store.coupon
  );
  const [couponCode, setCouponCode] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const calculateCouponDiscount = () => {
    if (!cart?.couponCode || !cart.totalSellingPrice) return 0;
    const coupon = { discountPercentage: 10 }; // Substitua por lógica real, se necessário
    return (cart.totalSellingPrice * coupon.discountPercentage) / 100;
  };

  const calculateFinalValue = () => {
    return (
      subtotal -
      totalDiscount +
      (cart?.couponCode ? calculateCouponDiscount() : 0)
    );
  };

  const selectedCartItems =
    cart?.cartItems?.filter((item) => selectedItems.includes(item.id)) || [];
  const subtotal = selectedCartItems.reduce(
    (total, item) => total + parseFloat(item.basePrice || 0),
    0
  );
  const totalDiscount = selectedCartItems.reduce(
    (total, item) =>
      total +
      (parseFloat(item.basePrice || 0) - parseFloat(item.sellingPrice || 0)),
    0
  );
  const finalValue =
    subtotal -
    totalDiscount -
    (cart?.couponCode ? calculateCouponDiscount() : 0);

  const handleChange = (e) => setCouponCode(e.target.value);

  const handleApplyCoupon = () => {
    if (!couponCode) {
      alert("Digite um código de cupom válido.");
      return;
    }
    const orderValue = calculateFinalValue();
    dispatch(
      applyCoupon({
        apply: "true",
        code: couponCode,
        orderValue: orderValue,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(findUserCart(localStorage.getItem("jwt")));
      })
      .catch((error) => {
        const errorMessage =
          error?.message || error?.toString() || "Tente novamente.";
        alert("Erro ao aplicar cupom: " + errorMessage);
      });
  };

  const handleRemoveCoupon = () => {
    if (!appliedCoupon) {
      alert("Nenhum cupom aplicado.");
      return;
    }
    dispatch(
      removeCoupon({
        apply: "false",
        code: appliedCoupon,
        orderValue: calculateFinalValue(),
      })
    )
      .unwrap()
      .then(() => {
        dispatch(findUserCart(localStorage.getItem("jwt")));
        dispatch(clearCoupon());
      })
      .catch((error) => {
        const errorMessage =
          error?.message || error?.toString() || "Tente novamente.";
        alert("Erro ao remover cupom: " + errorMessage);
      });
  };

  const handleClearCart = () => {
    const jwt = localStorage.getItem("jwt") || "";
    dispatch(clearCart(jwt))
      .unwrap()
      .then(() => {
        dispatch(findUserCart(jwt));
        setSelectedItems([]);
        dispatch(clearCoupon());
      })
      .catch((error) => console.error("Erro ao limpar carrinho:", error));
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Selecione pelo menos um item para prosseguir.");
      return;
    }
    navigate("/checkout", { state: { selectedItems } });
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt") || "";
    dispatch(findUserCart(jwt)).then(() => {
      if (cart?.cartItems) {
        setSelectedItems(cart.cartItems.map((item) => item.id));
      }
    });
  }, [dispatch]);

  if (error && typeof error === "object" && error.message) {
    return (
      <div>
        <p style={{ color: "red" }}>Erro: {error.message}</p>
        <Button variant="outlined" onClick={() => window.location.reload()}>
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <section className="pt-10 px-5 lg:px-10 2xl:px-60 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 xl:gap-15">
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between">
            <h1 className="font-playfair font-medium text-2xl">Carrinho</h1>
            <Button variant="outlined" size="small" onClick={handleClearCart}>
              Limpar Carrinho
            </Button>
          </div>
          <div className="flex flex-col gap-5">
            {cart?.cartItems?.map((item) => (
              <>
                <CartItem
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.includes(item.id)}
                  onSelect={() => handleSelectItem(item.id)}
                />
                <Divider />
              </>
            ))}
          </div>
        </div>
        <div className="col-span-1 text-sm space-y-3">
          <PricingCard
            subtotal={subtotal}
            totalDiscount={totalDiscount}
            finalValue={finalValue}
            buttonText="Finalizar Compra"
            onConfirmPayment={handleProceedToCheckout}
          />
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold font-playfair text-lg capitalize">
              Adicionar Cupom
            </h2>
            <div className="flex items-center gap-2">
              <TextField
                onChange={handleChange}
                id="outlined-basic"
                label="Digite o código promocional"
                variant="outlined"
                size="small"
                fullWidth
                value={couponCode}
              />
              <Button variant="outlined" onClick={handleApplyCoupon}>
                Aplicar
              </Button>
            </div>
            {appliedCoupon && (
              <div className="flex flex-col gap-2 pt-4">
                <p>Cupom aplicado: {appliedCoupon}</p>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleRemoveCoupon}
                >
                  Remover Cupom
                </Button>
              </div>
            )}
            {error && typeof error === "string" && (
              <p style={{ color: "red" }}>{error}</p>
            )}
            {loading && <p>Carregando...</p>}
          </div>
        </div>
      </div>
    </section>
  );
};
