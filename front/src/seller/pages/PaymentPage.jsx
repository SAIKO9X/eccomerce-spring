import { Divider } from "@mui/material";
import { TransactionTable } from "../components/payments/TransactionTable";
import { useAppSelector } from "../../state/store";
import { formatCurrencyBRL } from "../../utils/formatCurrencyBRL";

export const PaymentPage = () => {
  const { transactions, error } = useAppSelector((state) => state.transactions);

  if (error) {
    return <div>Erro ao carregar transações: {error}</div>;
  }

  const totalEarnings = transactions.reduce((acc, transaction) => {
    return acc + (transaction.order?.totalSellingPrice || 0);
  }, 0);

  const latestTransaction = transactions.reduce((latest, transaction) => {
    if (!latest || new Date(transaction.date) > new Date(latest.date)) {
      return transaction;
    }
    return latest;
  }, null);

  const lastPayment = latestTransaction
    ? latestTransaction.order?.totalSellingPrice || 0
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 p-4 bg-zinc-50 border border-zinc-300 rounded-md">
        <h1 className="font-playfair text-lg font-medium mb-2">
          Ganhos Totais
        </h1>
        <p>{formatCurrencyBRL(totalEarnings)}</p>
        <Divider />
        <p className="text-sm">
          Último Pagamento :{" "}
          <span className="text-zinc-400 font-medium">
            {formatCurrencyBRL(lastPayment)}
          </span>
        </p>
      </div>

      <div className="space-y-4">
        <h1 className="font-playfair text-lg font-medium mb-2">
          Todas as Transações
        </h1>
        <TransactionTable />
      </div>
    </div>
  );
};
