import { Grid2, TextField } from "@mui/material";

export const SecondStep = ({ formik }) => {
  return (
    <div className="max-h-auto">
      <p className="font-playfair text-lg font-medium text-center">
        Endereço de Retirada
      </p>

      <form onSubmit={formik.handleSubmit}>
        <Grid2 container spacing={3}>
          <Grid2 className="pt-4" size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="pickupAddress.name"
              label="Nome Completo"
              value={formik.values.pickupAddress.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.pickupAddress?.name &&
                Boolean(formik.errors.pickupAddress.name)
              }
              helperText={
                formik.touched.pickupAddress?.name &&
                formik.errors.pickupAddress.name
              }
            />
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <TextField
              fullWidth
              name="pickupAddress.mobile"
              label="Número Celular"
              value={formik.values.pickupAddress.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.pickupAddress?.mobile &&
                Boolean(formik.errors.pickupAddress.mobile)
              }
              helperText={
                formik.touched.pickupAddress?.mobile &&
                formik.errors.pickupAddress.mobile
              }
            />
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <TextField
              fullWidth
              name="pickupAddress.cep"
              label="Código Postal"
              value={formik.values.pickupAddress.cep}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.pickupAddress?.cep &&
                Boolean(formik.errors.pickupAddress.cep)
              }
              helperText={
                formik.touched.pickupAddress?.cep &&
                formik.errors.pickupAddress.cep
              }
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="pickupAddress.address"
              label="Endereço"
              value={formik.values.pickupAddress.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.pickupAddress?.address &&
                Boolean(formik.errors.pickupAddress.address)
              }
              helperText={
                formik.touched.pickupAddress?.address &&
                formik.errors.pickupAddress.address
              }
            />
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <TextField
              fullWidth
              name="pickupAddress.city"
              label="Cidade"
              value={formik.values.pickupAddress.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.pickupAddress?.city &&
                Boolean(formik.errors.pickupAddress.city)
              }
              helperText={
                formik.touched.pickupAddress?.city &&
                formik.errors.pickupAddress.city
              }
            />
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <TextField
              fullWidth
              name="pickupAddress.state"
              label="Estado"
              value={formik.values.pickupAddress.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.pickupAddress?.state &&
                Boolean(formik.errors.pickupAddress.state)
              }
              helperText={
                formik.touched.pickupAddress?.state &&
                formik.errors.pickupAddress.state
              }
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="pickupAddress.locality"
              label="Localidade"
              value={formik.values.pickupAddress.locality}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.pickupAddress?.locality &&
                Boolean(formik.errors.pickupAddress.locality)
              }
              helperText={
                formik.touched.pickupAddress?.locality &&
                formik.errors.pickupAddress.locality
              }
            />
          </Grid2>
        </Grid2>
      </form>
    </div>
  );
};
