import { useNavigate } from "react-router-dom";
import { formatCurrencyBRL } from "../../../utils/formatCurrencyBRL";

export const SimilarProductsCard = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const productName = item.title.toLowerCase().replace(/\s+/g, "-");
    navigate(
      `/product-details/${item.category.categoryId}/${productName}/${item.id}`
    );
  };

  return (
    <div className="group cursor-pointer" onClick={handleClick}>
      <div className="card">
        <img
          className="card-media object-top w-full h-64 object-cover rounded-t-md"
          src={item.images[0]}
          alt={item.title}
        />
      </div>

      <div className="p-2">
        <p className="text-sm font-medium truncate">{item.title}</p>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>{formatCurrencyBRL(item.sellingPrice)}</span>
          {item.discountPercent > 0 && (
            <span className="text-zinc-400 line-through">
              {formatCurrencyBRL(item.basePrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
