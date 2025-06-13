import React from "react";
import CardContainer from "../../widgets/CardContainer";

interface LabelCardProps {
  icon: React.ReactNode;
  title: string;
  label: string;
}

const LabelCard: React.FC<LabelCardProps> = ({ icon, title, label }) => {
  return (
    <CardContainer>
      <div className="flex flex-col items-start justify-center h-full w-full">
        <div className="flex items-center justify-between w-full gap-2">
          <h3 className="text-md font-normal text-neutral">{title}</h3>
          <div className="p-1 bg-white rounded flex items-center justify-center">
            <CardContainer padding="p-1">
              <span className="text-green-700">{icon}</span>
            </CardContainer>
          </div>
        </div>
        <h1 className="text-xl font-semibold">{label}</h1>
      </div>
    </CardContainer>
  );
};

export default LabelCard;
