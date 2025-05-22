import { Outlet } from "react-router-dom";
import SidebarItemsList from "../components/sidebar/SidebarItemList";

const HomePage = () => {
  return (
    <div className="flex h-screen overflow-y-hidden">
      <SidebarItemsList />

      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default HomePage;
