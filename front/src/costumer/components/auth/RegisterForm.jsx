import { useFormik } from "formik";
import { sendLoginRegisterOtp, register } from "../../../state/authSlice";
import { Button, TextField, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../state/store";

export const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { auth } = useAppSelector((store) => store);

  const validationSchema = Yup.object({
    email: Yup.string().email("Email inválido").required("Email é obrigatório"),
    otp: Yup.string().when([], {
      is: () => auth.otpSent,
      then: (schema) => schema.required("Código OTP é obrigatório"),
      otherwise: (schema) => schema.notRequired(),
    }),
    fullName: Yup.string().required("Nome é obrigatório"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
      fullName: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const resultAction = await dispatch(register(values)).unwrap();
        if (resultAction) {
          navigate("/");
        }
      } catch (error) {
        console.error("Erro ao registrar:", error);
        const errorMessage =
          error.message || "Erro ao criar conta. Tente novamente.";
        alert(errorMessage);
      }
    },
  });

  const handleSentOtp = () => {
    formik.validateField("email").then((error) => {
      if (!error) {
        dispatch(
          sendLoginRegisterOtp({
            email: formik.values.email,
            role: "ROLE_CUSTOMER",
          })
        );
      }
    });
  };

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold font-playfair uppercase">
        registrar
      </h1>

      <div className="flex flex-col gap-4 w-full">
        <TextField
          fullWidth
          size="small"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        {auth.otpSent && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <p className="text-xs text-gray-500 font-medium">
                Digite o código de verificação enviado para seu email.
              </p>
              <TextField
                fullWidth
                size="small"
                name="otp"
                label="Código de Verificação"
                value={formik.values.otp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.otp && Boolean(formik.errors.otp)}
                helperText={formik.touched.otp && formik.errors.otp}
              />
            </div>

            <TextField
              fullWidth
              size="small"
              name="fullName"
              label="Digite seu nome"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
            />
          </div>
        )}

        {!auth.otpSent && (
          <Button
            fullWidth
            variant="contained"
            sx={{ py: 1.5 }}
            onClick={handleSentOtp}
            disabled={auth.loading}
          >
            {auth.loading ? (
              <CircularProgress color="secondary" size={24} />
            ) : (
              "Enviar Código de Verificação"
            )}
          </Button>
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{ py: 1.5 }}
          onClick={() => formik.handleSubmit()}
          disabled={!auth.otpSent}
        >
          Criar Conta
        </Button>
      </div>
    </div>
  );
};
