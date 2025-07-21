import { Divider } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../state/store";
import { logout } from "../state/authSlice";
import { AccountCircle } from "@mui/icons-material";

export const DrawerList = ({ menu, menu2, profile, isAdmin = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const profileName = isAdmin
    ? profile?.fullName || "Administrador"
    : profile?.sellerName || "Vendedor";
  const profileEmail = profile?.email || "";

  const profileImage = isAdmin ? profile?.logo : profile?.businessDetails?.logo;

  return (
    <div className="flex flex-col p-6 h-full">
      <div className="flex items-center gap-2 pb-5">
        {profileImage ? (
          <img
            src={profileImage}
            alt="Imagem de Perfil"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <AccountCircle
            sx={{ width: 40, height: 40, color: "text.secondary" }}
          />
        )}

        <div className="flex flex-col justify-center text-sm min-w-0">
          <p className="font-playfair font-medium leading-none overflow-hidden text-ellipsis whitespace-nowrap">
            {profileName}
          </p>
          <span className="text-zinc-400 overflow-hidden text-ellipsis whitespace-nowrap">
            {profileEmail}
          </span>
        </div>
      </div>

      <Divider sx={{ marginBottom: "1rem" }} />

      <nav className="flex flex-col justify-between h-full">
        {/* O resto do seu componente permanece exatamente igual */}
        <div>
          <p className="text-xs text-zinc-400 uppercase pb-2">Principal</p>
          <ul className="space-y-4">
            {menu.map((item, index) => (
              <li
                onClick={() => navigate(item.path)}
                key={index}
                className="cursor-pointer"
              >
                <p
                  className={`${
                    item.path === location.pathname
                      ? "bg-black/5 text-black"
                      : "text-zinc-400"
                  } flex items-center text-sm gap-3 p-2 rounded-md hover:bg-black/10 hover:text-black transition-all duration-300 ease-in-out`}
                >
                  <span>
                    {item.path === location.pathname
                      ? item.activeIcon
                      : item.icon}
                  </span>
                  {item.name}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Divider sx={{ marginBlock: "1rem" }} />
          <ul className="space-y-2">
            {menu2.map((item, index) => (
              <li
                onClick={() => {
                  if (item.path === "/") {
                    handleLogout();
                  } else {
                    navigate(item.path);
                  }
                }}
                key={index}
                className="cursor-pointer"
              >
                <p
                  className={`${
                    item.path === location.pathname
                      ? "bg-black/5 text-black"
                      : "text-zinc-400"
                  } flex items-center text-sm gap-3 p-2 rounded-md hover:bg-black/10 hover:text-black transition-all duration-300 ease-in-out`}
                >
                  <span>
                    {item.path === location.pathname
                      ? item.activeIcon
                      : item.icon}
                  </span>
                  {item.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};
