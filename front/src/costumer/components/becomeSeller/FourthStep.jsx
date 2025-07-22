import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export const FourthStep = ({ control, errors }) => {
  return (
    <div>
      <p className="text-lg font-playfair font-medium text-center pb-6">
        Detalhes do Fornecedor
      </p>

      <div className="flex flex-col gap-4">
        <Controller
          name="sellerName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Seu Nome de Vendedor"
              error={!!errors.sellerName}
              helperText={errors.sellerName?.message}
            />
          )}
        />
        <Controller
          name="businessDetails.businessName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Nome da Empresa"
              error={!!errors.businessDetails?.businessName}
              helperText={errors.businessDetails?.businessName?.message}
            />
          )}
        />
        <Controller
          name="businessDetails.businessEmail"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Email da Empresa"
              error={!!errors.businessDetails?.businessEmail}
              helperText={errors.businessDetails?.businessEmail?.message}
            />
          )}
        />
        <Controller
          name="businessDetails.businessPhone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Telefone da Empresa"
              error={!!errors.businessDetails?.businessPhone}
              helperText={errors.businessDetails?.businessPhone?.message}
            />
          )}
        />
      </div>
    </div>
  );
};
