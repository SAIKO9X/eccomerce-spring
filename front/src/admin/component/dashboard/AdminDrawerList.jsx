import {
  AccountBox,
  Category,
  Dashboard,
  LocalOffer,
  Logout,
  PostAdd,
  ReceiptLong,
  ViewCarousel,
} from "@mui/icons-material";
import { DrawerList } from "../../../components/DrawerList";
import { EditNote } from "@mui/icons-material";
import { useAppSelector } from "../../../state/store";

const menu = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: <Dashboard />,
    activeIcon: <Dashboard color="primary" />,
  },
  {
    name: "Cupons",
    path: "/admin/coupon",
    icon: <ReceiptLong />,
    activeIcon: <ReceiptLong color="primary" />,
  },
  {
    name: "Adicionar Cupom",
    path: "/admin/add-coupon",
    icon: <PostAdd />,
    activeIcon: <PostAdd color="primary" />,
  },
  {
    name: "Carrossel de Ofertas",
    path: "/admin/home-carousel",
    icon: <ViewCarousel />,
    activeIcon: <ViewCarousel color="primary" />,
  },
  {
    name: "Categorias Home",
    path: "/admin/shop-by-category",
    icon: <Category />,
    activeIcon: <Category color="primary" />,
  },
  {
    name: "Ofertas",
    path: "/admin/deals",
    icon: <LocalOffer />,
    activeIcon: <LocalOffer color="primary" />,
  },
  {
    name: "Controlar Categorias",
    path: "/admin/categories",
    icon: <EditNote />,
    activeIcon: <EditNote color="primary" />,
  },
];

const menu2 = [
  {
    name: "Perfil",
    path: "/admin/account",
    icon: <AccountBox />,
    activeIcon: <AccountBox color="primary" />,
  },
  {
    name: "Desconectar",
    path: "/",
    icon: <Logout />,
    activeIcon: <Logout color="primary" />,
  },
];

export const AdminDrawerList = ({ toggleDrawer }) => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <DrawerList
      menu={menu}
      menu2={menu2}
      profile={user}
      isAdmin={true}
      toggleDrawer={toggleDrawer}
    />
  );
};
