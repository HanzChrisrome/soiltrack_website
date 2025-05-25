import { ReactNode } from "react";

import soiltrackLogo from "/soiltrack_icon.png";
import { useAuthStore } from "../../store/useAuthStore";
import CardContainer from "../widgets/CardContainer";
import { TooltipIconButton } from "../widgets/Widgets";
import { useWidgetStore } from "../../store/useWidgetStore";
import { LogOut } from "lucide-react";

import containerBg from "/container background2.png";
import { useReadingStore } from "../../store/useReadingStore";

interface SidebarProps {
  children: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const { logout } = useAuthStore();
  const { authUser } = useAuthStore();
  const { userPlots, userSummary, plotReadingsByPlotId, plotNutrientsTrends } =
    useReadingStore();
  const { openModal } = useWidgetStore();

  const handleLogout = () => {
    openModal({
      title: "Are you sure you want to logout?",
      confirmText: "Logout",
      icon: <LogOut className="w-4 h-4 text-white" />,
      cancelText: "Cancel",
      onConfirm: () => {
        logout();
      },
    });
  };

  return (
    <nav
      className="bg-cover bg-no-repeat bg-center w-full flex items-center justify-between shadow-sm px-6 py-4 rounded-3xl"
      style={{
        backgroundImage: `url(${containerBg})`,
      }}
    >
      <div className="flex items-center">
        <img src={soiltrackLogo} className="w-9 h-auto mr-4" />
        <ul className="flex items-center space-x-8 bg-transparent border border-secondary px-7 py-3 rounded-2xl">
          {children}
        </ul>
      </div>

      <div className="flex flex-row items-center space-x-2">
        <CardContainer
          padding="py-1 px-4"
          className="flex flex-col text-sm leading-tight bg-primary shadow-none border border-secondary"
        >
          <h4 className="font-semibold text-base-100">
            {authUser
              ? `Hi, ${authUser.user_fname} ${authUser.user_lname}`
              : "Guest User"}
          </h4>
          <span className="text-xs text-base-100">
            {authUser?.user_email || "sample@gmail.com"}
          </span>
        </CardContainer>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
          onClick={() => {
            console.log("User Plots:", plotNutrientsTrends);
            console.log("Per Plot Readings:", plotReadingsByPlotId);
          }}
        >
          Test Button
        </button>
        <TooltipIconButton tooltip="Logout" onClick={() => handleLogout()}>
          <CardContainer padding="py-3 px-3 flex items-center justify-center">
            <LogOut className="w-4 h-4 text-neutral" />
          </CardContainer>
        </TooltipIconButton>
      </div>
    </nav>
  );
}
