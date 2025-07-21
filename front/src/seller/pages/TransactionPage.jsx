import { TransactionTable } from "../components/payments/TransactionTable";

export const TransactionPage = () => {
  return (
    <div>
      <h1 className="capitalize font-medium font-playfair text-lg pb-4">
        transações realizadas
      </h1>
      <TransactionTable />
    </div>
  );
};
