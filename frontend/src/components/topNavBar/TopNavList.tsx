// TopNavBarItemsList.tsx
import { LayoutDashboard, Boxes, UserCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import TopNavBar from "./TopNav";
import TabNavItem from "./TopNavItem";

export default function TopNavBarItemsList() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  return (
    <TopNavBar>
      <TabNavItem
        icon={<LayoutDashboard size={18} />}
        text="Dashboard"
        active={currentPath === "/dashboard"}
        alert={false}
        onClick={() => navigate("/dashboard")}
      />
      <TabNavItem
        icon={<Boxes size={18} />}
        text="Areas"
        active={
          currentPath === "/area-page" ||
          currentPath.startsWith("/specific-area")
        }
        alert={false}
        onClick={() => navigate("/area-page")}
      />
      <TabNavItem
        icon={<UserCircle2 size={18} />}
        text="Users"
        active={currentPath === "/users"}
        alert={false}
        onClick={() => navigate("/users")}
      />
    </TopNavBar>
  );
}
