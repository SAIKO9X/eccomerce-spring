import { Close } from "@mui/icons-material";
import { useAppDispatch } from "../../../state/store";
import { addToWishList } from "../../../state/customer/wishlistSlice";
import { useNavigate } from "react-router-dom";

export const WishlistProductCard = ({ item }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleWishlist = (event) => {
    event.stopPropagation();
    item.id && dispatch(addToWishList(item.id));
  };

  return (
    <div
      onClick={() =>
        navigate(
          `/product-details/${item.category.categoryId}/${item.title}/${item.id}`
        )
      }
      className="w-60 relative cursor-pointer"
    >
      <div className="w-full">
        <img
          src={item.images[0]}
          className="object-top w-full"
          alt="Imagem do produto"
        />
      </div>
      <div className="pt-4 space-y-2">
        <p className="text-sm font-medium">{item.title}</p>
        <p className="text-xs text-zinc-400">{item.description}</p>
        <div className="flex item-center gap-2 text-sm font-medium">
          <span>{item.sellingPrice} R$</span>
          <span className="text-zinc-400 line-through">
            {item.basePrice | 0} R$
          </span>
        </div>
      </div>

      <div className="absolute top-0 right-0 ">
        <button
          onClick={(event) => handleWishlist(event)}
          className="bg-red-500 text-white rounded-full p-1 cursor-pointer"
        >
          <Close />
        </button>
      </div>
    </div>
  );
};
