// TopNavBar.tsx
import { ReactNode } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { TooltipIconButton } from "../widgets/Widgets";
import { Bell, LogOut, Settings, TestTubeIcon } from "lucide-react";
import { useWidgetStore } from "../../store/useWidgetStore";
import soiltrackLightLogo from "/DARK HORIZONTAL.png";
import soiltrackDarkLogo from "/LIGHT HORIZONTAL.png";
import { useReadingStore } from "../../store/AdminStore/useReadingStore";
import useThemeStore from "../../store/useThemeStore";

interface TopNavBarProps {
  children: ReactNode;
}

export default function TopNavBar({ children }: TopNavBarProps) {
  const { logout, authUser } = useAuthStore();
  // const { userSummary } = useUserPageHook();
  // const { analysisGeneratedCount } = useMainPageHook();
  const { aiAnalysisByPlotId } = useReadingStore();
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

  const theme = useThemeStore((state) => state.theme);

  return (
    <nav className="w-full flex items-center justify-between border-b py-4">
      {/* Logo and nav links */}
      <div className="flex items-center space-x-6">
        <img
          src={theme === "darkTheme" ? soiltrackDarkLogo : soiltrackLightLogo}
          className="w-32 h-auto"
          alt="Logo"
        />
      </div>

      <ul className="flex items-center space-x-2">{children}</ul>
      {/* User Info and Logout */}
      <div className="flex items-center space-x-2">
        <TooltipIconButton
          onClick={() => console.log("User summary: ", authUser?.role_name)}
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
