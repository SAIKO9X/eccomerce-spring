import {
  Star,
  VerifiedUser,
  LocalShipping,
  CurrencyExchange,
  Remove,
  Add,
  FavoriteBorder,
} from "@mui/icons-material";
import { Button, Divider, IconButton, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { SimilarProducts } from "../components/details/SimilarProducts";
import { useParams } from "react-router-dom";
import { formatCurrencyBRL } from "../../utils/formatCurrencyBRL";
import { addToWishList } from "../../state/customer/wishlistSlice";
import {
  getProductById,
  getSimilarProducts,
} from "../../state/customer/productSlice";
import { addItemToCart, findUserCart } from "../../state/customer/cartSlice";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../utils/useAlert";
import { useAppDispatch, useAppSelector } from "../../state/store";
import { getReviewsByProductId } from "../../state/customer/reviewSlice";
import { ReviewList } from "../components/details/ReviewList";
import { ReviewForm } from "../components/details/ReviewForm";

export const DetailsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();
  const { product, similarProducts, loading, error } = useAppSelector(
    (state) => state.products
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const { showAlert, AlertComponent } = useAlert();

  useEffect(() => {
    dispatch(getProductById(Number(productId)));
    dispatch(getSimilarProducts(Number(productId)));
    dispatch(getReviewsByProductId(Number(productId)));
  }, [dispatch, productId]);

  const handleWishlist = () => {
    dispatch(addToWishList(productId));
  };

  const handleActiveImage = (value) => {
    setActiveImage(value);
  };

  const handleBuyNow = () => {
    if (!selectedColor || !selectedSize) {
      showAlert("Selecione cor e tamanho antes de comprar!", "info");
      return;
    }

    const requestData = {
      productId: productId,
      size: selectedSize,
      quantity: quantity,
    };

    dispatch(addItemToCart({ request: requestData }))
      .unwrap()
      .then(() => {
        navigate("/cart");
      })
      .catch((error) => {
        showAlert(error || "Erro ao comprar item.", "error");
      });
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      showAlert(
        "Selecione cor e tamanho antes de adicionar ao carrinho!",
        "info"
      );
      return;
    }

    const requestData = {
      productId: productId,
      size: selectedSize,
      quantity: quantity,
    };

    dispatch(addItemToCart({ request: requestData }))
      .unwrap()
      .then(() => {
        const jwt = localStorage.getItem("jwt");
        dispatch(findUserCart(jwt));
        showAlert("Item adicionado ao carrinho.", "success");
      })
      .catch((error) => {
        showAlert(error || "Erro ao adicionar item ao carrinho.", "error");
      });
  };

  if (loading) return <div>Carregando produto...</div>;
  if (error) return <div>Erro ao carregar produto: {error}</div>;
  if (!product) return <div>Produto não encontrado</div>;

  const averageRatingFormatted =
    product.averageRating && typeof product.averageRating === "number"
      ? product.averageRating.toFixed(1)
      : "0.0";

  return (
    <section className="px-5 xl:px-20 pt-10">
      {AlertComponent()}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="flex flex-col-reverse lg:flex-row gap-5">
          <div className="flex flex-row lg:flex-col gap-3">
            {product?.images?.map((item, index) => (
              <img
                className={`w-28 h-28 rounded-md object-contain bg-white cursor-pointer border ${
                  activeImage === index
                    ? "border-black/20 p-1"
                    : "border-transparent"
                }`}
                src={item}
                alt="Miniatura do Produto"
                key={index}
                onClick={() => handleActiveImage(index)}
              />
            ))}
          </div>

          <div className="relative w-full">
            <img
              className="w-full h-[750px] rounded-md object-contain bg-white"
              src={product?.images?.[activeImage]}
              alt="Imagem do Produto"
            />

            <div className="absolute top-0 right-0">
              <IconButton onClick={handleWishlist} color="error">
                <FavoriteBorder />
              </IconButton>
            </div>
          </div>
        </div>

        <div>
          <h1 className="font-semibold font-playfair text-lg capitalize">
            {product?.seller?.businessDetails?.businessName}
          </h1>
          <p className="text-zinc-400">{product?.title}</p>
          <p className="pb-4 pt-2 text-sm text-zinc-400">
            {product?.description}
          </p>
          <div className="flex gap-2 items-center mt-2">
            <div className="flex items-center gap-1">
              <span className="text-sm">{averageRatingFormatted}</span>
              <Star sx={{ fontSize: 16 }} />
            </div>

            <Divider orientation="vertical" flexItem />

            <p className="text-sm">{product.totalReviews || 0} avaliações</p>
          </div>
          <div className="flex items-center gap-2 mt-4 text-lg">
            <span className="font-medium">
              {formatCurrencyBRL(product?.sellingPrice)}{" "}
              {/* Preço com desconto */}
            </span>
            {product?.discountPercent > 0 && (
              <span className="line-through text-zinc-400">
                {formatCurrencyBRL(product?.basePrice)}{" "}
                {/* Preço original tachado */}
              </span>
            )}
            {product?.discountPercent > 0 && (
              <span className="font-semibold text-sm">
                {product?.discountPercent}% OFF
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 py-6">
            <div>
              <Select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                displayEmpty
                fullWidth
                size="small"
              >
                <MenuItem value="" disabled>
                  Selecione uma cor
                </MenuItem>
                {product?.colors?.map((color, index) => (
                  <MenuItem key={index} value={color}>
                    {color}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div>
              <Select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                displayEmpty
                fullWidth
                size="small"
              >
                <MenuItem value="" disabled>
                  Selecione um tamanho
                </MenuItem>
                {product?.sizes?.map((size, index) => (
                  <MenuItem key={index} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
          <p className="text-sm mt-2">
            Incluindo todos os impostos. Frete grátis acima de 100R$
          </p>
          <div className="mt-7 space-y-3">
            <div className="flex items-center gap-2">
              <VerifiedUser sx={{ fontSize: 24 }} />
              <p className="leading-none text-sm">
                Autenticidade e Qualidade Asseguradas.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <CurrencyExchange sx={{ fontSize: 24 }} />
              <p className="leading-none text-sm">
                100% de retorno de dinheiro em até 30 dias.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <LocalShipping sx={{ fontSize: 24 }} />
              <p className="leading-none text-sm">Frete e devoluções grátis.</p>
            </div>

            <div className="flex flex-col gap-2 mt-7">
              <p>Quantidade:</p>

              <div className="flex items-center gap-2 w-42 justify-between">
                <Button
                  size="small"
                  disabled={quantity === 1}
                  variant="outlined"
                  onClick={() => setQuantity(quantity - 1)}
                >
                  <Remove sx={{ fontSize: 16 }} />
                </Button>
                <span className="font-medium text-lg">{quantity}</span>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Add sx={{ fontSize: 16 }} />
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-12 flex items-center gap-5">
            <Button
              size="small"
              variant="contained"
              className="w-full"
              onClick={handleAddToCart}
            >
              add carrinho
            </Button>

            <Button
              size="small"
              variant="outlined"
              className="w-full"
              onClick={handleBuyNow}
            >
              comprar agora
            </Button>
          </div>
          <div className="mt-7">
            <ReviewList productId={productId} />
            <div className="mt-4">
              <h3 className="font-medium text-lg">Escreva sua avaliação</h3>
              <ReviewForm productId={productId} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20 flex flex-col sm:items-start items-center">
        <h2 className="font-playfair text-2xl pb-4">Produtos Similares</h2>
        <SimilarProducts similarProducts={similarProducts} />
      </div>
    </section>
  );
};
