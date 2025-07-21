import { useEffect } from "react";
import { AdminRoutes } from "../../routes/AdminRoutes";
import { useAppDispatch } from "../../state/store";
import { AdminDrawerList } from "../component/dashboard/AdminDrawerList";
import { getHomeCategory } from "../../state/admin/adminSlice";

export const AdminDashboard = () => {
  const toggleDrawer = () => {};
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getHomeCategory());
  }, [dispatch]);

  return (
    <section className="lg:flex h-screen">
      <aside
        className="hidden lg:block h-full min-w-64 border-r border-r-black/10"
        aria-label="Menu do vendedor"
      >
        <AdminDrawerList toggleDrawer={toggleDrawer} />
      </aside>

      <main className="w-full overflow-y-auto p-4">
        <section className="w-full h-full">
          <AdminRoutes />
        </section>
      </main>
    </section>
  );
};
