import { TextField } from "@mui/material";

export const FourthStep = ({ formik, submitFailed }) => {
  const getFieldError = (fieldPath) => {
    if (fieldPath.includes(".")) {
      const [parent, child] = fieldPath.split(".");
      return formik.touched[parent]?.[child] && formik.errors[parent]?.[child];
    }
    return formik.touched[fieldPath] && formik.errors[fieldPath];
  };

  const getFieldTouched = (fieldPath) => {
    if (fieldPath.includes(".")) {
      const [parent, child] = fieldPath.split(".");
      return formik.touched[parent]?.[child];
    }
    return formik.touched[fieldPath];
  };

  const showGeneralError =
    submitFailed &&
    (formik.errors.sellerName || formik.errors.businessDetails?.businessName);

  return (
    <div>
      <p className="text-lg font-playfair font-medium text-center pb-6">
        Detalhes do Fornecedor
      </p>
      <div className="flex flex-col gap-4">
        <TextField
          fullWidth
          name="sellerName"
          label="Seu Nome de Vendedor"
          value={formik.values.sellerName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            getFieldTouched("sellerName") &&
            Boolean(getFieldError("sellerName"))
          }
          helperText={
            getFieldTouched("sellerName") && getFieldError("sellerName")
          }
        />
        <TextField
          fullWidth
          name="businessDetails.businessName"
          label="Nome da Empresa"
          value={formik.values.businessDetails.businessName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            getFieldTouched("businessDetails.businessName") &&
            Boolean(getFieldError("businessDetails.businessName"))
          }
          helperText={
            getFieldTouched("businessDetails.businessName") &&
            getFieldError("businessDetails.businessName")
          }
        />
        <TextField
          fullWidth
          name="businessDetails.businessEmail"
          label="Email da Empresa"
          type="email"
          value={formik.values.businessDetails.businessEmail}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            getFieldTouched("businessDetails.businessEmail") &&
            Boolean(getFieldError("businessDetails.businessEmail"))
          }
          helperText={
            getFieldTouched("businessDetails.businessEmail") &&
            getFieldError("businessDetails.businessEmail")
          }
        />
        <TextField
          fullWidth
          disabled
          name="businessDetails.businessPhone"
          label="Telefone da Empresa"
          value={formik.values.businessDetails.businessPhone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            getFieldTouched("businessDetails.businessPhone") &&
            Boolean(getFieldError("businessDetails.businessPhone"))
          }
          helperText={
            getFieldTouched("businessDetails.businessPhone") &&
            getFieldError("businessDetails.businessPhone")
          }
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
