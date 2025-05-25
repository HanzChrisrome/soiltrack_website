import { CSSProperties, ReactNode } from "react";

interface CardContainerProps {
  children: ReactNode;
  className?: string;
  padding?: string; // Tailwind padding class, e.g., "p-4", "px-6 py-2"
  style?: CSSProperties;
  onClick?: () => void;
}

export default function CardContainer({
  children,
  className = "",
  padding = "p-6",
  style = {},
  onClick = () => {},
}: CardContainerProps) {
  return (
    <div
      className={`card border border-base-200 rounded-lg bg-base-100 shadow-sm ${padding} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
