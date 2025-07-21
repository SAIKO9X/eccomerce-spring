import { TextField } from "@mui/material";

export const FourthStep = ({ formik }) => {
  return (
    <div>
      <p className="text-lg font-playfair font-medium text-center pb-6">
        Detalhes do Fornecedor
      </p>

      <div className="flex flex-col gap-4">
        <TextField
          fullWidth
          name="businessDetails.businessEmail"
          label="Email da Empresa"
          value={formik.values.businessDetails.businessEmail}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.businessDetails?.businessEmail &&
            Boolean(formik.errors.businessDetails.businessEmail)
          }
          helperText={
            formik.touched.businessDetails?.businessEmail &&
            formik.errors.businessDetails.businessEmail
          }
        />

        <TextField
          fullWidth
          name="password"
          label="Senha"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched?.password && Boolean(formik.errors.password)}
          helperText={formik.touched?.password && formik.errors.password}
        />

        <TextField
          fullWidth
          name="businessDetails.businessName"
          label="Nome da Empresa"
          value={formik.values.businessDetails.businessName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.businessDetails?.businessName &&
            Boolean(formik.errors.businessDetails.businessName)
          }
          helperText={
            formik.touched.businessDetails?.businessName &&
            formik.errors.businessDetails.businessName
          }
        />

        <TextField
          fullWidth
          name="businessDetails.businessPhone"
          label="Telefone da Empresa"
          value={formik.values.businessDetails.businessPhone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.businessDetails?.businessPhone &&
            Boolean(formik.errors.businessDetails.businessPhone)
          }
          helperText={
            formik.touched.businessDetails?.businessPhone &&
            formik.errors.businessDetails.businessPhone
          }
        />
      </div>
    </div>
  );
};
