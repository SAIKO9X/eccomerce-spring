import { TextField } from "@mui/material";

export const ThirdStep = ({ formik }) => {
  return (
    <div>
      <p className="text-lg font-playfair font-medium text-center pb-6">
        Dados Bancários
      </p>

      <div className="flex flex-col gap-4">
        <TextField
          fullWidth
          name="bankDetails.accountNumber"
          label="Numero da Conta"
          value={formik.values.bankDetails.accountNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.bankDetails?.accountNumber &&
            Boolean(formik.errors.bankDetails.accountNumber)
          }
          helperText={
            formik.touched.bankDetails?.accountNumber &&
            formik.errors.bankDetails.accountNumber
          }
        />

        <TextField
          fullWidth
          name="bankDetails.agencyNumber"
          label="Número da Agência"
          value={formik.values.bankDetails.agencyNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.bankDetails?.agencyNumber &&
            Boolean(formik.errors.bankDetails.agencyNumber)
          }
          helperText={
            formik.touched.bankDetails?.agencyNumber &&
            formik.errors.bankDetails.agencyNumber
          }
        />

        <TextField
          fullWidth
          name="bankDetails.accountHolderName"
          label="Nome do Titular da Conta"
          value={formik.values.bankDetails.accountHolderName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.bankDetails?.accountHolderName &&
            Boolean(formik.errors.bankDetails.accountHolderName)
          }
          helperText={
            formik.touched.bankDetails?.accountHolderName &&
            formik.errors.bankDetails.accountHolderName
          }
        />
      </div>
    </div>
  );
};
