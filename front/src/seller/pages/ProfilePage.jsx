import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../state/store";
import { fetchSellerProfile } from "../../state/seller/sellerSlice";
import { CircularProgress, Typography, Paper } from "@mui/material";
import { EditSellerForm } from "../components/profile/EditSellerForm";

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector((state) => state.seller);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(fetchSellerProfile(jwt));
    }
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <Typography color="error">
          Erro ao carregar o perfil: {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <Typography variant="h4" component="h1" className="font-playfair mb-6">
        Meu Perfil
      </Typography>
      <Paper elevation={3} className="p-4 md:p-6">
        {profile ? (
          <EditSellerForm seller={profile} />
        ) : (
          <Typography>Não foi possível carregar os dados do perfil.</Typography>
        )}
      </Paper>
    </div>
  );
};
