// TopNavBarItemsList.tsx
import { LayoutDashboard, Boxes, UserCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import TopNavBar from "./TopNav";
import TabNavItem from "./TopNavItem";

export default function TopNavBarItemsList() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  console.log("Current Path:", currentPath);

  return (
    <TopNavBar>
      <TabNavItem
        icon={<LayoutDashboard size={18} />}
        text="Dashboard"
        active={currentPath === "/admin/dashboard"}
        alert={false}
        onClick={() => navigate("admin/dashboard")}
      />
      <TabNavItem
        icon={<Boxes size={18} />}
        text="Areas"
        active={
          currentPath === "/admin/area-page" ||
          currentPath.startsWith("/admin/specific-area")
        }
        alert={false}
        onClick={() => navigate("admin/area-page")}
      />
      <TabNavItem
        icon={<UserCircle2 size={18} />}
        text="Users"
        active={currentPath === "/admin/residents"}
        alert={false}
        onClick={() => navigate("admin/residents")}
      />
    </TopNavBar>
  );
}
