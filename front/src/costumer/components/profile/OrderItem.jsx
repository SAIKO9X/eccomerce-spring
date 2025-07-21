import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export const OrderItem = ({ item, order }) => {
  const navigate = useNavigate();

  const formattedDate = format(
    new Date(order.deliverDate),
    "EEEE, d 'de' MMMM 'de' yyyy",
    { locale: ptBR }
  );

  return (
    <div
      onClick={() => navigate(`/account/orders/${order.id}/${item.id}`)}
      className="text-sm bg-white p-5 space-y-4 border border-black/10 rounded-md cursor-pointer hover:bg-black/5 transition-colors duration-500"
    >
      <div className="flex items-center gap-2 h-8">
        <span className="w-0.5 h-full bg-black/60"></span>
        <div>
          <h2 className="font-medium uppercase">pendente</h2>
          <p className="text-zinc-400">chega {formattedDate}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <img
          className="w-18 object-center object-cover"
          src={item.product?.images[0]}
          alt="imagem do produto"
        />

        <div className="w-full space-y-2">
          <h3 className="font-playfair font-medium text-lg">
            {item.product.seller?.businessDetails.businessName}
          </h3>
          <p>{item.product.title}</p>
          <p>
            <strong>tamanho:</strong> {item.size}
          </p>
        </div>
      </div>
    </div>
  );
};
