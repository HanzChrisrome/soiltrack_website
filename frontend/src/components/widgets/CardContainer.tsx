import { ReactNode } from "react";

interface CardContainerProps {
  children: ReactNode;
  className?: string;
  padding?: string; // Tailwind padding class, e.g., "p-4", "px-6 py-2"
}

export default function CardContainer({
  children,
  className = "",
  padding = "p-6", // Default padding
}: CardContainerProps) {
  return (
    <div
      className={`card border border-neutral bg-base-100 w-full flex flex-col ${padding} ${className}`}
    >
      {children}
    </div>
  );
}
