import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { maskMobile, maskCNPJ } from "../../../utils/masks";

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
              onChange={(e) => field.onChange(maskMobile(e.target.value))}
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
              onChange={(e) => field.onChange(maskCNPJ(e.target.value))}
              error={!!errors.cnpj}
              helperText={errors.cnpj?.message}
            />
          )}
        />
      </div>
    </div>
  );
};
