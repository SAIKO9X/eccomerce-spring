import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SellerAccountForm } from "../components/becomeSeller/SellerAccountForm";
import { SellerLoginForm } from "../components/becomeSeller/SellerLoginForm";
import { Button } from "@mui/material";

export const BecomeSellerPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.includes("/login")) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [location.pathname]);

  const handleShowPage = () => {
    const newPath = isLogin ? "/become-seller" : "/become-seller/login";
    navigate(newPath);
  };

  return (
    <section className="grid md:gap-10 grid-cols-3 min-h-screen">
      <div className="lg:col-span-1 md:col-span-2 col-span-3 p-10 rounded-b-md shadow-md flex flex-col h-full">
        <div className="flex-grow flex items-center">
          <div className="w-full">
            {!isLogin ? <SellerAccountForm /> : <SellerLoginForm />}
          </div>
        </div>

        <div className="mt-12 flex-shrink-0">
          {!isLogin ? (
            <div className="flex flex-col items-center justify-center gap-2 uppercase">
              Já tenho uma conta
              <Button onClick={handleShowPage} variant="outlined">
                fazer login
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 uppercase">
              não tenho uma conta
              <Button onClick={handleShowPage} variant="outlined">
                criar conta
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:col-span-1 lg:col-span-2 md:flex justify-center items-center">
        <div className="lg:w-[70%] px-5 space-y-10">
          <div className="space-y-2 text-center">
            <p className="text-2xl font-playfair">
              Entre na Revolução do Mercado
            </p>
            <p className="uppercase">Aumente suas Vendas</p>
          </div>
          <img
            className="rounded-md"
            src="https://pictures.autods.com/OfficialSite/New/20231030162905/online-seller.png"
            alt="Seller Image"
          />
        </div>
      </div>
    </section>
  );
};
