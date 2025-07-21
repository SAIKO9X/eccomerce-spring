import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Box,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import { updateUserProfile } from "../../../state/authSlice";
import { useAlert } from "../../../utils/useAlert";
import { Edit } from "@mui/icons-material";

export const UserDetails = () => {
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector((state) => state);
  const { showAlert, AlertComponent } = useAlert();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
  });

  useEffect(() => {
    if (auth.user) {
      setFormData({
        fullName: auth.user.fullName || "",
        mobile: auth.user.mobile || "",
      });
    }
  }, [auth.user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const jwt = localStorage.getItem("jwt");
    dispatch(updateUserProfile({ userData: formData, jwt }))
      .unwrap()
      .then(() => {
        showAlert("Perfil atualizado com sucesso!", "success");
        setIsEditing(false);
      })
      .catch((error) => {
        showAlert(error?.message || "Erro ao atualizar o perfil.", "error");
      });
  };

  const handleCancel = () => {
    if (auth.user) {
      setFormData({
        fullName: auth.user.fullName || "",
        mobile: auth.user.mobile || "",
      });
    }
    setIsEditing(false);
  };

  return (
    // 1. Contêiner principal usando Box para centralizar o conteúdo
    <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
      {/* 2. Stack para organizar todo o conteúdo e controlar o espaçamento e a largura */}
      <Stack spacing={2} sx={{ width: { xs: "90%", lg: "70%" } }}>
        <AlertComponent />

        {/* Cabeçalho da seção */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontFamily: "font-playfair", fontWeight: "medium" }}
          >
            Dados Pessoais
          </Typography>
          {!isEditing && (
            <IconButton onClick={() => setIsEditing(true)} color="primary">
              <Edit />
            </IconButton>
          )}
        </Box>

        {isEditing ? (
          // 3. Formulário de edição
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Nome Completo"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={auth.user?.email || ""}
                disabled
              />
              <TextField
                fullWidth
                label="Telefone"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
              <Box sx={{ display: "flex", gap: 2, pt: 1 }}>
                <Button type="submit" variant="contained" color="primary">
                  Salvar Alterações
                </Button>
                <Button onClick={handleCancel} variant="outlined">
                  Cancelar
                </Button>
              </Box>
            </Stack>
          </Box>
        ) : (
          // 4. Exibição dos dados do usuário
          <Stack spacing={1.5} sx={{ pt: 2 }}>
            <Typography>
              <strong>Nome:</strong> {auth.user?.fullName || "Não informado"}
            </Typography>
            <Typography>
              <strong>Email:</strong> {auth.user?.email || ""}
            </Typography>
            <Typography>
              <strong>Telefone:</strong> {auth.user?.mobile || "Não informado"}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};
