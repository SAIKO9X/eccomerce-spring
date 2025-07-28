import { Grid2, TextField } from "@mui/material";
import { maskCEP, maskMobile } from "../../../utils/masks";

export const SecondStep = ({ formik }) => {
  const handleMaskedChange = (fieldName, maskFunction) => (event) => {
    const maskedValue = maskFunction(event.target.value);
    formik.setFieldValue(fieldName, maskedValue);
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
    <div className="max-h-auto">
      <p className="font-playfair text-lg font-medium text-center">
        Endereço de Retirada
      </p>
      <Grid2 container spacing={3} className="pt-4">
        <Grid2 size={{ xs: 12 }}>
          <TextField
            fullWidth
            name="pickupAddress.recipient"
            label="Nome do Destinatário"
            value={formik.values.pickupAddress.recipient}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              getFieldTouched("pickupAddress.recipient") &&
              Boolean(getFieldError("pickupAddress.recipient"))
            }
            helperText={
              getFieldTouched("pickupAddress.recipient") &&
              getFieldError("pickupAddress.recipient")
            }
          />
        </Grid2>
        <Grid2 size={{ xs: 6 }}>
          <TextField
            fullWidth
            disabled
            name="pickupAddress.mobile"
            label="Telefone do Destinatário"
            value={formik.values.pickupAddress.mobile}
            onChange={handleMaskedChange("pickupAddress.mobile", maskMobile)}
            onBlur={formik.handleBlur}
            error={
              getFieldTouched("pickupAddress.mobile") &&
              Boolean(getFieldError("pickupAddress.mobile"))
            }
            helperText={
              getFieldTouched("pickupAddress.mobile") &&
              getFieldError("pickupAddress.mobile")
            }
            inputProps={{
              maxLength: 15, // (99) 99999-9999
            }}
          />
        </Grid2>
        <Grid2 size={{ xs: 6 }}>
          <TextField
            fullWidth
            name="pickupAddress.cep"
            label="Código Postal"
            value={formik.values.pickupAddress.cep}
            onChange={handleMaskedChange("pickupAddress.cep", maskCEP)}
            onBlur={formik.handleBlur}
            error={
              getFieldTouched("pickupAddress.cep") &&
              Boolean(getFieldError("pickupAddress.cep"))
            }
            helperText={
              getFieldTouched("pickupAddress.cep") &&
              getFieldError("pickupAddress.cep")
            }
            inputProps={{
              maxLength: 9, // 99999-999
            }}
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
              getFieldTouched("pickupAddress.address") &&
              Boolean(getFieldError("pickupAddress.address"))
            }
            helperText={
              getFieldTouched("pickupAddress.address") &&
              getFieldError("pickupAddress.address")
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
              getFieldTouched("pickupAddress.city") &&
              Boolean(getFieldError("pickupAddress.city"))
            }
            helperText={
              getFieldTouched("pickupAddress.city") &&
              getFieldError("pickupAddress.city")
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
              getFieldTouched("pickupAddress.state") &&
              Boolean(getFieldError("pickupAddress.state"))
            }
            helperText={
              getFieldTouched("pickupAddress.state") &&
              getFieldError("pickupAddress.state")
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
              getFieldTouched("pickupAddress.locality") &&
              Boolean(getFieldError("pickupAddress.locality"))
            }
            helperText={
              getFieldTouched("pickupAddress.locality") &&
              getFieldError("pickupAddress.locality")
            }
          />
        </Grid2>
      </Grid2>
    </div>
  );
};
