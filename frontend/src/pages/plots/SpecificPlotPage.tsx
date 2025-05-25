import { useEffect } from "react";
import NutrientChart from "../../components/SpecificPlot/NutrientCharts";
import CardContainer from "../../components/widgets/CardContainer";
import { useReadingStore } from "../../store/useReadingStore";

const SpecificPlotPage = () => {
  const { selectedPlotId, fetchPlotNutrients, getPlotNutrientsTrend } =
    useReadingStore();

  useEffect(() => {
    if (!selectedPlotId) return;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 3);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    const hasData = getPlotNutrientsTrend(selectedPlotId);
    if (!hasData) {
      fetchPlotNutrients(selectedPlotId, formattedStartDate, formattedEndDate);
    }
  }, [selectedPlotId, fetchPlotNutrients, getPlotNutrientsTrend]);

  const trendDataRaw = selectedPlotId
    ? getPlotNutrientsTrend(selectedPlotId)
    : null;

  if (!trendDataRaw) return null;

  const todayISO = new Date().toISOString().split("T")[0];

  const filteredTrendData = trendDataRaw.filter((entry) =>
    entry.reading_date.startsWith(todayISO)
  );

  return (
    <div className="h-full">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-2">
          <div className="col-span-2">
            {filteredTrendData.length > 0 && (
              <CardContainer padding="p-3">
                <div className="flex justify-between items-center mb-4">
                  <h1>Nutrients Trends</h1>
                  <div className="flex items-center">
                    <CardContainer
                      padding="px-1 py-0.5"
                      className="flex flex-row items-center gap-1 bg-primary border-none rounded-xl"
                    >
                      {["1D", "7D", "1M", "3M"].map((option) => {
                        const isSelected = option === "3M";
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
                          <div key={option} className="px-3 py-1">
                            <span className="text-sm text-base-100">
                              {option}
                            </span>
                          </div>
                        );
                      })}
                    </CardContainer>
                  </div>
                </div>

                <div className="flex flex-col">
                  {["moisture", "nitrogen", "phosphorus", "potassium"].map(
                    (nutrient) => {
                      const nutrientData = filteredTrendData.map((entry) =>
                        Number(entry[nutrient as keyof typeof entry] ?? 0)
                      );
                      const categories = filteredTrendData.map((entry) =>
                        new Date(entry.reading_date).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          }
                        )
                      );

                      const colorMap: Record<string, string> = {
                        moisture: "#3b82f6",
                        nitrogen: "#10b981",
                        phosphorus: "#f59e0b",
                        potassium: "#ef4444",
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
                          chartCategories={categories}
                        />
                      );
                    }
                  )}
                </div>
              </CardContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificPlotPage;
