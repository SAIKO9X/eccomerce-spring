import { SimilarProductsCard } from "./SimilarProductsCard";

export const SimilarProducts = ({ similarProducts }) => {
  return (
    <section className="grid gap-4 gap-y-8 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
      {similarProducts && similarProducts.length > 0 ? (
        similarProducts.map((product, index) => (
          <SimilarProductsCard key={index} item={product} />
        ))
      ) : (
        <div className="w-full">
          <p className="text-sm font-medium text-zinc-400">
            Nenhum produto similar encontrado
          </p>
        </div>
      )}
    </section>
  );
};
