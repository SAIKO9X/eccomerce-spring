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
    // Envolvemos tudo numa div para garantir um contexto de layout consistente
    <div className="flex items-start space-x-4 p-2 rounded-lg">
      {/* Container para Checkbox e Imagem */}
      <div className="flex-shrink-0 flex items-center space-x-2">
        <Checkbox
          checked={isSelected}
          onChange={onSelect}
          inputProps={{ "aria-label": "Select item" }}
        />
        <img
          className="w-20 h-20 md:w-28 md:h-28 rounded-md object-cover object-center"
          src={item.product?.images[0]}
          alt="Imagem do Produto"
        />
      </div>

      {/* Container principal para todos os detalhes e ações */}
      <div className="flex flex-col sm:flex-row flex-grow justify-between items-start">
        {/* Detalhes do produto */}
        <div className="flex flex-col text-sm mb-2 sm:mb-0">
          <h2 className="font-semibold font-playfair text-base md:text-lg capitalize">
            {item.product?.title}
          </h2>
          <p className="text-zinc-600 text-sm md:text-base hidden sm:block">
            {item.product?.description.substring(0, 50)}...
          </p>
          <p className="text-zinc-400 capitalize">
            Vendido Por: {item.product?.seller?.businessDetails.businessName}
          </p>
          <p>
            Troca dentro de 7 dias <span>disponível</span>
          </p>
        </div>

        {/* Ações e Preço */}
        <div className="flex flex-row sm:flex-col items-center justify-between w-full sm:w-auto sm:items-end gap-2">
          <p className="text-base md:text-lg font-medium">
            {item.sellingPrice} R$
          </p>

          <div className="flex items-center gap-2">
            <div className="border border-black/10 rounded-md flex items-center">
              <IconButton
                size="small"
                disabled={item.quantity <= 1}
                onClick={handleUpdateQuantity(-1)}
              >
                <Remove sx={{ fontSize: 16 }} />
              </IconButton>

              <span className="text-sm sm:text-base px-2">{item.quantity}</span>

              <IconButton size="small" onClick={handleUpdateQuantity(1)}>
                <Add sx={{ fontSize: 16 }} />
              </IconButton>
            </div>

            <Button size="small">remover</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
