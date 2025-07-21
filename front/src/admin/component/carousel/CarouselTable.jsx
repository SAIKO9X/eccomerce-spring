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
import { useState, useEffect } from "react";
import {
  deleteHomeCategory,
  getHomeCategory,
  updateHomeCategory,
} from "../../../state/admin/adminSlice";
import { CarouselForm } from "./CarouselForm";
import { useAppDispatch, useAppSelector } from "../../../state/store";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const CarouselTable = () => {
  const dispatch = useAppDispatch();
  const { categories, loading, error } = useAppSelector(
    (state) => state.adminSlice
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const carouselCategories = categories.filter(
    (cat) => cat.section === "CAROUSEL"
  );

  useEffect(() => {
    dispatch(getHomeCategory());
  }, [dispatch]);

  const handleMenuOpen = (event, categoryId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategoryId(categoryId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategoryId(null);
  };

  const handleEdit = () => {
    const category = carouselCategories.find(
      (c) => c.id === selectedCategoryId
    );
    if (category) {
      setSelectedCategory(category);
      setOpenModal(true);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (
      selectedCategoryId &&
      window.confirm("Tem certeza que deseja deletar esta categoria?")
    ) {
      dispatch(deleteHomeCategory(selectedCategoryId))
        .unwrap()
        .then(() => {
          handleMenuClose();
          dispatch(getHomeCategory()); // Atualiza a lista após deletar
        });
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCategory(null);
  };

  const handleUpdateCategory = (updatedCategoryData) => {
    if (selectedCategory) {
      dispatch(
        updateHomeCategory({
          id: selectedCategory.id,
          data: updatedCategoryData,
        })
      )
        .unwrap()
        .then(() => {
          handleCloseModal();
          dispatch(getHomeCategory()); // Atualiza a lista após editar
        });
    }
  };

  if (loading) return <div>Carregando categorias...</div>;
  if (error) return <div>Erro ao carregar categorias: {error}</div>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="carousel table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Categoria</TableCell>
            <TableCell>Imagem</TableCell>
            <TableCell>Texto do Botão</TableCell>
            <TableCell>Texto Superior</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {carouselCategories.map((category) => (
            <StyledTableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>
                <img src={category.image} alt={category.name} width={100} />
              </TableCell>
              <TableCell>{category.textButton}</TableCell>
              <TableCell>{category.topText}</TableCell>
              <TableCell>
                <IconButton onClick={(e) => handleMenuOpen(e, category.id)}>
                  <Edit />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && selectedCategoryId === category.id}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
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
          <CarouselForm
            category={selectedCategory}
            onSubmit={handleUpdateCategory}
            onClose={handleCloseModal}
          />
        </div>
      </Modal>
    </TableContainer>
  );
};
