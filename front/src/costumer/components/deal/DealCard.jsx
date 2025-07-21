import { ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const DealCard = ({ item }) => {
  const navigate = useNavigate();
  const isCategoryDeal = item.dealType === "CATEGORY";

  const image = isCategoryDeal ? item.dealImage : item.product?.images?.[0];
  const name = isCategoryDeal ? item.dealName : item.product?.title;
  const discountText = isCategoryDeal
    ? `descontos de até ${item.discount}% OFF`
    : `${item.productDiscountPercent}% OFF`;

  const handleClick = () => {
    if (isCategoryDeal) {
      navigate(`/products/${item.category.categoryId}`);
    } else {
      const productName = item.product.title.toLowerCase().replace(/\s+/g, "-");
      navigate(
        `/product-details/${item.product.category.categoryId}/${productName}/${item.product.id}`
      );
    }
  };

  return (
    <div
      className="w-80 h-96 flex flex-col justify-between mx-auto cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-full w-full">
        <img
          className="h-full w-full object-cover rounded-2xl"
          src={image}
          alt={isCategoryDeal ? "Deal Image" : "Product Image"}
        />

        {!isCategoryDeal && (
          <span className="absolute top-2 right-2 bg-white px-4 py-2 text-sm rounded-full">
            {item.productDiscountPercent}% OFF
          </span>
        )}

        <div className="bg-white px-4 py-2 rounded-xl w-[90%] absolute bottom-4 left-1/2 transform -translate-x-1/2 deal-card-text">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <p className="text-sm font-medium">{name}</p>
              <div className="text-sm flex items-center gap-2">
                {isCategoryDeal ? (
                  <span className="text-zinc-400">{discountText}</span>
                ) : (
                  <>
                    <span className="font-medium">
                      {item.discountedPrice} R$
                    </span>
                    <span className="text-zinc-400 line-through">
                      {item.originalPrice} R$
                    </span>
                  </>
                )}
              </div>
            </div>

            <span className="bg-zinc-100 p-2 rounded-full flex items-center justify-center">
              <ArrowForwardIos fontSize="small" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
