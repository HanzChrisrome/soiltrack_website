import { Outlet } from "react-router-dom";
import SidebarItemsList from "../components/sidebar/SidebarItemList";
import ConfirmModal from "../components/modal/ConfirmModal";

const HomePage = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="sticky mx-auto container mt-2">
        <SidebarItemsList />
      </div>

      <div className="flex-1 overflow-y-auto bg-base-100">
        <div className="mx-auto container">
          <Outlet />
        </div>
      </div>
      <ConfirmModal />
    </div>
  );
};

export default HomePage;
