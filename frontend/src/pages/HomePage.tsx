import { Outlet } from "react-router-dom";
import ConfirmModal from "../components/modal/ConfirmModal";
import TopNavBarItemsList from "../components/topNavBar/TopNavList";
import { useAuthStore } from "../store/useAuthStore";
import SidebarItemsList from "../components/sidebar/SidebarItemList";

const HomePage = () => {
  const { authUser } = useAuthStore();
  const authUserRole = authUser?.role_name;

  return (
    <>
      <div
        className={
          authUserRole === "SUPER ADMIN"
            ? "flex h-screen bg-base-300"
            : "sticky mx-auto container mt-2"
        }
      >
        {authUserRole === "SUPER ADMIN" ? (
          <SidebarItemsList />
        ) : (
          <TopNavBarItemsList />
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto container">
            <Outlet />
          </div>
        </div>
        <ConfirmModal />
      </div>
    </>
  );
};

export default HomePage;
