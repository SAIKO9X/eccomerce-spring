import { Button, CircularProgress, TextField } from "@mui/material";
import { useFormik } from "formik";
import { sendLoginRegisterOtp } from "../../../state/authSlice";
import { sellerLogin } from "../../../state/seller/sellerAuthSlice";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import { useNavigate } from "react-router-dom";

export const SellerLoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector((store) => store);

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },
    onSubmit: async (values) => {
      console.log("become seller login", values);
      const resultAction = await dispatch(sellerLogin(values));
      if (sellerLogin.fulfilled.match(resultAction)) {
        navigate("/seller");
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

  return (
    <div>
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

        {!auth.otpSent ? (
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
        ) : (
          <Button
            fullWidth
            variant="contained"
            sx={{ py: 1.5 }}
            onClick={() => formik.handleSubmit()}
            disabled={auth.loading}
          >
            {auth.loading ? (
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
