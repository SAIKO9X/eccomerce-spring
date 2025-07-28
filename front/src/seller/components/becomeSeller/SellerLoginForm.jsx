// SellerLoginForm.jsx - CORRIGIDO
import { Button, CircularProgress, TextField } from "@mui/material";
import { useFormik } from "formik";
import { sendLoginRegisterOtp } from "../../../state/authSlice";
import { sellerLogin } from "../../../state/seller/sellerAuthSlice";
import { useAppSelector, useAppDispatch } from "../../../state/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const SellerLoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { auth, sellerAuth } = useAppSelector((store) => store);

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },
    onSubmit: async (values) => {
      console.log("become seller login", values);
      try {
        const result = await dispatch(sellerLogin(values)).unwrap();
        console.log("Login successful:", result);
        // O redirecionamento será feito pelo useEffect no App.jsx
      } catch (error) {
        console.error("Login error:", error);
      }
    },
  });

  const handleSentOtp = () => {
    dispatch(
      sendLoginRegisterOtp({
        email: formik.values.email,
        role: "ROLE_SELLER",
      })
    );
  };

  // Redirecionamento adicional como backup
  useEffect(() => {
    if (auth.isLoggedIn && auth.role === "ROLE_SELLER") {
      console.log("Redirecting to seller dashboard...");
      navigate("/seller");
    }
  }, [auth.isLoggedIn, auth.role, navigate]);

  return (
    <div className="flex flex-col justify-center h-full">
      <p className="text-lg font-playfair font-medium text-center pb-6">
        Faça Login como Vendedor
      </p>

      <div className="flex flex-col gap-4">
        <TextField
          fullWidth
          name="email"
          label="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        {auth.otpSent && (
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
              onBlur={formik.handleBlur}
              error={formik.touched.otp && Boolean(formik.errors.otp)}
              helperText={formik.touched.otp && formik.errors.otp}
            />
          </div>
        )}

        {/* Mostrar erro se existir */}
        {(auth.error || sellerAuth?.error) && (
          <p className="text-red-500 text-sm">
            {auth.error || sellerAuth?.error}
          </p>
        )}

        {!auth.otpSent ? (
          <Button
            fullWidth
            variant="contained"
            sx={{ py: 1.5 }}
            onClick={handleSentOtp}
            disabled={auth.loading || !formik.values.email}
          >
            {auth.loading ? (
              <CircularProgress color="secondary" size={24} />
            ) : (
              "Enviar Código de Verificação"
            )}
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            sx={{ py: 1.5 }}
            onClick={() => formik.handleSubmit()}
            disabled={
              auth.loading ||
              (sellerAuth && sellerAuth.loading) ||
              !formik.values.otp
            }
          >
            {auth.loading || (sellerAuth && sellerAuth.loading) ? (
              <CircularProgress color="secondary" size={24} />
            ) : (
              "Login"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
