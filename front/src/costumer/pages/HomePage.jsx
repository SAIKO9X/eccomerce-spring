import { Header } from "../components/header/Header";
import { Deal } from "../components/deal/Deal";
import { Footer } from "../components/footer/Footer";
import { ShopByCategory } from "../components/categories/ShopByCategory";

export const HomePage = () => {
  return (
    <>
      <Header />
      <Deal />
      <ShopByCategory />
      <Footer />
    </>
  );
};
