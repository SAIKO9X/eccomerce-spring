import { Navbar } from "./NavBar";
import { Slider } from "./Slider";

export const Header = () => {
  return (
    <header className="h-screen">
      <Navbar />
      <div className="h-full w-full flex flex-col justify-evenly pb-10">
        <div className="flex flex-col gap-4 w-full lg:w-1/2 px-2 mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-extralight font-playfair capitalize">
            Tudo o Que Você Precisa em um Só Lugar
          </h1>
          <p className="text-center">
            Descubra produtos incríveis, preços imperdíveis e a conveniência de
            comprar online com segurança e rapidez. Bem-vindo à sua nova loja
            favorita!
          </p>
        </div>

        <div className="w-full">
          <Slider />
        </div>
      </div>
    </header>
  );
};
