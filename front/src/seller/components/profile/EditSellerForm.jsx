import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  Grid2,
  Typography,
  CircularProgress,
  Divider,
  Avatar,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import { updateSellerProfile } from "../../../state/seller/sellerSlice";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary";
import { useState } from "react";

// Schema de validação completo para todos os campos
const validationSchema = Yup.object().shape({
  sellerName: Yup.string().required("Nome da loja é obrigatório"),
  email: Yup.string().email("Email inválido").required("Email é obrigatório"),
  mobile: Yup.string().required("Telefone é obrigatório"),
  cnpj: Yup.string().required("CNPJ é obrigatório"),
  businessDetails: Yup.object().shape({
    businessName: Yup.string().required("Nome do negócio é obrigatório"),
    businessEmail: Yup.string().email("Email do negócio inválido"),
    businessMobile: Yup.string(),
    businessAddress: Yup.string(),
  }),
  pickupAddress: Yup.object().shape({
    recipient: Yup.string().required("Nome do destinatário é obrigatório"),
    address: Yup.string().required("Endereço é obrigatório"),
    city: Yup.string().required("Cidade é obrigatória"),
    state: Yup.string().required("Estado é obrigatório"),
    cep: Yup.string().required("CEP é obrigatório"),
    mobile: Yup.string().required("Telefone do endereço é obrigatório"),
  }),
  bankDetails: Yup.object().shape({
    accountHoldName: Yup.string().required(
      "Nome do titular da conta é obrigatório"
    ),
    accountNumber: Yup.string().required("Número da conta é obrigatório"),
    ifscCode: Yup.string().required("Código do banco é obrigatório"),
  }),
});

