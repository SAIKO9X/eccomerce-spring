import { TextField } from "@mui/material";
import { maskMobile, maskCNPJ } from "../../../utils/masks";

export const FirstStep = ({ formik }) => {
  const handleMaskedChange = (fieldName, maskFunction) => (event) => {
    const maskedValue = maskFunction(event.target.value);
    formik.setFieldValue(fieldName, maskedValue);
  };

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
          onChange={handleMaskedChange("mobile", maskMobile)}
          onBlur={formik.handleBlur}
          error={formik.touched.mobile && Boolean(formik.errors.mobile)}
          helperText={formik.touched.mobile && formik.errors.mobile}
          inputProps={{
            maxLength: 15, // (99) 99999-9999
          }}
        />
        <TextField
          fullWidth
          name="cnpj"
          label="CNPJ"
          value={formik.values.cnpj}
          onChange={handleMaskedChange("cnpj", maskCNPJ)}
          onBlur={formik.handleBlur}
          error={formik.touched.cnpj && Boolean(formik.errors.cnpj)}
          helperText={formik.touched.cnpj && formik.errors.cnpj}
          inputProps={{
            maxLength: 18, // XX.XXX.XXX/XXXX-XX
          }}
        />
      </div>
    </div>
  );
};
