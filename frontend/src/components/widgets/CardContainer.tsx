import { CSSProperties, ReactNode } from "react";

interface CardContainerProps {
  children: ReactNode;
  className?: string;
  padding?: string;
  style?: CSSProperties;
  onClick?: () => void;
  rounded?: boolean; // optional prop to toggle border radius
}

export default function CardContainer({
  children,
  className = "",
  padding = "p-6",
  style = {},
  onClick = () => {},
  rounded = true,
}: CardContainerProps) {
  return (
    <div
      className={`bg-base-100 border border-base-200 shadow-sm overflow-visible ${padding} ${
        rounded ? "rounded-lg" : ""
      } ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
