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
              label="Numero da Conta"
              error={!!errors.bankDetails?.accountNumber}
              helperText={errors.bankDetails?.accountNumber?.message}
            />
          )}
        />
        <Controller
          name="bankDetails.agencyNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Número da Agência"
              error={!!errors.bankDetails?.agencyNumber}
              helperText={errors.bankDetails?.agencyNumber?.message}
            />
          )}
        />
        <Controller
          name="bankDetails.accountHolderName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Nome do Titular da Conta"
              error={!!errors.bankDetails?.accountHolderName}
              helperText={errors.bankDetails?.accountHolderName?.message}
            />
          )}
        />
      </div>
    </div>
  );
};
