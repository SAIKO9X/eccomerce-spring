import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export const FourthStep = ({ control, errors, submitFailed }) => {
  const showGeneralError =
    submitFailed && (errors.sellerName || errors.businessDetails?.businessName);

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
            <TextField {...field} fullWidth label="Seu Nome de Vendedor" />
          )}
        />
        <Controller
          name="businessDetails.businessName"
          control={control}
          render={({ field }) => (
            <TextField {...field} fullWidth label="Nome da Empresa" />
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
              disabled
              label="Telefone da Empresa"
              error={!!errors.businessDetails?.businessPhone}
              helperText={errors.businessDetails?.businessPhone?.message}
            />
          )}
        />
      </div>

      {showGeneralError && (
        <p className="text-red-500 text-sm mt-4 text-center">
          Todos os campos obrigatórios devem ser preenchidos para continuar.
        </p>
      )}
    </div>
  );
};
