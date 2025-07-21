import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { useAppDispatch } from "../../../state/store";
import { verifySellerEmail } from "../../../state/seller/sellerAuthSlice";

export const VerifySellerEmailPage = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleVerify = async () => {
    try {
      await dispatch(verifySellerEmail(otp)).unwrap();
      navigate("/seller-login");
    } catch (error) {
      console.error("Erro ao verificar OTP:", error);
      alert("Código OTP inválido ou expirado. Tente novamente.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10">
      <h2 className="text-2xl font-playfair mb-6">Verifique seu Email</h2>
      <TextField
        label="Código OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        fullWidth
        variant="outlined"
        className="mb-4"
      />
      <Button onClick={handleVerify} variant="contained" fullWidth>
        Verificar
      </Button>
    </div>
  );
};
