import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../state/store";
import { ReviewCard } from "../components/details/ReviewCard";
import { getUserReviews } from "../../state/customer/reviewSlice";

export const ReviewPage = () => {
  const dispatch = useAppDispatch();
  const { reviews, loading, error } = useAppSelector((state) => state.reviews);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getUserReviews(user.id));
    }
  }, [dispatch, user]);

  if (loading) return <div>Carregando reviews...</div>;
  if (error) return <div>Erro ao carregar reviews: {error}</div>;
  if (reviews.length === 0)
    return <div>Você ainda não fez nenhuma avaliação.</div>;

  return (
    <section className="p-5 xl:px-20">
      <h2 className="text-2xl font-medium mb-4">Suas Avaliações</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
};
