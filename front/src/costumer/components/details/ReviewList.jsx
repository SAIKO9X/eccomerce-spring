import { useAppSelector } from "../../../state/store";
import { ReviewCard } from "./ReviewCard";

export const ReviewList = ({ productId }) => {
  const { reviews, loading, error } = useAppSelector((state) => state.reviews);

  if (loading) return <div>Carregando avaliações...</div>;
  if (error) {
    console.log("Objeto de erro:", error);
    return (
      <div>
        Erro ao carregar avaliações: {error.message || "Erro desconhecido"}
      </div>
    );
  }
  if (reviews.length === 0) return <div>Nenhuma avaliação disponível.</div>;

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} productId={productId} />
      ))}
    </div>
  );
};
