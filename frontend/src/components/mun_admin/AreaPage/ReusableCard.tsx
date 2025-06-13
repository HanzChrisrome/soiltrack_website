import React, { ReactNode } from "react";
import CardContainer from "../../widgets/CardContainer";
import GradientHeading from "../../widgets/GradientComponent";

interface ReusableCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  padding?: string;
  children: ReactNode;
}

const ReusableCard: React.FC<ReusableCardProps> = ({
  title,
  subtitle,
  icon,
  padding = "px-4 py-3",
  children,
}) => {
  return (
    <CardContainer padding={padding}>
      <div className="flex items-center justify-between relative">
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-col items-start">
            <GradientHeading className="text-lg">{title}</GradientHeading>
            {subtitle && (
              <span className="text-xs text-gray-500">{subtitle}</span>
            )}
          </div>
          <CardContainer padding="p-1">
            <span className="text-green-700">{icon}</span>
          </CardContainer>
        </div>
      </div>
      {children}
    </CardContainer>
  );
};

export default ReusableCard;
