import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ReviewForm } from "../details/ReviewForm";
import { getProductById } from "../../../state/customer/productSlice";
import { useAppDispatch, useAppSelector } from "../../../state/store";

export const CreateReviewPage = () => {
  const { productId } = useParams();
  const dispatch = useAppDispatch();
  const { product, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProductById(Number(productId)));
  }, [dispatch, productId]);

  if (loading) return <div>Carregando dados do produto...</div>;
  if (error) return <div>Erro ao carregar dados do produto: {error}</div>;
  if (!product) return <div>Produto não encontrado</div>;

  return (
    <section className="p-5 xl:px-20">
      <h2 className="text-2xl font-medium mb-4">Escreva sua Avaliação</h2>

      <div className="mb-6 flex flex-col items-center justify-center gap-4">
        <img
          className="w-24 h-24 rounded-md object-contain object-center"
          src={product.images[0]}
          alt={product.title}
        />
        <div className="flex flex-col items-center justify-center">
          <h3 className="font-medium text-lg">{product.title}</h3>
          <p className="text-sm text-zinc-500">
            {product.seller?.businessDetails?.businessName}
          </p>
        </div>
      </div>

      <ReviewForm productId={productId} />
    </section>
  );
};