export const EditSellerForm = ({ seller }) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.seller);
  const [isUploading, setIsUploading] = useState(false);

  const formik = useFormik({
    initialValues: {
      sellerName: seller?.sellerName || "",
      email: seller?.email || "",
      mobile: seller?.mobile || "",
      cnpj: seller?.cnpj || "",
      businessDetails: seller?.businessDetails || {
        businessName: "",
        businessEmail: "",
        businessMobile: "",
      },
      pickupAddress: seller?.pickupAddress || {
        recipient: "",
        address: "",
        city: "",
        state: "",
        cep: "",
        mobile: "",
      },
      bankDetails: seller?.bankDetails || {
        accountHoldName: "",
        accountNumber: "",
        ifscCode: "",
      },
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const jwt = localStorage.getItem("jwt");
      dispatch(updateSellerProfile({ sellerData: values, jwt }));
    },
  });

  const handleLogoUpload = async (e) => {
    setIsUploading(true);
    const file = e.target.files[0];
    if (file) {
      try {
        const logoUrl = await uploadToCloudinary(file);
        formik.setFieldValue("businessDetails.logo", logoUrl);
      } catch (error) {
        console.error("Erro no upload da logo:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid2
        size={12}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          src={formik.values.businessDetails.logo}
          sx={{ width: 100, height: 100 }}
        />
        <Button variant="outlined" component="label" disabled={isUploading}>
          {isUploading ? <CircularProgress size={24} /> : "Alterar Logo"}
          <input
            type="file"
            hidden
            onChange={handleLogoUpload}
            accept="image/*"
          />
        </Button>
      </Grid2>

      <Grid2 container spacing={3}>
        {/* Informações da Loja */}
        <Grid2 size={12}>
          <Typography variant="h6">Informações da Loja</Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Nome da Loja"
            name="sellerName"
            {...formik.getFieldProps("sellerName")}
            error={
              formik.touched.sellerName && Boolean(formik.errors.sellerName)
            }
            helperText={formik.touched.sellerName && formik.errors.sellerName}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Email de Contato"
            name="email"
            {...formik.getFieldProps("email")}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Telefone"
            name="mobile"
            {...formik.getFieldProps("mobile")}
            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
            helperText={formik.touched.mobile && formik.errors.mobile}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="CNPJ"
            name="cnpj"
            {...formik.getFieldProps("cnpj")}
            error={formik.touched.cnpj && Boolean(formik.errors.cnpj)}
            helperText={formik.touched.cnpj && formik.errors.cnpj}
          />
        </Grid2>

        <Grid2 size={12}>
          <Divider sx={{ my: 2 }} />
        </Grid2>

        {/* Detalhes do Negócio */}
        <Grid2 size={12}>
          <Typography variant="h6">Detalhes do Negócio</Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Nome do Negócio"
            name="businessDetails.businessName"
            {...formik.getFieldProps("businessDetails.businessName")}
            error={
              formik.touched.businessDetails?.businessName &&
              Boolean(formik.errors.businessDetails?.businessName)
            }
            helperText={
              formik.touched.businessDetails?.businessName &&
              formik.errors.businessDetails?.businessName
            }
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Email do Negócio"
            name="businessDetails.businessEmail"
            {...formik.getFieldProps("businessDetails.businessEmail")}
            error={
              formik.touched.businessDetails?.businessEmail &&
              Boolean(formik.errors.businessDetails?.businessEmail)
            }
            helperText={
              formik.touched.businessDetails?.businessEmail &&
              formik.errors.businessDetails?.businessEmail
            }
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Telefone do Negócio"
            name="businessDetails.businessMobile"
            {...formik.getFieldProps("businessDetails.businessMobile")}
            error={
              formik.touched.businessDetails?.businessMobile &&
              Boolean(formik.errors.businessDetails?.businessMobile)
            }
            helperText={
              formik.touched.businessDetails?.businessMobile &&
              formik.errors.businessDetails?.businessMobile
            }
          />
        </Grid2>

        <Grid2 size={12}>
          <Divider sx={{ my: 2 }} />
        </Grid2>

        {/* Endereço de Retirada */}
        <Grid2 size={12}>
          <Typography variant="h6">Endereço de Retirada</Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Destinatário"
            name="pickupAddress.recipient"
            {...formik.getFieldProps("pickupAddress.recipient")}
            error={
              formik.touched.pickupAddress?.recipient &&
              Boolean(formik.errors.pickupAddress?.recipient)
            }
            helperText={
              formik.touched.pickupAddress?.recipient &&
              formik.errors.pickupAddress?.recipient
            }
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Telefone do Endereço"
            name="pickupAddress.mobile"
            {...formik.getFieldProps("pickupAddress.mobile")}
            error={
              formik.touched.pickupAddress?.mobile &&
              Boolean(formik.errors.pickupAddress?.mobile)
            }
            helperText={
              formik.touched.pickupAddress?.mobile &&
              formik.errors.pickupAddress?.mobile
            }
          />
        </Grid2>
        <Grid2 size={12}>
          <TextField
            fullWidth
            label="Endereço Completo"
            name="pickupAddress.address"
            {...formik.getFieldProps("pickupAddress.address")}
            error={
              formik.touched.pickupAddress?.address &&
              Boolean(formik.errors.pickupAddress?.address)
            }
            helperText={
              formik.touched.pickupAddress?.address &&
              formik.errors.pickupAddress?.address
            }
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Cidade"
            name="pickupAddress.city"
            {...formik.getFieldProps("pickupAddress.city")}
            error={
              formik.touched.pickupAddress?.city &&
              Boolean(formik.errors.pickupAddress?.city)
            }
            helperText={
              formik.touched.pickupAddress?.city &&
              formik.errors.pickupAddress?.city
            }
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Estado"
            name="pickupAddress.state"
            {...formik.getFieldProps("pickupAddress.state")}
            error={
              formik.touched.pickupAddress?.state &&
              Boolean(formik.errors.pickupAddress?.state)
            }
            helperText={
              formik.touched.pickupAddress?.state &&
              formik.errors.pickupAddress?.state
            }
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="CEP"
            name="pickupAddress.cep"
            {...formik.getFieldProps("pickupAddress.cep")}
            error={
              formik.touched.pickupAddress?.cep &&
              Boolean(formik.errors.pickupAddress?.cep)
            }
            helperText={
              formik.touched.pickupAddress?.cep &&
              formik.errors.pickupAddress?.cep
            }
          />
        </Grid2>

        <Grid2 size={12}>
          <Divider sx={{ my: 2 }} />
        </Grid2>

        {/* Detalhes Bancários */}
        <Grid2 size={12}>
          <Typography variant="h6">Detalhes Bancários</Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Nome do Titular"
            name="bankDetails.accountHoldName"
            {...formik.getFieldProps("bankDetails.accountHoldName")}
            error={
              formik.touched.bankDetails?.accountHoldName &&
              Boolean(formik.errors.bankDetails?.accountHoldName)
            }
            helperText={
              formik.touched.bankDetails?.accountHoldName &&
              formik.errors.bankDetails?.accountHoldName
            }
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Número da Conta"
            name="bankDetails.accountNumber"
            {...formik.getFieldProps("bankDetails.accountNumber")}
            error={
              formik.touched.bankDetails?.accountNumber &&
              Boolean(formik.errors.bankDetails?.accountNumber)
            }
            helperText={
              formik.touched.bankDetails?.accountNumber &&
              formik.errors.bankDetails?.accountNumber
            }
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Código do Banco"
            name="bankDetails.ifscCode"
            {...formik.getFieldProps("bankDetails.ifscCode")}
            error={
              formik.touched.bankDetails?.ifscCode &&
              Boolean(formik.errors.bankDetails?.ifscCode)
            }
            helperText={
              formik.touched.bankDetails?.ifscCode &&
              formik.errors.bankDetails?.ifscCode
            }
          />
        </Grid2>

        <Grid2 size={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            sx={{ mt: 3, p: "1rem" }}
          >
            {loading ? <CircularProgress size={24} /> : "Salvar Alterações"}
          </Button>
        </Grid2>
      </Grid2>
    </form>
  );
};
