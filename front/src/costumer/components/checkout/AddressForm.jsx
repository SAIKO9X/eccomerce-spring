import { Button, Grid2, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../../state/store";
import { addAddress, getUserProfile } from "../../../state/authSlice";
import { maskMobile, maskCEP } from "../../../utils/masks";

const AddressFormSchema = Yup.object().shape({
  mobile: Yup.string()
    .matches(/^\(\d{2}\) \d{5}-\d{4}$/, "Use o formato (99) 99999-9999")
    .required("Número de telefone é obrigatório"),
  cep: Yup.string()
    .matches(/^\d{5}-\d{3}$/, "Use o formato 99999-999")
    .required("Código postal é obrigatório"),
  recipient: Yup.string().required("Nome do destinatário é obrigatório"),
  address: Yup.string().required("Endereço é obrigatório"),
  city: Yup.string().required("Cidade é obrigatória"),
  state: Yup.string().required("Estado é obrigatório"),
});

export const AddressForm = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      mobile: "",
      cep: "",
      recipient: "",
      address: "",
      city: "",
      state: "",
    },
    validationSchema: AddressFormSchema,
    onSubmit: (values) => {
      const jwt = localStorage.getItem("jwt");
      dispatch(addAddress({ jwt, address: values }))
        .unwrap()
        .then(() => {
          dispatch(getUserProfile({ jwt }));
          onClose();
        })
        .catch((error) => console.error("Erro ao adicionar endereço:", error));
    },
  });

  // Função para lidar com mudanças nos campos com máscara
  const handleMaskedChange = (fieldName, maskFunction) => (event) => {
    const maskedValue = maskFunction(event.target.value);
    formik.setFieldValue(fieldName, maskedValue);
  };

  return (
    <div className="max-h-auto">
      <p className="font-playfair font-medium pb-4">Detalhe dos Contatos</p>
      <form onSubmit={formik.handleSubmit}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="recipient"
              label="Nome Completo"
              value={formik.values.recipient}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.recipient && Boolean(formik.errors.recipient)
              }
              helperText={formik.touched.recipient && formik.errors.recipient}
            />
          </Grid2>
          <Grid2 className="pt-4" size={{ xs: 12 }}>
            <TextField
              fullWidth
              name="address"
              label="Endereço de Entrega"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
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
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <TextField
              fullWidth
              name="cep"
              label="Código Postal"
              value={formik.values.cep}
              onChange={handleMaskedChange("cep", maskCEP)}
              onBlur={formik.handleBlur}
              error={formik.touched.cep && Boolean(formik.errors.cep)}
              helperText={formik.touched.cep && formik.errors.cep}
              inputProps={{
                maxLength: 9, // 99999-999
              }}
            />
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <TextField
              fullWidth
              name="city"
              label="Cidade"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
            />
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <TextField
              fullWidth
              name="state"
              label="Estado"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.state && Boolean(formik.errors.state)}
              helperText={formik.touched.state && formik.errors.state}
            />
          </Grid2>
          <Grid2 size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ py: "14px" }}
              fullWidth
            >
              Adicionar Endereço
            </Button>
          </Grid2>
        </Grid2>
      </form>
    </div>
  );
};
