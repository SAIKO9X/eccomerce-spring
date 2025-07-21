import { useAppSelector } from "../../state/store";
import { ShopByCategoryTable } from "../component/categories/ShopByCategoryTable";

export const ShopByCategoryPage = () => {
  const { home } = useAppSelector((state) => state);

  console.log("home", home);

  return (
    <div>
      <h1 className="py-10 font-playfair font-medium text-2xl text-center">
        Gerenciar Categorias da Home
      </h1>
      <ShopByCategoryTable data={home.homePageData?.shopCategories} />
    </div>
  );
};
