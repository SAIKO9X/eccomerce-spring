// front/src/seller/components/becomeSeller/ThirdStep.jsx

import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export const ThirdStep = ({ control, errors }) => {
  return (
    <div>
      <p className="text-lg font-playfair font-medium text-center pb-6">
        Dados Bancários
      </p>

      <div className="flex flex-col gap-4">
        <Controller
          name="bankDetails.accountNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Número da Conta"
              error={!!errors.bankDetails?.accountNumber}
              helperText={errors.bankDetails?.accountNumber?.message}
            />
          )}
        />
        <Controller
          name="bankDetails.ifscCode"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Código do Banco (IFSC/Código)"
              error={!!errors.bankDetails?.ifscCode}
              helperText={errors.bankDetails?.ifscCode?.message}
            />
          )}
        />
        <Controller
          name="bankDetails.accountHoldName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Nome do Titular da Conta"
              error={!!errors.bankDetails?.accountHoldName}
              helperText={errors.bankDetails?.accountHoldName?.message}
            />
          )}
        />
      </div>
    </div>
  );
};
