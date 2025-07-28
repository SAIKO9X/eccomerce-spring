import { TextField } from "@mui/material";
import { onlyNumbers } from "../../../utils/masks";

export const ThirdStep = ({ formik }) => {
  const handleNumberChange = (fieldName) => (event) => {
    const numericValue = onlyNumbers(event.target.value);
    formik.setFieldValue(fieldName, numericValue);
  };

  const getFieldError = (fieldPath) => {
    const [parent, child] = fieldPath.split(".");
    return formik.touched[parent]?.[child] && formik.errors[parent]?.[child];
  };

  const getFieldTouched = (fieldPath) => {
    const [parent, child] = fieldPath.split(".");
    return formik.touched[parent]?.[child];
  };

  return (
    <div>
      <p className="text-lg font-playfair font-medium text-center pb-6">
        Dados Bancários
      </p>
      <div className="flex flex-col gap-4">
        <TextField
          fullWidth
          name="bankDetails.accountNumber"
          label="Número da Conta"
          value={formik.values.bankDetails.accountNumber}
          onChange={handleNumberChange("bankDetails.accountNumber")}
          onBlur={formik.handleBlur}
          error={
            getFieldTouched("bankDetails.accountNumber") &&
            Boolean(getFieldError("bankDetails.accountNumber"))
          }
          helperText={
            getFieldTouched("bankDetails.accountNumber") &&
            getFieldError("bankDetails.accountNumber")
          }
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
        />
        <TextField
          fullWidth
          name="bankDetails.ifscCode"
          label="Código do Banco (IFSC/Código)"
          value={formik.values.bankDetails.ifscCode}
          onChange={handleNumberChange("bankDetails.ifscCode")}
          onBlur={formik.handleBlur}
          error={
            getFieldTouched("bankDetails.ifscCode") &&
            Boolean(getFieldError("bankDetails.ifscCode"))
          }
          helperText={
            getFieldTouched("bankDetails.ifscCode") &&
            getFieldError("bankDetails.ifscCode")
          }
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
        />
        <TextField
          fullWidth
          name="bankDetails.accountHoldName"
          label="Nome do Titular da Conta"
          value={formik.values.bankDetails.accountHoldName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            getFieldTouched("bankDetails.accountHoldName") &&
            Boolean(getFieldError("bankDetails.accountHoldName"))
          }
          helperText={
            getFieldTouched("bankDetails.accountHoldName") &&
            getFieldError("bankDetails.accountHoldName")
          }
        />
      </div>
    </div>
  );
};
