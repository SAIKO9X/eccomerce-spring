import { useEffect } from "react";
import { getWishListByUserId } from "../../state/customer/wishlistSlice";
import { useAppDispatch, useAppSelector } from "../../state/store";
import { WishlistProductCard } from "../components/products/WishlistProductCard";

export const WishlistPage = () => {
  const dispatch = useAppDispatch();
  const { wishlist } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getWishListByUserId());
  }, []);

  return (
    <section className="h-full p-5 lg:p-20">
      <div>
        <h1>
          <strong>Meus Favoritos</strong> {wishlist.products?.length}{" "}
          {wishlist.products?.length === 1 ? "produto" : "produtos"}
        </h1>

        <div className="pt-10 flex flex-wrap gap-5">
          {wishlist.products?.map((item) => (
            <WishlistProductCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};
