// components/SpecificPlot/NutrientTrends.tsx

import { useEffect, useState } from "react";
import { useReadingStore } from "../../store/useReadingStore";
import HeatmapViewContent from "./HeatmapViewContent";
import { getWeeklyHeatmapData } from "../../utils/NutrientTrendsUtil";
import CardContainer from "../widgets/CardContainer";
import { Skeleton, ToggleSelector } from "../widgets/Widgets";
import NutrientChart from "./NutrientCharts";
import GradientHeading from "../widgets/GradientComponent";
import { FilterIcon } from "lucide-react";

type NutrientTrendsProps = {
  plotId: number;
};

const NutrientTrends = ({ plotId }: NutrientTrendsProps) => {
  const {
    fetchPlotNutrients,
    getPlotNutrientsTrend,
    fetchCustomDatePlotNutrients,
    setCustomPlotNutrientsTrends,
    customPlotNutrientsTrends,
  } = useReadingStore();

  const [selectedRange, setSelectedRange] = useState<
    "1D" | "7D" | "1M" | "3M" | "Custom"
  >("1D");

  const [viewMode, setViewMode] = useState<"heatmap" | "line">("line");

  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (customStartDate && !customEndDate) {
      setSelectedRange("Custom");
      setCustomEndDate(customStartDate);
    } else if (customStartDate && customEndDate) {
      setSelectedRange("Custom");
    }
  }, [customStartDate, customEndDate]);

  useEffect(() => {
    const formatDate = (date: Date) => date.toISOString().split("T")[0];
    const now = new Date();
    const start = new Date();
    start.setMonth(now.getMonth() - 3);
    const startDate = formatDate(start);
    const endDate = formatDate(now);

    const loadData = async () => {
      setIsLoading(true);

      if (selectedRange === "Custom" && customStartDate && customEndDate) {
        await fetchCustomDatePlotNutrients(
          plotId,
          customStartDate,
          customEndDate
        );
        setIsLoading(false);
        return;
      }

      if (selectedRange !== "Custom") {
        setCustomPlotNutrientsTrends(null);
      }

      const hasData = getPlotNutrientsTrend(plotId);
      if (!hasData) {
        await fetchPlotNutrients(plotId, startDate, endDate);
      }

      setIsLoading(false);
    };

    loadData();
  }, [
    selectedRange,
    customStartDate,
    customEndDate,
    plotId,
    fetchPlotNutrients,
    getPlotNutrientsTrend,
    fetchCustomDatePlotNutrients,
    setCustomPlotNutrientsTrends,
  ]);

  const trendDataForHeatMap = getPlotNutrientsTrend(plotId);
  const trendDataRaw =
    selectedRange === "Custom"
      ? customPlotNutrientsTrends
      : getPlotNutrientsTrend(plotId);

  const now = new Date();
  let filteredTrendData = trendDataRaw ?? [];

  if (selectedRange !== "Custom" && trendDataRaw) {
    if (selectedRange === "1D") {
      const todayISO = now.toISOString().split("T")[0];
      filteredTrendData = trendDataRaw.filter((entry) =>
        entry.reading_date.startsWith(todayISO)
      );
    } else {
      const daysMap: Record<string, number> = {
        "7D": 7,
        "1M": 30,
        "3M": 90,
      };
      const days = daysMap[selectedRange];
      const cutoffDate = new Date();
      cutoffDate.setDate(now.getDate() - days);

      filteredTrendData = trendDataRaw.filter((entry) => {
        const entryDate = new Date(entry.reading_date);
        return entryDate >= cutoffDate;
      });
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="mb-4 px-5">
              <Skeleton className="h-14 w-1/2 mb-2" />
              <Skeleton className="h-40 w-full" />
            </div>
          ))
        ) : (
          <CardContainer className="flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <GradientHeading className="text-2xl font-bold">
                Nutrient Trends
              </GradientHeading>
              <div className="flex items-center">
                <ToggleSelector
                  options={["line", "heatmap"]}
                  selected={viewMode}
                  onSelect={(val) => setViewMode(val as "line" | "heatmap")}
                  labelMap={{ line: "Line Chart", heatmap: "7D Heatmap View" }}
                />
                {viewMode === "line" && (
                  <div className="flex items-center">
                    <CardContainer
                      padding="px-1 py-0.5 ml-2"
                      className="flex flex-row items-center gap-1 bg-primary border-none rounded-xl"
                    >
                      {["1D", "7D", "1M", "3M"].map((option) => {
                        const isSelected = option === selectedRange;
                        return isSelected ? (
                          <CardContainer
                            key={option}
                            padding="px-3 py-1"
                            className="bg-accent border border-none"
                          >
                            <span className="text-sm text-primary">
                              {option}
                            </span>
                          </CardContainer>
                        ) : (
                          <div
                            key={option}
                            className="px-3 py-1 cursor-pointer"
                            onClick={() =>
                              setSelectedRange(
                                option as "1D" | "7D" | "1M" | "3M"
                              )
                            }
                          >
                            <span className="text-sm text-base-100">
                              {option}
                            </span>
                          </div>
                        );
                      })}
                    </CardContainer>
                    <div className="dropdown dropdown-start relative">
                      <div
                        tabIndex={0}
                        role="button"
                        className="dropdown dropdown-start flex flex-row items-center ml-3 gap-2 px-3 py-2 bg-base-100 border border-base-200 shadow-sm rounded-lg cursor-pointer hover:bg-base-300 transition"
                      >
                        <FilterIcon className="w-4 h-4 text-base-content" />
                        <span className="text-sm text-base-content">
                          Filter by Date
                        </span>
                      </div>
                      <div
                        tabIndex={0}
                        className="dropdown-content menu absolute right-0 mt-2 bg-white border border-base-200 rounded-lg shadow-lg p-4 z-10 flex flex-col gap-4 min-w-[220px]"
                      >
                        <label className="text-sm text-neutral">
                          Start Date
                          <input
                            type="date"
                            className="block mt-1 border border-base-200 rounded px-2 py-1 w-full"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                          />
                        </label>
                        <label className="text-sm text-neutral">
                          End Date
                          <input
                            type="date"
                            className="block mt-1 border border-base-200 rounded px-2 py-1 w-full"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {viewMode === "heatmap" ? (
              <>
                <HeatmapViewContent
                  variant="weekly"
                  nutrient="moisture"
                  data={getWeeklyHeatmapData(
                    trendDataForHeatMap ?? [],
                    "moisture"
                  )}
                />
                <HeatmapViewContent
                  variant="weekly"
                  nutrient="nitrogen"
                  data={getWeeklyHeatmapData(
                    trendDataForHeatMap ?? [],
                    "nitrogen"
                  )}
                />
                <HeatmapViewContent
                  variant="weekly"
                  nutrient="potassium"
                  data={getWeeklyHeatmapData(
                    trendDataForHeatMap ?? [],
                    "potassium"
                  )}
                />
                <HeatmapViewContent
                  variant="weekly"
                  nutrient="phosphorus"
                  data={getWeeklyHeatmapData(
                    trendDataForHeatMap ?? [],
                    "phosphorus"
                  )}
                />
              </>
            ) : (
              ["moisture", "nitrogen", "phosphorus", "potassium"].map(
                (nutrient) => {
                  const nutrientData = filteredTrendData.map((entry) => ({
                    x: new Date(entry.reading_date).toISOString(),
                    y: Number(entry[nutrient as keyof typeof entry] ?? 0),
                  }));

                  const colorMap: Record<string, string> = {
                    moisture: "#3b82f6",
                    nitrogen: "#fde047",
                    phosphorus: "#a78bfa",
                    potassium: "#f472b6",
                  };

                  return (
                    <NutrientChart
                      key={nutrient}
                      title={
                        nutrient.charAt(0).toUpperCase() + nutrient.slice(1)
                      }
                      chartSeries={[
                        {
                          name: nutrient,
                          data: nutrientData,
                          color: colorMap[nutrient],
                        },
                      ]}
                      selectedRange={selectedRange}
                    />
                  );
                }
              )
            )}
          </CardContainer>
        )}
      </div>
    </>
  );
};

export default NutrientTrends;
