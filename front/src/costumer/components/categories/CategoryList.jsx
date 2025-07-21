import { useAppSelector } from "../../../state/store";
import { ShopByCategoryCard } from "./ShopByCategoryCard";

export const CategoriesList = () => {
  const { home } = useAppSelector((state) => state);

  return (
    <section className="flex flex-col gap-5 pb-10 lg:pb-30 sm:px-10 px-4">
      <h2 className="text-4xl font-playfair capitalize text-center pt-10">
        Categorias Disponiveis
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {home.homePageData?.shopCategories.map((item) => (
          <ShopByCategoryCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};
