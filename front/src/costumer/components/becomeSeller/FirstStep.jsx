import { TextField } from "@mui/material";

export const FirstStep = ({ formik }) => {
  return (
    <div>
      <p className="text-lg font-playfair font-medium text-center pb-6">
        Detalhes de Contato
      </p>

      <div className="flex flex-col gap-4">
        <TextField
          fullWidth
          name="mobile"
          label="Número Celular"
          value={formik.values.mobile}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.mobile && Boolean(formik.errors.mobile)}
          helperText={formik.touched.mobile && formik.errors.mobile}
        />

        <TextField
          fullWidth
          name="cnpj"
          label="CNPJ"
          value={formik.values.cnpj}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.cnpj && Boolean(formik.errors.cnpj)}
          helperText={formik.touched.cnpj && formik.errors.cnpj}
        />
      </div>
    </div>
  );
};
