// MetricCard.tsx
import { InfoIcon } from "lucide-react";
import { TooltipIcon } from "../../../widgets/Widgets";
import CardContainer from "../../../widgets/CardContainer";

type MetricCardProps = {
  title: string;
  tooltip: string;
  value: string | number;
  diff: number;
};

const DiffIndicator = ({ diff }: { diff: number }) => {
  if (diff === 0 || isNaN(diff)) return null;

  const isUp = diff > 0;
  const sign = isUp ? "+" : "-";
  const color = isUp ? "text-green-600" : "text-red-600";
  const arrow = isUp ? "▲" : "▼";

  return (
    <span className={`ml-2 text-sm font-medium ${color}`}>
      {arrow} {sign}
      {Math.abs(diff).toFixed(2)}
    </span>
  );
};

const MetricCard = ({ title, tooltip, value, diff }: MetricCardProps) => (
  <CardContainer className="h-full flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center space-x-2">
          <h1 className="text-md font-medium leading-tight text-neutral-800">
            {title}
          </h1>
          <TooltipIcon
            content={tooltip}
            icon={<InfoIcon className="w-5 h-5" />}
          />
        </div>
        <p className="text-4xl font-semibold text-neutral-700 mt-5">
          {value} <DiffIndicator diff={diff} />
        </p>
      </div>
    </div>
  </CardContainer>
);

export default MetricCard;
