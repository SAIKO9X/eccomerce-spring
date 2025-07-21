import { useEffect } from "react";
import { OrderItem } from "./OrderItem";
import { getUsersOrderHistory } from "../../../state/customer/orderSlice";
import { useAppDispatch, useAppSelector } from "../../../state/store";

export const Orders = () => {
  const dispatch = useAppDispatch();
  const { order } = useAppSelector((state) => state);

  useEffect(() => {
    dispatch(getUsersOrderHistory(localStorage.getItem("jwt")));
  }, [dispatch]);

  const paidOrders = order.orders.filter(
    (order) => order.paymentStatus === "COMPLETED"
  );

  return (
    <div>
      <div className="pb-5">
        <h2 className="font-semibold font-playfair text-base">
          Todas Entregas
        </h2>
        <p className="text-zinc-400 uppercase">GERAL</p>
      </div>
      <div className="space-y-6">
        {paidOrders.length > 0 ? (
          paidOrders.map((order) =>
            order.orderItems.map((item) => (
              <OrderItem key={item.id} item={item} order={order} />
            ))
          )
        ) : (
          <p className="text-center text-zinc-500">Nenhum pedido feito</p>
        )}
      </div>
    </div>
  );
};
