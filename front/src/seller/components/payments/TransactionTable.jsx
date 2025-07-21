import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableSortLabel from "@mui/material/TableSortLabel";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { TableCell } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import { getTransactionBySeller } from "../../../state/seller/transactionSlice";
import { formatDate } from "../../../utils/formatDate";
import { formatCurrencyBRL } from "../../../utils/formatCurrencyBRL";

// Função auxiliar para comparar valores
const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

// Função de comparação descendente
const descendingComparator = (a, b, orderBy) => {
  if (orderBy === "date") {
    return new Date(b.date) - new Date(a.date);
  }
  if (orderBy === "order") {
    const aId = a.order && a.order.id != null ? String(a.order.id) : "";
    const bId = b.order && b.order.id != null ? String(b.order.id) : "";
    return bId.localeCompare(aId);
  }
  if (orderBy === "earnings") {
    const aEarnings = a.order ? a.order.totalSellingPrice : a.amount;
    const bEarnings = b.order ? b.order.totalSellingPrice : b.amount;
    return bEarnings - aEarnings;
  }
  return 0;
};

// Função para ordenar o array
const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const headCells = [
  { id: "date", numeric: false, label: "Data" },
  {
    id: "customerDetails",
    numeric: false,
    label: "Email do Cliente",
    sortable: false,
  },
  { id: "order", numeric: false, label: "ID do Pedido" },
  { id: "earnings", numeric: true, label: "Ganhos" },
];

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => () => {
    onRequestSort(property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
          >
            {headCell.sortable === false ? (
              headCell.label
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export const TransactionTable = () => {
  const dispatch = useAppDispatch();
  const { transactions } = useAppSelector((state) => state.transactions);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(getTransactionBySeller({ jwt }));
    }
  }, [dispatch]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedTransactions = stableSort(
    transactions,
    getComparator(order, orderBy)
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {sortedTransactions.map((item) => (
                <StyledTableRow key={item.id}>
                  <TableCell>{formatDate(item.date).date}</TableCell>
                  <TableCell>
                    {item.customer ? item.customer.email : "Não Mencionado"}
                  </TableCell>
                  <TableCell>
                    {item.order ? item.order.id : "EXTERNO"}
                  </TableCell>
                  <TableCell align="right">
                    {item.order
                      ? formatCurrencyBRL(item.order.totalSellingPrice)
                      : formatCurrencyBRL(item.amount)}
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
