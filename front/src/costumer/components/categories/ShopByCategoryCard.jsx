import { useNavigate } from "react-router-dom";

export const ShopByCategoryCard = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${item.categoryId}`);
  };

  return (
    <div
      className="relative w-full h-[450px] cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={item.image}
        alt="Categoria de produtos"
        className="w-full h-full object-cover rounded-xl"
      />

      <div className="absolute bottom-4 left-2 flex flex-col gap-4">
        <p className="uppercase text-white text-2xl font-semibold tracking-widest">
          {item.name}
        </p>
        <span className="bg-white rounded-full px-8 py-2 text-sm font-medium text-center">
          {item.textButton}
        </span>
      </div>
    </div>
  );
};
