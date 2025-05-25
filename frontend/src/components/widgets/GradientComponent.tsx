import React from "react";

interface GradientHeadingProps {
  children: React.ReactNode;
  size?: string;
  fontWeight?: string;
  className?: string;
}

const GradientHeading: React.FC<GradientHeadingProps> = ({
  children,
  size = "text-lg",
  fontWeight = "font-semibold",
  className = "",
}) => {
  return (
    <h1
      className={`${size} ${fontWeight} too-tight-text font-semibold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent ${className}`}
    >
      {children}
    </h1>
  );
};

export default GradientHeading;
