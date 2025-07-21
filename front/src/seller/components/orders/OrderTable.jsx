import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableCell, Button, Menu, MenuItem } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../../state/seller/sellerOrderSlice";
import { formatCurrencyBRL } from "../../../utils/formatCurrencyBRL";

const statusColors = {
  PENDING: "border-yellow-500 text-yellow-600",
  PLACED: "border-blue-500 text-blue-600",
  CONFIRMED: "border-green-500 text-green-600",
  SHIPPED: "border-teal-500 text-teal-600",
  DELIVERED: "border-purple-500 text-purple-600",
  CANCELLED: "border-red-500 text-red-600",
};

const statusTranslation = {
  PENDING: "Pendente",
  PLACED: "Pedido Realizado",
  CONFIRMED: "Confirmado",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const OrderTable = () => {
  const dispatch = useAppDispatch();
  const { sellerOrder } = useAppSelector((state) => state);
  const [anchorEl, setAnchorEl] = useState({});

  const handleClick = (event, orderId) => {
    setAnchorEl((prev) => ({
      ...prev,
      [orderId]: event.currentTarget,
    }));
  };

  const handleClose = (orderId) => {
    setAnchorEl((prev) => ({
      ...prev,
      [orderId]: null,
    }));
  };

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
    handleClose(orderId);
  };

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <TableCell>Id Pedido</TableCell>
            <TableCell>Produto</TableCell>
            <TableCell align="right">Endereço de Entrega</TableCell>
            <TableCell align="right">Status do Pedido</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sellerOrder.orders?.map((item) => (
            <StyledTableRow key={item.id}>
              <TableCell component="th" scope="row">
                {item.id}
              </TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {item.orderItems.map((orderItem) => (
                    <div
                      className="flex items-center gap-5"
                      key={orderItem.product.id}
                    >
                      <img
                        className="w-20 h-20 object-contain object-center rounded-md"
                        src={orderItem.product.images[0]}
                        alt="Imagem do Produto"
                      />

                      <div className="flex flex-col gap-1 text-sm">
                        <p className="font-playfair font-semibold">
                          {orderItem.product.title}
                        </p>
                        <p>
                          Preço:{" "}
                          {formatCurrencyBRL(orderItem.product.sellingPrice)}
                        </p>
                        <p>Cor: {orderItem.product.color}</p>
                        <p>Tamanho: {orderItem.product.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell align="right">
                <div className="flex flex-col">
                  <p>{item.orderAddress.recipient}</p>
                  <p>
                    {item.orderAddress.address}, {item.orderAddress.city}
                  </p>
                  <p>
                    {item.orderAddress.state}, {item.orderAddress.cep}
                  </p>
                  <p>Telefone: {item.orderAddress.mobile}</p>
                </div>
              </TableCell>
              <TableCell align="right">
                <span
                  className={`px-5 py-2 border rounded-full ${
                    statusColors[item.orderStatus]
                  }`}
                >
                  {statusTranslation[item.orderStatus] || item.orderStatus}
                </span>
              </TableCell>
              <TableCell align="right">
                <Button onClick={(e) => handleClick(e, item.id)} size="small">
                  Atualizar
                </Button>
                <Menu
                  id={`status-menu-${item.id}`}
                  anchorEl={anchorEl[item.id]}
                  open={Boolean(anchorEl[item.id])}
                  onClose={() => handleClose(item.id)}
                  MenuListProps={{
                    "aria-labelledby": `status-menu-${item.id}`,
                  }}
                >
                  {Object.entries(statusTranslation).map(([status, label]) => (
                    <MenuItem
                      key={status}
                      onClick={() => handleStatusChange(item.id, status)}
                    >
                      {label}
                    </MenuItem>
                  ))}
                </Menu>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
