import { Outlet } from "react-router-dom";
import ConfirmModal from "../components/modal/ConfirmModal";
import TopNavBarItemsList from "../components/topNavBar/topNavList";

const HomePage = () => {
  return (
    <div className="flex flex-col h-screen bg-base-300">
      <div className="sticky mx-auto container mt-2">
        <TopNavBarItemsList />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto container">
          <Outlet />
        </div>
      </div>
      <ConfirmModal />
    </div>
  );
};

export default HomePage;
