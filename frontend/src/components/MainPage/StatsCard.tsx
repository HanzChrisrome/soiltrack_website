import React, { ReactNode } from "react";
import CardContainer from "../widgets/CardContainer";

type StatsCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  className?: string;
};

const StatsCard = ({ icon, label, value, className = "" }: StatsCardProps) => {
  return (
    <CardContainer
      padding="px-6 py-4"
      className={`bg-secondary border border-accent flex flex-col gap-5 ${className}`}
    >
      <div className="flex items-center gap-2">
        {icon}

        <h2 className="text-lg font-normal text-base-100">{label}</h2>
      </div>
      <div className="flex items-end gap-2">
        <h1 className="text-6xl font-bold text-base-100 leading-none">
          {value}
        </h1>
      </div>
    </CardContainer>
  );
};

export default StatsCard;
