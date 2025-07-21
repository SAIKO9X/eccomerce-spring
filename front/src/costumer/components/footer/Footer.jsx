import { useMediaQuery, useTheme } from "@mui/material";
import FooterImage from "../../../assets/footer.jpg";
import { ArrowOutward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const Footer = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <footer className="bg-black text-white relative flex flex-col items-center w-full h-screen">
      <div className="w-full h-full sm:h-[70vh] lg:h-[80vh] relative">
        <img
          src={FooterImage}
          alt="Torne Se Vendedor"
          className="w-full h-full object-cover rounded-b-[3rem] sm:rounded-b-[4rem]"
        />
      </div>

      <div className="absolute top-4 lg:left-1/2 lg:transform lg:-translate-x-1/2 text-center flex flex-col gap-4 justify-center items-center">
        <h2 className="text-2xl lg:text-4xl font-playfair capitalize w-full">
          comece a vender seus produtos com a ecommerce
        </h2>

        <button
          onClick={() => navigate("/become-seller")}
          className="bg-white/40 border border-white pl-4 pr-1 py-1 rounded-full font-playfair flex items-center gap-10 cursor-pointer"
        >
          Torne-se Vendedor
          <span className="bg-black text-white p-2 rounded-full flex items-center justify-center">
            <ArrowOutward />
          </span>
        </button>
      </div>

      <div className="flex flex-col gap-8 sm:gap-12 py-10 w-[90%] sm:w-[80%] md:w-[70%]">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-0">
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-6 uppercase text-sm">
            <p className="cursor-pointer">home</p>
            <p className="cursor-pointer">sobre</p>
            <p className="cursor-pointer">serviços</p>
            <p className="cursor-pointer">contatos</p>
          </div>

          <h1 className="cursor-pointer text-2xl sm:text-3xl font-semibold font-playfair uppercase">
            {isLarge ? "ecommerce" : "eco"}
          </h1>

          <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-5 uppercase text-sm">
            <p className="cursor-pointer">criar conta</p>
            <p className="cursor-pointer">fazer login</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center text-white/30 text-xs sm:text-sm text-center">
          <p>Copyright © 2025</p>
          <span className="hidden sm:flex flex-1 h-0.5 mx-4 bg-white/30"></span>
          <p>Feito Por Carlos Aleixo</p>
        </div>
      </div>
    </footer>
  );
};
