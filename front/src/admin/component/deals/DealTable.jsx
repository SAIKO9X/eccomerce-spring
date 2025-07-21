import { Edit } from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Modal,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import { useState, useEffect } from "react";
import {
  getAllDeals,
  deleteDeal,
  updateDeal,
} from "../../../state/admin/dealSlice";
import { CreateDealForm } from "./CreateDealForm";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const DealTable = () => {
  const dispatch = useAppDispatch();
  const {
    deals = [],
    loading,
    error,
  } = useAppSelector((state) => state.deal || {});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDealId, setSelectedDealId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  useEffect(() => {
    dispatch(getAllDeals());
  }, [dispatch]);

  if (loading) return <div>Carregando promoções...</div>;
  if (error)
    return (
      <div>Erro ao carregar promoções: {error || "Erro desconhecido"}</div>
    );

  const handleMenuOpen = (event, dealId) => {
    setAnchorEl(event.currentTarget);
    setSelectedDealId(dealId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDealId(null);
  };

  const handleDelete = () => {
    if (
      selectedDealId &&
      window.confirm("Tem certeza que deseja deletar esta promoção?")
    ) {
      dispatch(deleteDeal(selectedDealId)).then(() => {
        handleMenuClose();
        dispatch(getAllDeals());
      });
    }
  };

  const handleEdit = () => {
    const deal = deals.find((d) => d.id === selectedDealId);
    if (deal) {
      setSelectedDeal(deal);
      setOpenModal(true);
    }
    handleMenuClose();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDeal(null);
  };

  const handleUpdateDeal = (updatedDealData) => {
    if (selectedDeal) {
      dispatch(updateDeal({ id: selectedDeal.id, dealData: updatedDealData }))
        .unwrap()
        .then(() => {
          handleCloseModal();
          dispatch(getAllDeals());
        })
        .catch((error) => {
          console.error("Erro ao atualizar a deal:", error);
          alert(`Erro ao atualizar a promoção: ${error}`);
        });
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="deal table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Categoria/Produto</TableCell>
            <TableCell>Imagem</TableCell>
            <TableCell>Valor Original</TableCell>
            <TableCell>Valor com Desconto</TableCell>
            <TableCell>Desconto</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deals?.map((deal) => (
            <StyledTableRow key={deal.id}>
              <TableCell>{deal.id}</TableCell>
              <TableCell>
                {deal.dealType === "CATEGORY"
                  ? deal.dealName
                  : deal.product?.title || "N/A"}
              </TableCell>
              <TableCell>
                {deal.dealImage ? (
                  <img
                    src={deal.dealImage}
                    alt={deal.dealName || deal.product?.title || "Deal"}
                    width={100}
                  />
                ) : deal.product?.images?.[0] ? (
                  <img
                    src={deal.product.images[0]}
                    alt={deal.product?.title || "Deal"}
                    width={100}
                  />
                ) : (
                  "Nenhuma imagem"
                )}
              </TableCell>
              <TableCell>
                {deal.originalPrice ? deal.originalPrice.toString() : "N/A"}
              </TableCell>
              <TableCell>
                {deal.discountedPrice ? deal.discountedPrice.toString() : "N/A"}
              </TableCell>
              <TableCell>
                {deal.discount
                  ? `${deal.discount}%`
                  : deal.productDiscountPercent
                  ? `${deal.productDiscountPercent}%`
                  : "N/A"}
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={(e) => handleMenuOpen(e, deal.id)}
                  aria-label="ações"
                >
                  <Edit />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && selectedDealId === deal.id}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <MenuItem onClick={handleEdit}>Editar</MenuItem>
                  <MenuItem onClick={handleDelete}>Deletar</MenuItem>
                </Menu>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            minWidth: "300px",
            maxWidth: "500px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CreateDealForm
            deal={selectedDeal}
            onSubmit={handleUpdateDeal}
            onClose={handleCloseModal}
          />
        </div>
      </Modal>
    </TableContainer>
  );
};
