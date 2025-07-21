import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import { UserAddressCard } from "./UserAddressCard";
import { Box, Button, Modal, Typography } from "@mui/material";
import { AddressForm } from "./AddressForm";
import {
  addAddress,
  deleteUserAddress,
  updateUserAddress,
} from "../../../state/authSlice";
import { useAlert } from "../../../utils/useAlert";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export const Address = () => {
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector((state) => state);
  const { showAlert, AlertComponent } = useAlert();

  const [open, setOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleOpen = (address = null) => {
    setEditingAddress(address);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAddress(null);
  };

  const handleSubmit = (addressData) => {
    const jwt = localStorage.getItem("jwt");
    if (editingAddress) {
      // Lógica de Edição
      dispatch(
        updateUserAddress({ addressId: editingAddress.id, addressData, jwt })
      )
        .unwrap()
        .then(() => showAlert("Endereço atualizado!", "success"))
        .catch(() => showAlert("Erro ao atualizar endereço.", "error"));
    } else {
      // Lógica de Adição
      dispatch(addAddress({ address: addressData, jwt }))
        .unwrap()
        .then(() => showAlert("Endereço adicionado!", "success"))
        .catch(() => showAlert("Erro ao adicionar endereço.", "error"));
    }
    handleClose();
  };

  const handleDelete = (addressId) => {
    const jwt = localStorage.getItem("jwt");
    dispatch(deleteUserAddress({ addressId, jwt }))
      .unwrap()
      .then(() => showAlert("Endereço removido!", "warning"))
      .catch(() => showAlert("Erro ao remover endereço.", "error"));
  };

  return (
    <div className="space-y-5">
      <AlertComponent placement="absolute" />
      <div className="flex justify-between items-center">
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontFamily: "font-playfair", fontWeight: "medium" }}
        >
          Endereços Salvos
        </Typography>
        <Button onClick={() => handleOpen()} variant="contained">
          Adicionar Novo
        </Button>
      </div>

      <div className="space-y-4">
        {auth.user?.addresses?.map((address) => (
          <UserAddressCard
            key={address.id}
            address={address}
            onEdit={() => handleOpen(address)}
            onDelete={() => handleDelete(address.id)}
          />
        ))}
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            {editingAddress ? "Editar Endereço" : "Adicionar Novo Endereço"}
          </Typography>
          <AddressForm
            initialData={editingAddress}
            onSubmit={handleSubmit}
            onCancel={handleClose}
          />
        </Box>
      </Modal>
    </div>
  );
};
