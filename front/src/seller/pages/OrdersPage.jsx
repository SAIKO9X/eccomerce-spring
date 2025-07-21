import { OrderTable } from "../components/orders/OrderTable";

export const OrdersPage = () => {
  return (
    <div>
      <h1 className="capitalize font-medium font-playfair text-lg pb-4">
        todos os pedidos
      </h1>
      <OrderTable />
    </div>
  );
};
