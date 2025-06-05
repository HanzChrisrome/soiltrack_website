// TopNavBar.tsx
import { ReactNode } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { TooltipIconButton } from "../widgets/Widgets";
import { Bell, LogOut, Settings, TestTubeIcon } from "lucide-react";
import { useWidgetStore } from "../../store/useWidgetStore";
import soiltrackLogo from "/DARK HORIZONTAL.png";
import useUserPageHook from "../../hooks/useUserPage";

interface TopNavBarProps {
  children: ReactNode;
}

export default function TopNavBar({ children }: TopNavBarProps) {
  const { logout } = useAuthStore();
  const { userSummary } = useUserPageHook();
  const { openModal } = useWidgetStore();

  const handleLogout = () => {
    openModal({
      title: "Are you sure you want to logout?",
      confirmText: "Logout",
      icon: <LogOut className="w-4 h-4 text-white" />,
      cancelText: "Cancel",
      onConfirm: logout,
    });
  };

  return (
    <nav className="w-full flex items-center justify-between border-b py-4">
      {/* Logo and nav links */}
      <div className="flex items-center space-x-6">
        <img src={soiltrackLogo} className="w-32 h-auto" alt="Logo" />
      </div>

      <ul className="flex items-center space-x-2">{children}</ul>
      {/* User Info and Logout */}
      <div className="flex items-center space-x-2">
        <TooltipIconButton
          onClick={() => console.log("User summary: ", userSummary)}
          tooltip="Notifications"
        >
          <div className="p-3 bg-white rounded-full">
            <TestTubeIcon className="w-4 h-4 text-neutral" />
          </div>
        </TooltipIconButton>
        <TooltipIconButton tooltip="Notifications">
          <div className="p-3 bg-white rounded-full">
            <Bell className="w-4 h-4 text-neutral" />
          </div>
        </TooltipIconButton>
        <TooltipIconButton tooltip="Settings">
          <div className="p-3 bg-white rounded-full">
            <Settings className="w-4 h-4 text-neutral" />
          </div>
        </TooltipIconButton>
        <TooltipIconButton tooltip="Logout" onClick={handleLogout}>
          <div className="p-3 bg-white rounded-full">
            <LogOut className="w-4 h-4 text-neutral" />
          </div>
        </TooltipIconButton>
      </div>
    </nav>
  );
}
