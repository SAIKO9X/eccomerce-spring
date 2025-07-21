import { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableCell,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "../../state/store";
import {
  fetchSellersByStatus,
  updateSellerStatus,
} from "../../state/seller/sellerSlice";

const statusOptions = [
  {
    status: "PENDING_VERIFICATION",
    title: "Verificação Pendente",
    description:
      "A conta foi criada, mas ainda está aguardando a verificação necessária para se tornar ativa.",
  },
  {
    status: "ACTIVE",
    title: "Ativa",
    description:
      "A conta está ativa e pode ser usada normalmente para todas as funcionalidades disponíveis.",
  },
  {
    status: "SUSPENDED",
    title: "Suspensa",
    description:
      "A conta foi temporariamente suspensa devido a violações de política ou outras questões pendentes.",
  },
  {
    status: "BANNED",
    title: "Banida",
    description:
      "A conta foi permanentemente desativada devido a violações graves ou recorrentes das políticas.",
  },
  {
    status: "CLOSED",
    title: "Fechada",
    description:
      "A conta foi encerrada voluntariamente pelo usuário ou administradores e não pode ser reativada.",
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

export const SellersTable = () => {
  const dispatch = useAppDispatch();
  const { sellers, loading, error } = useAppSelector((state) => state.seller);
  const [accountStatus, setAccountStatus] = useState("ACTIVE");

  useEffect(() => {
    dispatch(fetchSellersByStatus(accountStatus));
  }, [dispatch, accountStatus]);

  const handleChange = (event) => {
    setAccountStatus(event.target.value);
  };

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateSellerStatus({ id, status: newStatus }));
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="w-1/2">
        <FormControl fullWidth>
          <InputLabel id="account-status-label">Status da Conta</InputLabel>
          <Select
            labelId="account-status-label"
            id="account-status-select"
            label="Status da Conta"
            value={accountStatus}
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
          Todos os Vendedores
        </h1>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell>Nome do Vendedor</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Celular</TableCell>
                <TableCell>CNPJ</TableCell>
                <TableCell>Nome do Negócio</TableCell>
                <TableCell>Status da Conta</TableCell>
                <TableCell>Alterar Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sellers.map((row) => (
                <StyledTableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.sellerName}
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.mobile}</TableCell>
                  <TableCell>{row.cnpj}</TableCell>
                  <TableCell>
                    {row.businessDetails?.businessName || "N/A"}
                  </TableCell>
                  <TableCell>{row.accountStatus}</TableCell>
                  <TableCell>
                    <Select
                      value={row.accountStatus}
                      onChange={(e) =>
                        handleStatusChange(row.id, e.target.value)
                      }
                      displayEmpty
                      inputProps={{ "aria-label": "Alterar Status" }}
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option.status} value={option.status}>
                          {option.title}
                        </MenuItem>
                      ))}
                    </Select>
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
