import { ProductTable } from "../components/products/ProductTable";

export const ProductsPage = () => {
  return (
    <div>
      <h1 className="capitalize font-medium font-playfair text-lg pb-4">
        produtos cadastrados
      </h1>
      <ProductTable />
    </div>
  );
};
