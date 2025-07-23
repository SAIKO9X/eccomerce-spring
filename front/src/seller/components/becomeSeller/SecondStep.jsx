import { Grid2, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { maskCEP, maskMobile } from "../../../utils/masks";

export const SecondStep = ({ control, errors }) => {
  return (
    <div className="max-h-auto">
      <p className="font-playfair text-lg font-medium text-center">
        Endereço de Retirada
      </p>

      <Grid2 container spacing={3} className="pt-4">
        <Grid2 size={{ xs: 12 }}>
          <Controller
            name="pickupAddress.recipient"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Nome do Destinatário"
                error={!!errors.pickupAddress?.recipient}
                helperText={errors.pickupAddress?.recipient?.message}
              />
            )}
          />
        </Grid2>
        <Grid2 size={{ xs: 6 }}>
          <Controller
            name="pickupAddress.mobile"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Telefone do Destinatário"
                onChange={(e) => field.onChange(maskMobile(e.target.value))}
                error={!!errors.pickupAddress?.mobile}
                helperText={errors.pickupAddress?.mobile?.message}
              />
            )}
          />
        </Grid2>
        <Grid2 size={{ xs: 6 }}>
          <Controller
            name="pickupAddress.cep"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Código Postal"
                onChange={(e) => field.onChange(maskCEP(e.target.value))}
                error={!!errors.pickupAddress?.cep}
                helperText={errors.pickupAddress?.cep?.message}
              />
            )}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Controller
            name="pickupAddress.address"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Endereço"
                error={!!errors.pickupAddress?.address}
                helperText={errors.pickupAddress?.address?.message}
              />
            )}
          />
        </Grid2>
        <Grid2 size={{ xs: 6 }}>
          <Controller
            name="pickupAddress.city"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Cidade"
                error={!!errors.pickupAddress?.city}
                helperText={errors.pickupAddress?.city?.message}
              />
            )}
          />
        </Grid2>
        <Grid2 size={{ xs: 6 }}>
          <Controller
            name="pickupAddress.state"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Estado"
                error={!!errors.pickupAddress?.state}
                helperText={errors.pickupAddress?.state?.message}
              />
            )}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Controller
            name="pickupAddress.locality"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Localidade"
                error={!!errors.pickupAddress?.locality}
                helperText={errors.pickupAddress?.locality?.message}
              />
            )}
          />
        </Grid2>
      </Grid2>
    </div>
  );
};
