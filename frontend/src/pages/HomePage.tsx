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
            ? "flex h-screen overflow-y-hidden"
            : "flex flex-col min-h-screen h-full bg-base-300"
        }
      >
        {authUserRole === "SUPER ADMIN" ? (
          <SidebarItemsList />
        ) : (
          <div className="sticky mx-auto container mt-2">
            <TopNavBarItemsList />
          </div>
        )}

        <div className="flex-1 overflow-y-auto bg-base-100">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </div>
        <ConfirmModal />
      </div>
    </>
  );
};

export default HomePage;
