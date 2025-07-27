import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useAppDispatch } from "../../../state/store";
import { verifySellerEmail } from "../../../state/seller/sellerAuthSlice";

export const VerifySellerEmailPage = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      await dispatch(verifySellerEmail(otp)).unwrap();
      setIsVerified(true);
    } catch (error) {
      console.error("Erro ao verificar OTP:", error);
      alert("Código OTP inválido ou expirado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const goToLogin = () => {
    navigate("/become-seller/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 text-center">
      {isVerified ? (
        <div>
          <CheckCircleIcon color="success" style={{ fontSize: 60 }} />
          <h2 className="text-2xl font-playfair my-4">
            E-mail Verificado com Sucesso!
          </h2>
          <p className="mb-6 text-center">
            Sua conta foi ativada. Agora você já pode fazer login e começar a
            configurar sua loja.
          </p>
          <Button onClick={goToLogin} variant="contained" fullWidth>
            Ir para Login
          </Button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-playfair mb-4">Verifique seu Email</h2>
          <p className="mb-6 text-center">
            Enviamos um código de verificação para o seu e-mail. Por favor,
            insira o código abaixo para ativar sua conta de vendedor.
          </p>

          <div className="flex flex-col gap-4">
            <TextField
              label="Código de Verificação"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              fullWidth
              variant="outlined"
              className="mb-4"
              disabled={isLoading}
            />

            <Button
              onClick={handleVerify}
              variant="contained"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Verificar"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
