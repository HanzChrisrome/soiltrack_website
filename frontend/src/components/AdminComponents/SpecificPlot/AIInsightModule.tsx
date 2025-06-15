import React, { useState } from "react";
import CardContainer from "../../../components/widgets/CardContainer";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AIInsightModuleProps {
  title: string;
  type: "summary" | "warnings";
  data: Record<string, string | undefined> | null;
}

const AIInsightModule: React.FC<AIInsightModuleProps> = ({ title, type, data }) => {
  const [showInsights, setShowInsights] = useState(true);

  const filteredEntries = data
    ? Object.entries(data).filter(([, value]) => value !== undefined && value !== "")
    : [];

  if (filteredEntries.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-white shadow text-sm text-gray-500 italic">
        No {title.toLowerCase()} available.
      </div>
    );
  }

  const titleColorClass =
    type === "summary" ? "text-green-600" : type === "warnings" ? "text-red-600" : "text-gray-800";

  const getGridColsClass = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    return "grid-cols-1 md:grid-cols-3";
  };

  return (
    <div>
      <CardContainer className="p-4 rounded-2xl shadow-md bg-white h-full mb-2">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowInsights(!showInsights)}
        >
          <h2 className={`text-xl font-bold ${titleColorClass}`}>{title}</h2>
          <span className="text-gray-600">
            {showInsights ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </span>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            showInsights ? "max-h-[2000px] mt-4" : "max-h-0"
          }`}
        >
          <div className={`grid gap-4 ${getGridColsClass(filteredEntries.length)}`}>
            {filteredEntries.map(([key, value]) => (
              <CardContainer key={key} className="p-4 rounded-2xl shadow-md bg-gray-50 h-full">
                <h3 className="text-base font-semibold text-gray-700 capitalize">
                  {key.replace(/_/g, " ")}
                </h3>
                <p className="text-sm text-gray-800">{value}</p>
              </CardContainer>
            ))}
          </div>
        </div>
      </CardContainer>
    </div>
  );
};

export default AIInsightModule;
