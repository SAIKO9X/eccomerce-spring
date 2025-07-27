import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Box,
  IconButton,
  Stack,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import { updateUserProfile } from "../../../state/authSlice";
import { useAlert } from "../../../utils/useAlert";
import { Edit } from "@mui/icons-material";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary";

export const UserDetails = () => {
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector((state) => state);
  const { showAlert, AlertComponent } = useAlert();

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    avatar: "",
  });

  useEffect(() => {
    if (auth.user) {
      setFormData({
        fullName: auth.user.fullName || "",
        mobile: auth.user.mobile || "",
        avatar: auth.user.avatar || "",
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

  const handleImageUpload = async (e) => {
    setIsUploading(true);
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadToCloudinary(file);
        setFormData((prev) => ({ ...prev, avatar: imageUrl }));
      } catch (error) {
        showAlert("Erro ao fazer upload da imagem.", error);
      } finally {
        setIsUploading(false);
      }
    } else {
      setIsUploading(false);
    }
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

  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
      <Stack spacing={2} sx={{ width: { xs: "90%", lg: "70%" } }}>
        <AlertComponent />

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

        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <Avatar
            src={formData.avatar}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
        </Box>

        {isEditing ? (
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
            <Stack spacing={3}>
              <Button
                variant="outlined"
                component="label"
                disabled={isUploading}
              >
                {isUploading ? <CircularProgress size={24} /> : "Alterar Foto"}
                <input
                  type="file"
                  hidden
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </Button>
              <TextField
                fullWidth
                label="Nome Completo"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
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
                  Salvar
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outlined">
                  Cancelar
                </Button>
              </Box>
            </Stack>
          </Box>
        ) : (
          <Stack spacing={1.5} sx={{ pt: 2, alignItems: "center" }}>
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
