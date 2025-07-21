import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
} from "@mui/material";
import { AddressCard } from "../components/checkout/AddressCard";
import { AddressForm } from "../components/checkout/AddressForm";
import { PricingCard } from "../components/cart/PricingCard";
import Stripe from "../../assets/stripe.png";
import Mercado from "../../assets/mercado.png";
import { createOrder } from "../../state/customer/orderSlice";
import { useAlert } from "../../utils/useAlert";
import { useAppDispatch, useAppSelector } from "../../state/store";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "1px solid #00000040",
  boxShadow: 24,
  p: 4,
};

const paymentMethodList = [
  { value: "STRIPE", image: Stripe, label: "Stripe" },
  { value: "MERCADO_PAGO", image: Mercado, label: "Mercado Pago" },
];

export const CheckoutPage = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { user } = useAppSelector((store) => store.auth);
  const { cart } = useAppSelector((store) => store.cart);
  const { showAlert, AlertComponent } = useAlert();
  const [open, setOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("STRIPE");
  const selectedItems = location.state?.selectedItems || [];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handlePaymentChange = (event) => setPaymentMethod(event.target.value);
  const handleSelectAddress = (addressId) => setSelectedAddress(addressId);

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
  const finalValue = subtotal - totalDiscount;

  const handleConfirmPayment = () => {
    if (!selectedAddress) {
      showAlert("Selecione um endereço para continuar.", "warning");
      return;
    }
    const address = user.addresses.find((addr) => addr.id === selectedAddress);
    const jwt = localStorage.getItem("jwt");

    dispatch(
      createOrder({ address, jwt, paymentMethod, cartItemIds: selectedItems })
    );
  };

  return (
    <section className="pt-10 px-5 lg:px-10 xl:px-20 2xl:px-60">
      <AlertComponent />
      <div className="space-y-5 lg:space-y-0 lg:grid grid-cols-3 lg:gap-9">
        <div className="col-span-2 space-y-5">
          <div className="flex justify-between items-center">
            <h1 className="font-medium font-playfair text-2xl">
              Selecione o Endereço
            </h1>
            <Button variant="outlined" size="small" onClick={handleOpen}>
              Adicione novo endereço
            </Button>
          </div>

          <div className="space-y-5">
            <p className="font-medium">Endereços Salvos</p>
            <div className="space-y-4">
              {user?.addresses?.length > 0 ? (
                user.addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    isSelected={selectedAddress === address.id}
                    onSelect={() => handleSelectAddress(address.id)}
                  />
                ))
              ) : (
                <p>Nenhum endereço salvo. Adicione um novo.</p>
              )}
            </div>
          </div>
          <Button fullWidth onClick={handleOpen} variant="outlined">
            Adicione novo endereço
          </Button>
        </div>

        <div className="flex flex-col gap-5">
          <div className="border border-black/10 rounded-lg p-4">
            <h2 className="pb-4 text-center font-playfair font-medium text-lg">
              Escolha Método de Pagamento
            </h2>
            <RadioGroup
              row
              value={paymentMethod}
              onChange={handlePaymentChange}
              className="flex justify-between items-center"
            >
              {paymentMethodList.map((item) => (
                <FormControlLabel
                  key={item.value}
                  value={item.value}
                  control={<Radio sx={{ display: "none" }} />}
                  sx={{ margin: 0 }}
                  className={`border border-black/10 w-[45%] h-12 rounded-md p-2 flex justify-center cursor-pointer transition-colors ${
                    paymentMethod === item.value ? "bg-black/10" : ""
                  }`}
                  label={
                    <img
                      className="w-14 object-cover object-center"
                      src={item.image}
                      alt={item.label}
                    />
                  }
                />
              ))}
            </RadioGroup>
          </div>

          <PricingCard
            subtotal={subtotal}
            totalDiscount={totalDiscount}
            finalValue={finalValue}
            buttonText="Confirmar Pagamento"
            onConfirmPayment={handleConfirmPayment}
          />
        </div>
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <AddressForm paymentMethod={paymentMethod} onClose={handleClose} />
        </Box>
      </Modal>
    </section>
  );
};
