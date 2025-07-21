import { Button } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../state/store";
import { useEffect } from "react";
import { paymentSuccess } from "../../state/customer/orderSlice";

export const PaymentSuccess = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();

  const getQueryParams = (key) => {
    const query = new URLSearchParams(location.search);
    return query.get(key);
  };

  useEffect(() => {
    const paymentLinkId = getQueryParams("paymentLinkId");
    const jwt = localStorage.getItem("jwt");
    if (orderId && paymentLinkId && jwt) {
      dispatch(paymentSuccess({ orderId, paymentLinkId }));
    }
  }, [orderId, location.search, dispatch]);

  return (
    <section className="flex justify-center items-center h-[90vh]">
      <div className="flex flex-col items-center justify-center gap-10">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-medium font-playfair">Parabéns</h1>
          <p>Sua compra foi realizada com sucesso!</p>
        </div>
        <Button variant="contained" onClick={() => navigate("/")}>
          Voltar para Loja
        </Button>
      </div>
    </section>
  );
};
