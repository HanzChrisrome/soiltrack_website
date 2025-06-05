import { ReactNode } from "react";

interface TopNavItemProps {
  icon: ReactNode;
  text: string;
  active: boolean;
  alert: boolean;
  onClick?: () => void;
}

export default function TopNavItem({ text, active, onClick }: TopNavItemProps) {
  return (
    <li
      onClick={onClick}
      className={`flex items-center rounded-full cursor-pointer px-5 py-3 transition-all duration-200 ${
        active
          ? "bg-gradient-to-r from-primary to-secondary text-base-100"
          : "text-gray-600 hover:text-primary bg-base-100"
      }`}
    >
      <span className="text-md font-medium">{text}</span>
    </li>
  );
}
