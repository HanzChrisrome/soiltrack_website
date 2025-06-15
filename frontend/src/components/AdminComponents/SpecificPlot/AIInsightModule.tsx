import React, { useState } from "react";
import CardContainer from "../../../components/widgets/CardContainer";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AISummary {
  findings?: string;
  predictions?: string;
  recommendations?: string;
}

interface AIInsightModuleProps {
  summary: AISummary | null;
}

const AIInsightModule: React.FC<AIInsightModuleProps> = ({ summary }) => {
  const [showInsights, setShowInsights] = useState(true);

  if (!summary || (!summary.findings && !summary.predictions && !summary.recommendations)) {
    return (
      <div className="p-4 rounded-xl bg-white shadow text-sm text-gray-500 italic">
        No analysis data available.
      </div>
    );
  }

  return (
    <div>
        <CardContainer className="p-4 rounded-2xl shadow-md bg-white h-full mb-2">
        <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowInsights(!showInsights)}
        >
            <h2 className="text-xl font-bold text-primary">Plot Findings</h2>
            <span className="text-gray-600">
            {showInsights ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </span>
        </div>

        <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
            showInsights ? "max-h-[2000px] mt-4" : "max-h-0"
            }`}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summary.findings && (
                <CardContainer className="p-4 rounded-2xl shadow-md bg-gray-50 h-full">
                <h3 className="text-base font-semibold text-gray-700">Findings</h3>
                <p className="text-sm text-gray-800">{summary.findings}</p>
                </CardContainer>
            )}
            {summary.predictions && (
                <CardContainer className="p-4 rounded-2xl shadow-md bg-gray-50 h-full">
                <h3 className="text-base font-semibold text-gray-700">Predictions</h3>
                <p className="text-sm text-gray-800">{summary.predictions}</p>
                </CardContainer>
            )}
            {summary.recommendations && (
                <CardContainer className="p-4 rounded-2xl shadow-md bg-gray-50 h-full">
                <h3 className="text-base font-semibold text-gray-700">Recommendations</h3>
                <p className="text-sm text-gray-800">{summary.recommendations}</p>
                </CardContainer>
            )}
            </div>
        </div>
        </CardContainer>
    </div>
  );
};

export default AIInsightModule;
