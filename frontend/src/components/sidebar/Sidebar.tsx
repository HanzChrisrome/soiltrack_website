import { ChevronFirst, ChevronLast } from "lucide-react";
import { ReactNode } from "react";

import soiltrackLogo from "/DARK HORIZONTAL.png";
import { useSidebarStore } from "../../store/useSidebarStore";

interface SidebarProps {
  children: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const { expanded, toggleExpanded } = useSidebarStore();

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-base-100 border-r">
        <div className="px-4 py-6 flex justify-between items-center">
          <img
            src={soiltrackLogo}
            className={`overflow-hidden transition-all ${
              expanded ? "w-28" : "w-0"
            }`}
          />
          <button
            onClick={toggleExpanded}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <ul className="flex-1 px-3"> {children} </ul>
      </nav>
    </aside>
  );
}
