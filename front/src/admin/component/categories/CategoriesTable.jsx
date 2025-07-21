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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import { deleteCategory } from "../../../state/admin/adminCategorySlice";
import { useState } from "react";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const CategoriesTable = ({ onEdit }) => {
  const { categories, loading, error } = useAppSelector(
    (state) => state.categories
  );
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState(null); // Estado para controlar o menu
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // ID da categoria selecionada

  if (loading) return <div>Carregando categorias...</div>;
  if (error) return <div>Erro ao carregar categorias: {error}</div>;

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja deletar esta categoria?")) {
      dispatch(deleteCategory(id));
    }
    setAnchorEl(null); // Fecha o menu após a ação
  };

  const handleMenuOpen = (event, categoryId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategoryId(categoryId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategoryId(null);
  };

  const handleUpdate = () => {
    const category = categories.find((cat) => cat.id === selectedCategoryId);
    if (category) {
      onEdit(category); // Abre o modal com a categoria selecionada para atualização
    }
    handleMenuClose();
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="categorias table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Categoria</TableCell>
            <TableCell>Nível</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Categoria Associada</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories?.map((category) => (
            <StyledTableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.categoryId}</TableCell>
              <TableCell>{category.level}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>
                {category.parentCategory?.name || "Nenhuma"}
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={(e) => handleMenuOpen(e, category.id)}
                  aria-label="ações"
                >
                  <Edit />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && selectedCategoryId === category.id}
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
                  <MenuItem onClick={handleUpdate}>Atualizar</MenuItem>
                  <MenuItem onClick={() => handleDelete(category.id)}>
                    Deletar
                  </MenuItem>
                </Menu>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
