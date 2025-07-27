import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SellerAccountForm } from "../components/becomeSeller/SellerAccountForm";
import { SellerLoginForm } from "../components/becomeSeller/SellerLoginForm";

export const BecomeSellerPage = () => {
  const [isLogin, setIsLogin] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/become-seller/login") {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [location.pathname]);

  const togglePanel = () => {
    const newPath = isLogin ? "/become-seller" : "/become-seller/login";
    navigate(newPath);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative w-full max-w-4xl mx-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            {isLogin ? <SellerLoginForm /> : <SellerAccountForm />}

            <div className="mt-4 text-center">
              <span
                onClick={togglePanel}
                className="text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium"
              >
                {isLogin
                  ? "Ainda não tem uma conta? Crie uma"
                  : "Já tem uma conta? Faça Login"}
              </span>
            </div>
          </div>

          <div className="hidden lg:block bg-gray-200 p-8">
            <h2 className="text-2xl font-bold text-center">Junte-se a Nós</h2>
            <p className="text-center mt-2">
              Venda os seus produtos na nossa plataforma e alcance mais
              clientes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
