import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const LoginPromptDialog = ({ open, handleClose }) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/login");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Login Necessário</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Você precisa fazer login para realizar esta ação. Deseja ir para a
          página de login agora?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>
          Fazer Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};
