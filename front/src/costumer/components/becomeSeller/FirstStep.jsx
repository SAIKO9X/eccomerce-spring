import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export const FirstStep = ({ control, errors }) => {
  return (
    <div>
      <p className="text-lg font-playfair font-medium text-center pb-6">
        Detalhes de Contato
      </p>

      <div className="flex flex-col gap-4">
        <Controller
          name="mobile"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Número Celular"
              error={!!errors.mobile}
              helperText={errors.mobile?.message}
            />
          )}
        />
        <Controller
          name="cnpj"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="CNPJ"
              error={!!errors.cnpj}
              helperText={errors.cnpj?.message}
            />
          )}
        />
      </div>
    </div>
  );
};
