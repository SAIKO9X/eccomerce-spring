import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Box,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../state/store";
import { updateAdminProfile } from "../../state/authSlice";
import { useAlert } from "../../utils/useAlert";
import { Edit } from "@mui/icons-material";

export const AdminProfilePage = () => {
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector((state) => state);
  const { showAlert, AlertComponent } = useAlert();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (auth.user) {
      setFormData({
        fullName: auth.user.fullName || "",
        email: auth.user.email || "",
        password: "", // Senha fica em branco por segurança
      });
    }
  }, [auth.user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const jwt = localStorage.getItem("jwt");
    dispatch(updateAdminProfile({ userData: formData, jwt }))
      .unwrap()
      .then(() => {
        showAlert("Perfil atualizado com sucesso!", "success");
        setIsEditing(false);
      });
  };

  return (
    <Box sx={{ p: 4 }}>
      <AlertComponent placement="absolute" />
      <Stack spacing={4}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">Perfil do Administrador</Typography>
          {!isEditing && (
            <IconButton onClick={() => setIsEditing(true)}>
              <Edit />
            </IconButton>
          )}
        </Box>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Nome Completo"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                type="password"
                label="Nova Senha (deixe em branco para não alterar)"
                name="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
              />
              <Box>
                <Button type="submit" variant="contained">
                  Salvar
                </Button>
                <Button onClick={() => setIsEditing(false)} sx={{ ml: 2 }}>
                  Cancelar
                </Button>
              </Box>
            </Stack>
          </form>
        ) : (
          <Box>
            <p>
              <strong>Nome:</strong> {auth.user?.fullName}
            </p>
            <p>
              <strong>Email:</strong> {auth.user?.email}
            </p>
          </Box>
        )}
      </Stack>
    </Box>
  );
};
