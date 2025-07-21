import { useAppSelector } from "../../../state/store";
import { ShopByCategoryCard } from "./ShopByCategoryCard";
import { useNavigate } from "react-router-dom";

export const ShopByCategory = () => {
  const { home } = useAppSelector((state) => state);
  const navigate = useNavigate();

  const displayedCategories = home.homePageData?.shopCategories.slice(0, 6);

  return (
    <section className="flex flex-col gap-5 pb-10 lg:pb-30 sm:px-10 px-4">
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center items-start gap-5">
        <h2 className="text-4xl font-playfair capitalize">
          Compre por Categorias
        </h2>
        <span
          className="border border-black/60 px-4 py-2 rounded-full text-sm capitalize cursor-pointer hover:bg-black/10 transition-all duration-300"
          onClick={() => navigate("/categories-list")}
        >
          veja todos
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {displayedCategories?.map((item) => (
          <ShopByCategoryCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};
