import {
  Box,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FilterSection } from "../components/products/FilterSection";
import { ProductCard } from "../components/products/ProductCard";
import { Tune } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../state/store";
import { getAllProducts } from "../../state/customer/productSlice";

export const ProductPage = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [sort, setSort] = useState();
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const { category } = useParams();
  const { products } = useAppSelector((state) => state.products);

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handlePageChange = (value) => {
    setPage(value);
  };

  useEffect(() => {
    const [minPrice, maxPrice] =
      searchParams.get("sellingPrice")?.split("-") || [];

    const minDiscount = searchParams.get("discount")
      ? Number(searchParams.get("discount"))
      : undefined;

    const pageNumber = page - 1;

    const colors = searchParams.getAll("color");

    const newFilter = {
      category,
      colors: colors.length > 0 ? colors.join(",") : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minDiscount,
      pageNumber,
    };

    dispatch(getAllProducts(newFilter));
  }, [dispatch, category, searchParams, page]);

  const categoryName =
    Array.isArray(products) && products.length > 0
      ? products[0]?.category?.name
      : category || "Seção";

  return (
    <section className="mt-5 -z-50">
      <div className="py-5">
        <h1 className="text-3xl capitalize font-playfair text-center">
          Seção {categoryName}
        </h1>
      </div>

      <div className="lg:flex">
        <aside className="filter-style hidden xl:block lg:w-[20%] 2xl:w-[15%]">
          <FilterSection />
        </aside>

        <div className="w-full lg:w-[80%] space-y-5">
          <div className="flex justify-between px-9 h-10">
            <div className="relative w-[50%]">
              {!isLarge && (
                <IconButton>
                  <Tune />
                </IconButton>
              )}

              {!isLarge && (
                <Box>
                  <FilterSection />
                </Box>
              )}
            </div>

            <FormControl size="small" sx={{ width: 200 }}>
              <InputLabel id="demo-simple-select-label">Organizar</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sort || ""}
                label="Organizar"
                onChange={handleSortChange}
              >
                <MenuItem value={"price_low"}>Preço : Baixo - Alto</MenuItem>
                <MenuItem value={"price_high"}>Preço : Alto - Baixo</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </div>

          <Divider />

          <section className="products-style grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-center pt-4">
            {Array.isArray(products) && products.length > 0 ? (
              products.map((item, index) => (
                <ProductCard key={index} item={item} />
              ))
            ) : (
              <p>Nenhum produto encontrado</p>
            )}
          </section>

          <Pagination
            onChange={(e, value) => handlePageChange(value)}
            count={10}
            shape="rounded"
            className="flex justify-center py-10"
          />
        </div>
      </div>
    </section>
  );
};
