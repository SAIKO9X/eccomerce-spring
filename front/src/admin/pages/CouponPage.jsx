import {
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TableSortLabel,
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableCell } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../state/store";
import {
  activateCoupon,
  deactivateCoupon,
  deleteCoupon,
  fetchCouponsByStatus,
} from "../../state/admin/adminCouponSlice";
import { MoreVert } from "@mui/icons-material";
const statusOptions = [
  {
    status: "ACTIVE",
    title: "Ativo",
    description: "Cupom disponível para uso.",
  },
  {
    status: "EXPIRED",
    title: "Expirado",
    description: "O prazo do cupom já terminou.",
  },
  {
    status: "PENDING",
    title: "Pendente",
    description: "O cupom ainda não foi ativado.",
  },
  {
    status: "INACTIVE",
    title: "Inativo",
    description: "Cupom desativado pelo administrador.",
  },
  {
    status: "SCHEDULED",
    title: "Agendado",
    description: "Cupom programado para ser ativado em uma data futura.",
  },
];

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function descendingComparator(a, b, orderBy) {
  const valueA =
    orderBy === "validityStartDate" || orderBy === "validityEndDate"
      ? new Date(a[orderBy])
      : a[orderBy];
  const valueB =
    orderBy === "validityStartDate" || orderBy === "validityEndDate"
      ? new Date(b[orderBy])
      : b[orderBy];

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
  { id: "code", label: "Código do Cupom", sortable: false },
  { id: "validityStartDate", label: "Data de Início", sortable: true },
  { id: "validityEndDate", label: "Data de Expiração", sortable: true },
  { id: "minimumOrderValue", label: "Valor Mínimo do Pedido", sortable: true },
  { id: "discountPercentage", label: "Desconto (%)", sortable: true },
  { id: "status", label: "Status", sortable: false },
  { id: "delete", label: "Editar", sortable: false },
];

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => () => {
    onRequestSort(property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align || "left"}>
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

export const CouponPage = () => {
  const dispatch = useAppDispatch();
  const { coupons, loading, error } = useAppSelector(
    (state) => state.adminCoupon
  );
  const [couponStatus, setCouponStatus] = useState("ACTIVE");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("validityStartDate");
  const [anchorEl, setAnchorEl] = useState(null); // Estado para o menu
  const [selectedCouponId, setSelectedCouponId] = useState(null); // ID do cupom selecionado

  useEffect(() => {
    dispatch(fetchCouponsByStatus(couponStatus));
  }, [dispatch, couponStatus]);

  const handleChange = (event) => {
    setCouponStatus(event.target.value);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Funções para abrir e fechar o menu
  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedCouponId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCouponId(null);
  };

  // Funções de ação
  const handleActivateDeactivate = (id, isActive) => {
    if (isActive) {
      dispatch(deactivateCoupon(id));
    } else {
      dispatch(activateCoupon(id));
    }
    handleMenuClose();
  };

  const handleDelete = (id) => {
    dispatch(deleteCoupon(id));
    handleMenuClose();
  };

  const sortedRows = useMemo(
    () => [...coupons].sort(getComparator(order, orderBy)),
    [order, orderBy, coupons]
  );

  if (loading) return <div>Carregando...</div>;

  if (error) {
    const errorMessage =
      typeof error === "string"
        ? error
        : error?.message || "Erro ao carregar cupons";
    return <div>Erro: {errorMessage}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="w-1/2">
        <FormControl fullWidth>
          <InputLabel id="coupon-status-label">Status do Cupom</InputLabel>
          <Select
            labelId="coupon-status-label"
            id="coupon-status-select"
            label="Status do Cupom"
            value={couponStatus}
            onChange={handleChange}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.status} value={option.status}>
                <div className="text-sm">
                  <p className="font-semibold leading-none">{option.title}</p>
                  <span className="text-zinc-400">{option.description}</span>
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div>
        <h1 className="capitalize font-medium font-playfair text-lg pb-4">
          Todos os Cupons
        </h1>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {sortedRows.map((row) => (
                <StyledTableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.code}
                  </TableCell>
                  <TableCell>{row.validityStartDate}</TableCell>
                  <TableCell>{row.validityEndDate}</TableCell>
                  <TableCell>{row.minimumOrderValue}</TableCell>
                  <TableCell>{row.discountPercentage}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(event) => handleMenuOpen(event, row.id)}
                    >
                      <MoreVert />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedCouponId === row.id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem
                        onClick={() =>
                          handleActivateDeactivate(row.id, row.isActive)
                        }
                      >
                        {row.isActive ? "Desativar" : "Ativar"}
                      </MenuItem>
                      <MenuItem onClick={() => handleDelete(row.id)}>
                        Deletar
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
