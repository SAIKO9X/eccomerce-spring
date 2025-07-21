import { useState } from "react";
import { SellerRoutes } from "../../routes/SellerRoutes";
import { SellerDrawerList } from "../components/drawerList/SellerDrawerList";
import { Close, Menu } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../state/store";
import { useEffect } from "react";
import { fetchSellerProfile } from "../../state/seller/sellerSlice";

export const SellerDashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.seller);

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      dispatch(fetchSellerProfile(jwt));
    }
  }, [dispatch]);

  return (
    <section className="xl:flex h-screen">
      {!isDrawerOpen && (
        <button
          className="xl:hidden bg-zinc-100 border border-black/10 rounded-sm p-1 m-2"
          onClick={toggleDrawer}
          aria-label="Abrir menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      <aside
        className={`absolute xl:relative z-50 top-0 left-0 h-full min-w-64 border-r border-black/10 bg-white shadow-lg transition-transform ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } xl:translate-x-0`}
        aria-label="Menu do vendedor"
      >
        <button
          className="xl:hidden absolute right-2 top-2"
          onClick={toggleDrawer}
          aria-label="Fechar menu"
        >
          <Close className="w-6 h-6" />
        </button>

        <SellerDrawerList toggleDrawer={toggleDrawer} sellerProfile={profile} />
      </aside>

      <main className="w-full overflow-y-auto p-4">
        <section className="w-full h-full">
          <SellerRoutes />
        </section>
      </main>
    </section>
  );
};
