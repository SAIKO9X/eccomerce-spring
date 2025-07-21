import { Button, Box } from "@mui/material";

export const UserAddressCard = ({ address, onEdit, onDelete }) => {
  return (
    <div className="p-5 border border-black/10 flex flex-col sm:flex-row justify-between items-start sm:items-center rounded-md gap-4">
      <div className="space-y-3 text-xs sm:text-sm">
        <h2 className="font-semibold text-base">
          {address.recipient || "Nome não informado"}
        </h2>
        <p className="max-w-xs">
          {`${address.address || ""}, ${address.city || ""} - ${
            address.cep || ""
          }, ${address.state || "Brasil"}`}
        </p>
        <p>
          <strong>Celular:</strong> {address.mobile || "Não informado"}
        </p>
      </div>
      <Box className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
        <Button size="small" variant="outlined" onClick={onEdit}>
          Editar
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="error"
          onClick={onDelete}
        >
          Remover
        </Button>
      </Box>
    </div>
  );
};
