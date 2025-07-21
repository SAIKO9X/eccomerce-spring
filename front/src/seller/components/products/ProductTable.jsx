import { useState, useMemo, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TableCell,
  Button,
  IconButton,
  Modal,
  Box,
} from "@mui/material";
import { fetchSellerProducts } from "../../../state/seller/sellerProductSlice";
import { Edit } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import { EditProductForm } from "./EditProductForm"; // Importe o novo formulário

// ... (Estilos e funções de ordenação permanecem iguais)
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

function descendingComparator(a, b, orderBy) {
  const valueA = Array.isArray(a[orderBy]) ? a[orderBy].join(", ") : a[orderBy];
  const valueB = Array.isArray(b[orderBy]) ? b[orderBy].join(", ") : b[orderBy];
  if (valueB < valueA) return -1;
  if (valueB > valueA) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  { id: "image", label: "Imagem", sortable: false, align: "left" },
  { id: "title", label: "Nome", sortable: true, align: "left" },
  { id: "basePrice", label: "Preço Sugerido", sortable: true, align: "right" },
  {
    id: "sellingPrice",
    label: "Preço de Venda",
    sortable: true,
    align: "right",
  },
  { id: "colors", label: "Cor", sortable: true, align: "right" },
  { id: "stock", label: "Estoque", sortable: false, align: "right" },
  { id: "edit", label: "Editar", sortable: false, align: "right" },
];

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => () => {
    onRequestSort(property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align}>
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
  maxHeight: "90vh",
};

export const ProductTable = () => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const dispatch = useAppDispatch();
  const { sellerProduct } = useAppSelector((store) => store);

  useEffect(() => {
    dispatch(fetchSellerProducts(localStorage.getItem("jwt")));
  }, [dispatch]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const sortedRows = useMemo(() => {
    return sellerProduct.products
      ? [...sellerProduct.products].sort(getComparator(order, orderBy))
      : [];
  }, [order, orderBy, sellerProduct.products]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {!sellerProduct.products && <p>Sem Produtos...</p>}
            {sortedRows.map((item) => (
              <StyledTableRow key={item.id}>
                <TableCell>
                  <div className="flex gap-2 flex-wrap">
                    {item.images.map((image, index) => (
                      <img
                        key={index}
                        className="w-20 h-30 object-cover rounded-md"
                        src={image}
                        alt=""
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell align="right">
                  {currencyFormatter.format(item.basePrice | item.mrpPrice)}
                </TableCell>
                <TableCell align="right">
                  {currencyFormatter.format(item.sellingPrice)}
                </TableCell>
                <TableCell align="right">{item.colors.join(", ")}</TableCell>
                <TableCell align="right">
                  <Button>
                    {item.quantity > 0 ? "Em estoque" : "Esgotado"}
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenModal(item)}>
                    <Edit />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <h2 className="text-xl font-semibold mb-4">Editar Produto</h2>
          {selectedProduct && (
            <EditProductForm
              product={selectedProduct}
              onClose={handleCloseModal}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};
