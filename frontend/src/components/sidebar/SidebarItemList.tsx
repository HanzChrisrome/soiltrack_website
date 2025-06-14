import { Boxes, LayoutDashboard, LogOut, UserCircle2 } from "lucide-react";
import Sidebar from "./Sidebar";
import SidebarItem from "./SidebarItem";
import { useLocation, useNavigate } from "react-router-dom";
import { useWidgetStore } from "../../store/useWidgetStore";
import { useAuthStore } from "../../store/useAuthStore";

export default function SidebarItemsList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const currentPath = location.pathname;
  const { openModal } = useWidgetStore();

  const handleLogout = () => {
    console.log("Logout clicked");
    openModal({
      title: "Are you sure you want to logout?",
      confirmText: "Logout",
      icon: <LogOut className="w-4 h-4 text-white" />,
      cancelText: "Cancel",
      onConfirm: logout,
    });
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar>
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          active={currentPath === "/master/dashboard"}
          alert={false}
          onClick={() => navigate("/master/dashboard")}
        />
        <SidebarItem
          icon={<UserCircle2 size={20} />}
          text="Users"
          active={currentPath === "/users"}
          alert={false}
          onClick={() => navigate("/users")}
        />
        <SidebarItem
          icon={<Boxes size={20} />}
          text="Areas"
          active={currentPath === "/area-page"}
          alert={false}
          onClick={() => navigate("/area-page")}
        />
        <SidebarItem
          icon={<LogOut size={20} />}
          text="Logout"
          active={false}
          alert={false}
          onClick={handleLogout}
        />
      </Sidebar>
    </>
  );
}
