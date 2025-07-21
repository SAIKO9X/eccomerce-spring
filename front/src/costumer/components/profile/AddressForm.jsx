import { Button, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const cepMask = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .substring(0, 9);
};

const mobileMask = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .substring(0, 15);
};

const validationSchema = Yup.object().shape({
  recipient: Yup.string().required("Nome do destinatário é obrigatório"),
  address: Yup.string().required("Endereço é obrigatório"),
  city: Yup.string().required("Cidade é obrigatória"),
  state: Yup.string().required("Estado é obrigatório"),
  cep: Yup.string()
    .matches(/^\d{5}-\d{3}$/, "Formato de CEP inválido")
    .required("CEP é obrigatório"),
  mobile: Yup.string()
    .matches(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato de celular inválido")
    .required("Celular é obrigatório"),
});

export const AddressForm = ({ initialData, onSubmit, onCancel }) => {
  const formik = useFormik({
    initialValues: {
      recipient: initialData?.recipient || "",
      address: initialData?.address || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      cep: initialData?.cep || "",
      mobile: initialData?.mobile || "",
    },
    validationSchema,
    onSubmit: (values) => {
      const unmaskedValues = {
        ...values,
        cep: values.cep.replace(/\D/g, ""),
        mobile: values.mobile.replace(/\D/g, ""),
      };
      onSubmit(unmaskedValues);
    },
  });

  const handleChangeWithMask = (e, mask) => {
    const { name, value } = e.target;
    const maskedValue = mask ? mask(value) : value;
    formik.setFieldValue(name, maskedValue);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      {/* Usando Stack para um layout vertical limpo */}
      <Stack spacing={3}>
        <TextField
          fullWidth
          name="recipient"
          label="Nome do Destinatário"
          value={formik.values.recipient}
          onChange={formik.handleChange}
          error={formik.touched.recipient && Boolean(formik.errors.recipient)}
          helperText={formik.touched.recipient && formik.errors.recipient}
        />
        <TextField
          fullWidth
          name="address"
          label="Endereço"
          value={formik.values.address}
          onChange={formik.handleChange}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
        />
        <TextField
          fullWidth
          name="city"
          label="Cidade"
          value={formik.values.city}
          onChange={formik.handleChange}
          error={formik.touched.city && Boolean(formik.errors.city)}
          helperText={formik.touched.city && formik.errors.city}
        />
        <TextField
          fullWidth
          name="state"
          label="Estado"
          value={formik.values.state}
          onChange={formik.handleChange}
          error={formik.touched.state && Boolean(formik.errors.state)}
          helperText={formik.touched.state && formik.errors.state}
        />
        <TextField
          fullWidth
          name="cep"
          label="CEP"
          value={formik.values.cep}
          onChange={(e) => handleChangeWithMask(e, cepMask)}
          error={formik.touched.cep && Boolean(formik.errors.cep)}
          helperText={formik.touched.cep && formik.errors.cep}
        />
        <TextField
          fullWidth
          name="mobile"
          label="Celular"
          value={formik.values.mobile}
          onChange={(e) => handleChangeWithMask(e, mobileMask)}
          error={formik.touched.mobile && Boolean(formik.errors.mobile)}
          helperText={formik.touched.mobile && formik.errors.mobile}
        />
        <div className="flex justify-between items-center">
          <Button onClick={onCancel} variant="outlined">
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            Salvar
          </Button>
        </div>
      </Stack>
    </form>
  );
};
