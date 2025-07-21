import {
  AccountBalanceWallet,
  AccountBox,
  Add,
  Dashboard,
  Inventory,
  Logout,
  ShoppingBag,
} from "@mui/icons-material";
import { DrawerList } from "../../../components/DrawerList";

const menu = [
  {
    name: "Dashboard",
    path: "/seller",
    icon: <Dashboard />,
    activeIcon: <Dashboard color="primary" />,
  },
  {
    name: "Pedidos",
    path: "/seller/orders",
    icon: <ShoppingBag />,
    activeIcon: <ShoppingBag color="primary" />,
  },
  {
    name: "Produtos",
    path: "/seller/products",
    icon: <Inventory />,
    activeIcon: <Inventory color="primary" />,
  },
  {
    name: "Adicionar Produto",
    path: "/seller/add-product",
    icon: <Add />,
    activeIcon: <Add color="primary" />,
  },
  {
    name: "Pagamentos",
    path: "/seller/payments",
    icon: <AccountBalanceWallet />,
    activeIcon: <AccountBalanceWallet color="primary" />,
  },
];

const menu2 = [
  {
    name: "Perfil",
    path: "/seller/account",
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

export const SellerDrawerList = ({ toggleDrawer, sellerProfile }) => {
  return (
    <DrawerList
      menu={menu}
      menu2={menu2}
      toggleDrawer={toggleDrawer}
      profile={sellerProfile}
    />
  );
};
