import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../state/store";

export const CategorySheet = ({ selectedCategory }) => {
  const navigate = useNavigate();
  const { categories } = useAppSelector((state) => state.categories);

  const levelTwoCategories = categories.filter(
    (cat) =>
      cat.level === 2 && cat.parentCategory?.categoryId === selectedCategory
  );

  const childCategory = (parentCategoryId) => {
    return categories.filter(
      (child) =>
        child.level === 3 && child.parentCategory?.id === parentCategoryId
    );
  };

  return (
    <Box className="bg-white shadow-lg lg:h-[500px] overflow-y-auto rounded-b-lg">
      <div className="flex flex-wrap justify-between h-full">
        {levelTwoCategories.map((item, index) => (
          <div
            className={`p-8 lg:w-1/5 ${
              index % 2 === 0 ? "bg-white" : "bg-zinc-100"
            }`}
            key={item.id}
          >
            <p className="font-semibold font-playfair mb-4">{item.name}</p>
            <ul className="space-y-3">
              {childCategory(item.id).length > 0 ? (
                childCategory(item.id).map((subItem) => (
                  <li
                    key={subItem.id}
                    className="hover:text-black text-zinc-400 cursor-pointer text-sm"
                    onClick={() => {
                      navigate(`/products/${subItem.categoryId}`);
                    }}
                  >
                    {subItem.name}
                  </li>
                ))
              ) : (
                <li className="text-zinc-400 italic">Sem subcategorias</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </Box>
  );
};
