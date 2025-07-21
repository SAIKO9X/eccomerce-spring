import { Favorite } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../state/store";
import { addToWishList } from "../../../state/customer/wishlistSlice";
import { formatCurrencyBRL } from "../../../utils/formatCurrencyBRL";

export const ProductCard = ({ item }) => {
  const dispatch = useAppDispatch();
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;

    if (isHovered) {
      interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % item.images.length);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
      interval = null;
    }

    return () => clearInterval(interval);
  }, [isHovered]);

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
      className="group px-4 relative"
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="card"
      >
        {item.images.map((image, index) => (
          <img
            className="card-media object-top"
            style={{
              transform: `translateX(${(index - currentImage) * 100}%)`,
            }}
            key={index}
            src={image}
            alt="product"
          />
        ))}

        {isHovered && (
          <div className="indicator flex flex-col items-center space-y-2">
            <Button
              onClick={(event) => handleWishlist(event)}
              variant="contained"
              color="secondary"
            >
              <Favorite />
            </Button>
          </div>
        )}

        {item.discountPercent > 0 && (
          <span className="bg-white px-2 py-1 absolute right-1 top-1 rounded-full text-sm font-semibold border border-zinc-100">
            {item.discountPercent}% OFF
          </span>
        )}
      </div>

      <div>
        <p className="text-sm font-medium">{item.title}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">
            {formatCurrencyBRL(item.sellingPrice)}
          </span>
          {item.discountPercent > 0 && (
            <span className="line-through text-zinc-400">
              {formatCurrencyBRL(item.basePrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
