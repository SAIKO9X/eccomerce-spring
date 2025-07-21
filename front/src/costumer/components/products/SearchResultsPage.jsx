import { useAppSelector } from "../../../state/store";
import { ProductCard } from "./ProductCard";

export const SearchResultsPage = () => {
  const { searchProducts, loading, error } = useAppSelector(
    (state) => state.products
  );

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <section className="mt-8">
      <h1 className="text-3xl font-playfair text-center py-5">
        Resultados da Pesquisa
      </h1>
      <div className="flex flex-wrap gap-4">
        {searchProducts.length > 0 ? (
          searchProducts.map((product) => (
            <ProductCard key={product.id} item={product} />
          ))
        ) : (
          <p>Nenhum produto encontrado.</p>
        )}
      </div>
    </section>
  );
};
