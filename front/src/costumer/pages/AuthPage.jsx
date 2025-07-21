import { useState } from "react";
import { Button } from "@mui/material";
import { KeyboardArrowLeft } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";
import { RegisterForm } from "../components/auth/RegisterForm";

export const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <section className="h-screen w-full p-2">
      <div className="flex h-full w-full items-center justify-between">
        <div className="w-1/2 h-full rounded-lg relative hidden md:block">
          <Button
            size="small"
            variant="contained"
            sx={{ position: "absolute", top: "10px", left: "10px" }}
            startIcon={<KeyboardArrowLeft />}
            onClick={() => navigate("/")}
          >
            home
          </Button>

          <div className="absolute left-1/2 top-10 transform -translate-x-1/2 flex flex-col items-center gap-2 w-full xl:w-1/2">
            <h1 className="text-lg md:text-2xl font-semibold font-playfair text-primary uppercase">
              ecommerce
            </h1>
            <p className="text-gray-600 text-center">
              O lugar perfeito para encontrar tudo o que você precisa, com
              segurança, praticidade e as melhores ofertas.
            </p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1603400521630-9f2de124b33b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="background login form image"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center gap-5">
          <div className="flex flex-col items-center justify-center gap-1">
            <h2 className="text-2xl font-semibold font-playfair">
              {isLogin
                ? "Acesse sua conta e continue sua jornada!"
                : "Entre para uma nova experiência!"}
            </h2>
            <p className="text-center text-zinc-400">
              {isLogin
                ? "A melhor maneira de alcançar seus objetivos começa aqui."
                : "Conecte-se e descubra novas possibilidades."}
            </p>
          </div>

          <div className="pt-10 w-full xl:w-1/2 px-10 xl:px-0">
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </div>

          <div className="flex flex-col items-center gap-2">
            <p>{isLogin ? "não tem " : "Já tenho"} uma conta</p>

            <Button size="small" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Criar Conta" : "Fazer Login"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
