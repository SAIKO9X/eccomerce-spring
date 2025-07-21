import { Button, Divider } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { OrderStepper } from "./OrderStepper";
import { Payments } from "@mui/icons-material";
import { useEffect } from "react";
import {
  getOrderById,
  getOrderItemById,
} from "../../../state/customer/orderSlice";
import { formatCurrencyBRL } from "../../../utils/formatCurrencyBRL";
import { useAppDispatch, useAppSelector } from "../../../state/store";

export const OrderDetails = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { orderId, orderItemId } = useParams();
  const { order } = useAppSelector((state) => state);

  useEffect(() => {
    dispatch(getOrderById({ orderId, jwt: localStorage.getItem("jwt") }));
    dispatch(
      getOrderItemById({ orderItemId, jwt: localStorage.getItem("jwt") })
    );
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-5 justify-center items-center">
        <img
          className="w-28 object-center object-cover rounded-md"
          src={order.orderItem?.product.images[0]}
          alt="imagem do produto"
        />

        <div className="text-sm space-y-2 text-center w-4/5">
          <h3 className="font-playfair font-medium text-lg">
            {order.orderItem?.product.title}
          </h3>
          <p className="font-medium text-base">
            {order.orderItem?.product.seller?.businessDetails.businessName}
          </p>
          <p className="text-sm text-zinc-400">
            {order.orderItem?.product.description}
          </p>
          <p className="font-medium">TAMANHO: {order.orderItem?.size}</p>
        </div>

        <Button
          size="small"
          variant="contained"
          onClick={() =>
            navigate(`/reviews/${order.orderItem?.product.id}/create`)
          }
        >
          Escrever Avaliação
        </Button>
      </div>

      <div className="border border-black/10 p-5 rounded-md">
        <OrderStepper orderStatus={"SHIPPED"} />
      </div>

      <div className="border border-black/10 p-5 rounded-md">
        <h2 className="font-medium font-playfair text-lg pb-4">
          Endereço de Entrega
        </h2>
        <div className="text-sm space-y-2">
          <div className="flex gap-5 font-medium">
            <p>Destinatário: {order.currentOrder?.orderAddress.recipient}</p>
            <Divider flexItem orientation="vertical" />
            <p>Celular: {order.currentOrder?.orderAddress.mobile}</p>
          </div>

          <p>
            {order.currentOrder?.orderAddress.address},{" "}
            {order.currentOrder?.orderAddress.state},{" "}
            {order.currentOrder?.orderAddress.city} -
            {order.currentOrder?.orderAddress.cep}
          </p>
        </div>
      </div>

      <div className="border border-black/10 rounded-md space-y-4">
        <div className="flex justify-between items-center text-sm p-5">
          <div className="space-y-1">
            <p className="font-semibold">Preço Total do Pedido</p>
            <p>
              Você salvou{" "}
              <span className="text-xs font-medium text-zinc-400">
                50,00 R$
              </span>{" "}
              nesse pedido
            </p>
          </div>

          <p className="font-medium">
            {formatCurrencyBRL(order.orderItem?.sellingPrice)}
          </p>
        </div>

        <div className="px-5">
          <div className="px-5 py-4 text-xs font-medium flex items-center gap-3 bg-black/5 rounded-md">
            <Payments />
            <p>Cartão de Crédito</p>
          </div>
        </div>

        <Divider />

        <div className="p-5">
          <p className="text-sm">
            vendido e entregue por:{" "}
            <span className="text-zinc-400">
              {order.orderItem?.product.seller?.businessDetails.businessName}
            </span>
          </p>
        </div>

        <div className="px-10 pb-5">
          <Button
            // onClick={handleCancelOrder}
            color="error"
            sx={{ py: "0.7rem" }}
            variant="outlined"
            fullWidth
          >
            {false ? "Pedido Cancelado" : "Cancelar Pedido"}
          </Button>
        </div>
      </div>
    </div>
  );
};
