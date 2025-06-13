import React from "react";
import useThemeStore from "../../store/useThemeStore"; // Adjust the path if needed

interface GradientHeadingProps {
  children: React.ReactNode;
  fontWeight?: string;
  className?: string;
}

const GradientHeading: React.FC<GradientHeadingProps> = ({
  children,
  fontWeight = "font-semibold",
  className = "",
}) => {
  const theme = useThemeStore((state) => state.theme);

  const gradientClass =
    theme === "darkTheme"
      ? "bg-gradient-to-r from-green-500 to-green-600"
      : "bg-gradient-to-r from-green-700 to-green-900";

  return (
    <h1
      className={`${fontWeight} too-tight-text font-semibold ${gradientClass} bg-clip-text text-transparent ${className}`}
    >
      {children}
    </h1>
  );
};

export default GradientHeading;
