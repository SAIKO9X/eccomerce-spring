import { Add, Remove } from "@mui/icons-material";
import { Button, Checkbox, IconButton } from "@mui/material";
import { useAppDispatch } from "../../../state/store";
import { updateCartItem } from "../../../state/customer/cartSlice";

export const CartItem = ({ item, isSelected, onSelect }) => {
  const dispatch = useAppDispatch();

  const handleUpdateQuantity = (value) => () => {
    dispatch(
      updateCartItem({
        jwt: localStorage.getItem("jwt"),
        cartItemId: item.id,
        cartItem: { quantity: item.quantity + value },
      })
    );
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 relative">
        <div className="absolute md:relative top-0 left-0">
          <Checkbox
            checked={isSelected}
            onChange={onSelect}
            inputProps={{ "aria-label": "checkbox" }}
          />
        </div>
        <img
          className="w-28 md:h-28 rounded-md object-cover object-center"
          src={item.product?.images[0]}
          alt="Imagem do Produto"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between w-full">
        <div className="flex flex-col text-sm sm:gap-0 gap-1">
          <h2 className="font-semibold font-playfair text-base md:text-lg capitalize">
            {item.product?.title}
          </h2>
          <p className="text-zinc-600 text-sm md:text-base">
            {item.product?.description}
          </p>
          <p className="text-zinc-400 capitalize">
            Vendido Por: {item.product?.seller?.businessDetails.businessName}
          </p>
          <p>
            Troca dentro de 7 dias <span>disponível</span>
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-normal md:gap-4 lg:gap-20">
          <div className="flex sm:flex-col gap-2 items-center justify-center">
            <div className="border border-black/10 rounded-md flex items-center gap-2 max-sm:order-3">
              <IconButton
                size="small"
                disabled={item.quantity <= 1}
                onClick={handleUpdateQuantity(-1)}
              >
                <Remove sx={{ fontSize: 16 }} />
              </IconButton>

              <span className="text-sm sm:text-base">{item.quantity}</span>

              <IconButton size="small" onClick={handleUpdateQuantity(1)}>
                <Add sx={{ fontSize: 16 }} />
              </IconButton>
            </div>

            <Button className="max-sm:order-2" size="small">
              remover
            </Button>
          </div>

          <p className="text-base md:text-lg text-zinc-600 max-sm:-order-1">
            {item.sellingPrice}R$
          </p>
        </div>
      </div>
    </div>
  );
};
