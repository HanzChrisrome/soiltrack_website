import { Boxes, LayoutDashboard, LogOut, UserCircle2 } from "lucide-react";
import Sidebar from "./Sidebar";
import SidebarItem from "./SidebarItem";
import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";
import ConfirmModal from "../modal/ConfirmModal";
import { useLocation, useNavigate } from "react-router-dom";

export default function SidebarItemsList() {
  const { logout } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar>
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          active={currentPath === "/dashboard"}
          alert={false}
          onClick={() => navigate("/dashboard")}
        />

        <SidebarItem
          icon={<Boxes size={20} />}
          text="Areas"
          active={
            currentPath === "/area-page" || currentPath === "/specific-area"
          }
          alert={false}
          onClick={() => navigate("/area-page")}
        />
        <SidebarItem
          icon={<UserCircle2 size={20} />}
          text="Users"
          active={currentPath === "/users"}
          alert={false}
          onClick={() => navigate("/users")}
        />
        {/* <SidebarItem
          icon={<LogOut size={20} />}
          text="Logout"
          active={false}
          alert={false}
          onClick={() => setShowLogoutModal(true)} // Show modal on click
        /> */}
      </Sidebar>
    </>
  );
}
