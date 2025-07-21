import { Divider } from "@mui/material";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { UserDetails } from "../components/profile/UserDetails";
import { Orders } from "../components/profile/Orders";
import { OrderDetails } from "../components/profile/OrderDetails";
import { Address } from "../components/profile/Address";
import { logout } from "../../state/authSlice";
import { ReviewPage } from "./ReviewPage";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../state/store";

const menu = [
  { name: "Pedidos", path: "/account/orders" },
  { name: "Perfil", path: "/account/profile" },
  { name: "Endereços Salvos", path: "/account/addresses" },
  { name: "Avaliações", path: "/account/reviews" },
  { name: "Sair da Conta", path: "/" },
];

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAppSelector((state) => state);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      navigate("/");
    }
  }, [auth.isLoggedIn, navigate]);

  const handleClick = (item) => {
    if (item.path === "/") {
      dispatch(logout());
    } else {
      navigate(item.path);
    }
  };

  return (
    <section className="px-5 xl:px-52 pt-10 bg-white">
      <div>
        <h1 className="text-xl font-medium font-playfair pb-5">
          Perfil | {auth.user?.fullName || "Usuário"}
        </h1>
      </div>

      <Divider />

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:min-h-[78vh]">
        <div className="col-span-1 lg:border-r border-r-black/10 lg:pr-5 py-5 h-full">
          {menu.map((item) => (
            <div key={item.name}>
              <div
                onClick={() => handleClick(item)}
                className={`py-3 my-2 cursor-pointer hover:font-medium hover:bg-black/5 rounded-md ${
                  location.pathname === item.path
                    ? "bg-black/5 font-medium text-zinc-500"
                    : ""
                }`}
              >
                <p className="pl-4">{item.name}</p>
              </div>
              <Divider />
            </div>
          ))}
        </div>

        <div className="right lg:col-span-2 lg:pl-5 py-5">
          <Routes>
            <Route path="/profile" element={<UserDetails />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/reviews" element={<ReviewPage />} />
            <Route
              path="/orders/:orderId/:orderItemId"
              element={<OrderDetails />}
            />
            <Route path="/addresses" element={<Address />} />
          </Routes>
        </div>
      </div>
    </section>
  );
};
