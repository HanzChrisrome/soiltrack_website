import { ReactNode } from "react";

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active: boolean;
  alert: boolean;
  onClick?: () => void;
}

export default function SidebarItem({
  icon,
  text,
  active,
  alert,
  onClick,
}: SidebarItemProps) {
  return (
    <li
      onClick={onClick}
      className={`flex items-center py-1 cursor-pointer transition-colors ${
        active ? "text-base-100" : "text-accent hover:text-primary"
      }`}
    >
      {icon}
      <span className="text-sm ml-1">{text}</span>
    </li>
  );
}
