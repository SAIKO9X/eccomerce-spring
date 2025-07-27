import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress, TextField } from "@mui/material";
import { login, sendLoginRegisterOtp } from "../../../state/authSlice";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAlert } from "../../../utils/useAlert";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { auth } = useAppSelector((store) => store);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const { showAlert, AlertComponent } = useAlert();

  const validationSchema = Yup.object({
    email: Yup.string().email("Email inválido").required("Email é obrigatório"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const loginData = isAdminLogin
        ? { email: values.email, password: values.password }
        : { email: values.email, otp: values.otp };

      dispatch(login(loginData));
    },
  });

  useEffect(() => {
    if (formik.values.email === ADMIN_EMAIL) {
      setIsAdminLogin(true);
    } else {
      setIsAdminLogin(false);
    }
  }, [formik.values.email]);

  const handleSentOtp = () => {
    dispatch(
      sendLoginRegisterOtp({
        email: formik.values.email,
        role: "ROLE_CUSTOMER",
      })
    )
      .unwrap()
      .then(() => {
        showAlert("Código de verificação enviado!", "success");
      })
      .catch((error) => {
        const errorMessage =
          error.message || "E-mail não encontrado ou inválido.";
        showAlert(errorMessage, "error");
      });
  };

  return (
    <div className="space-y-4 mb-4">
      {AlertComponent()}

      <h1 className="text-center text-2xl font-semibold font-playfair uppercase">
        login
      </h1>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <TextField
          fullWidth
          name="email"
          label="Digite seu Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        {isAdminLogin ? (
          <TextField
            fullWidth
            type="password"
            name="password"
            label="Senha do Administrador"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
        ) : (
          auth.otpSent && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium">
                Digite o código de verificação enviado para seu email.
              </p>
              <TextField
                fullWidth
                name="otp"
                label="Código de Verificação"
                value={formik.values.otp}
                onChange={formik.handleChange}
              />
            </div>
          )
        )}

        {isAdminLogin ? (
          <Button fullWidth variant="contained" type="submit" sx={{ py: 1.5 }}>
            Entrar como Admin
          </Button>
        ) : auth.otpSent ? (
          <Button fullWidth variant="contained" type="submit" sx={{ py: 1.5 }}>
            login
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            sx={{ py: 1.5 }}
            onClick={handleSentOtp}
            disabled={auth.loading}
          >
            {auth.loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "enviar código de verificação"
            )}
          </Button>
        )}
      </form>

      {!isAdminLogin && (
        <Button
          fullWidth
          variant="outlined"
          size="small"
          sx={{ py: 1.5 }}
          onClick={() => navigate("/become-seller/login")}
        >
          Fazer Login como Vendedor
        </Button>
      )}
    </div>
  );
};
