import { Button } from "@mui/material";

export const PricingCard = ({
  subtotal = 0,
  totalDiscount = 0,
  finalValue = 0,
  buttonText = "Confirmar",
  onConfirmPayment,
}) => {
  return (
    <div className="border border-black/10 rounded-lg p-4 space-y-4">
      <h2 className="font-playfair font-medium text-lg">Resumo do Pedido</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Desconto:</span>
          <span>R$ {totalDiscount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>R$ {finalValue.toFixed(2)}</span>
        </div>
      </div>
      <Button
        variant="contained"
        fullWidth
        onClick={onConfirmPayment}
        disabled={finalValue <= 0}
      >
        {buttonText}
      </Button>
    </div>
  );
};
