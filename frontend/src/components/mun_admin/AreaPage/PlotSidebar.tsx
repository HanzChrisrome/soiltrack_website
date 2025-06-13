import CardContainer from "../../widgets/CardContainer";
import NutrientsCard from "./NutrientsChart";
import { useReadingStore } from "../../../store/mun_admin/useReadingStore";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  ExpandIcon,
  LandPlot,
  Layers,
  LeafyGreen,
  UserCheck,
} from "lucide-react";
import GradientHeading from "../../widgets/GradientComponent";
import LabelCard from "./LabelCard";
import { useNavigate } from "react-router-dom";
import { Skeleton, TooltipIconButton } from "../../widgets/Widgets";
import { DailyReading } from "../../../models/readingStoreModels";

type Plot = {
  id: number;
  name: string;
  soilType: string;
  cropType: string;
  area: string;
  color: string;
  ownerName: string;
};

type PlotSidebarProps = {
  plot: Plot | null;
  visible: boolean;
  onClose: () => void;
};

export default function PlotSidebar({
  plot,
  visible,
  onClose,
}: PlotSidebarProps) {
  const {
    isLoadingPlotNutrients,
    aiAnalysisByPlotId,
    isLoadingAiAnalysis,
    setSelectedPlotId,
    fetchAiAnalysis,
    fetchPlotNutrients,
    plotNutrientsTrends,
  } = useReadingStore();

  const navigate = useNavigate();
  const [readings, setReadings] = useState<DailyReading[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (plot && visible) {
        const endDate = dayjs().format("YYYY-MM-DD");
        const startDate = dayjs().subtract(6, "day").format("YYYY-MM-DD");
        fetchPlotNutrients(plot.id, startDate, endDate);
        fetchAiAnalysis(plot.id);
        const nutrientData = plotNutrientsTrends?.[plot.id] ?? null;
        setReadings(nutrientData);
      }
    }

    fetchData();
  }, [plot, visible, fetchPlotNutrients, fetchAiAnalysis, plotNutrientsTrends]);

  const readingsArray = readings ?? [];

  function getSeriesData(
    mapFn: (r: DailyReading) => number | null
  ): (number | null)[] {
    const dataWithNulls = readingsArray.map(mapFn);
    if (!dataWithNulls.some((v) => v !== null)) return [];
    return dataWithNulls;
  }

  const aiSummary =
    plot?.id && aiAnalysisByPlotId ? aiAnalysisByPlotId[plot.id] : null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-50 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[750px] bg-base-300 shadow-lg z-50
        transform transition-transform duration-300
        ${visible ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 flex flex-col h-full">
          {plot ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CardContainer padding="p-2">
                    <Layers className="w-5 h-5 text-green-700" />
                  </CardContainer>
                  <GradientHeading className="text-xl">
                    {plot.name}
                  </GradientHeading>
                  <CardContainer padding="px-3 py-1 ml-2">
                    <span className="text-sm"> Area size: {plot.area}</span>
                  </CardContainer>
                  <TooltipIconButton
                    tooltip="View more details"
                    onClick={() => {
                      setSelectedPlotId(plot.id);
                      navigate("/specific-area");
                    }}
                    tooltipRoundedClass="rounded-sm"
                  >
                    <div className="p-3 bg-white rounded-full">
                      <ExpandIcon className="w-4 h-4 text-neutral" />
                    </div>
                  </TooltipIconButton>
                </div>

                <CardContainer padding="py-2 px-3">
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-black"
                  >
                    ✕
                  </button>
                </CardContainer>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <LabelCard
                  icon={<LandPlot className="w-4 h-4" />}
                  title="Soil Type"
                  label={plot.soilType}
                />
                <LabelCard
                  icon={<LeafyGreen className="w-4 h-4" />}
                  title="Crop Planted"
                  label={plot.cropType ?? "Not specified"}
                />
                <LabelCard
                  icon={<UserCheck className="w-4 h-4" />}
                  title="Plot Owner"
                  label={plot.ownerName}
                />
              </div>

              {isLoadingAiAnalysis ? (
                <Skeleton className="h-24 w-full" />
              ) : (
                <CardContainer className="mt-4">
                  {aiSummary === null ||
                  (Array.isArray(aiSummary) && aiSummary.length === 0) ? (
                    <span className="text-gray-500">
                      Analysis has not been generated for this plot.
                    </span>
                  ) : (
                    <span className="text-green-700 font-medium">
                      Analysis for this plot has been generated by the
                      owner/user.
                    </span>
                  )}
                </CardContainer>
              )}

              <div className="grid grid-cols-2 gap-3 mt-3">
                {isLoadingPlotNutrients || !readings ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-48 w-full" />
                  ))
                ) : (
                  <>
                    <NutrientsCard
                      title="Moisture"
                      badgeStyle="badge-success"
                      chartSeries={[
                        {
                          name: "Moisture",
                          data: getSeriesData((r) => r.avg_moisture),
                          color: "#3B82F6",
                        },
                      ]}
                      chartCategories={readingsArray.map((r) =>
                        dayjs(r.reading_date).format("MMM D")
                      )}
                    />
                    <NutrientsCard
                      title="Nitrogen"
                      badgeStyle="badge-warning"
                      chartSeries={[
                        {
                          name: "Nitrogen",
                          data: getSeriesData((r) => r.avg_nitrogen),
                          color: "#FACC15",
                        },
                      ]}
                      chartCategories={readingsArray.map((r) =>
                        dayjs(r.reading_date).format("MMM D")
                      )}
                    />
                    <NutrientsCard
                      title="Potassium"
                      badgeStyle="badge-pink"
                      chartSeries={[
                        {
                          name: "Potassium",
                          data: getSeriesData((r) => r.avg_potassium),
                          color: "#EC4899",
                        },
                      ]}
                      chartCategories={readingsArray.map((r) =>
                        dayjs(r.reading_date).format("MMM D")
                      )}
                    />
                    <NutrientsCard
                      title="Phosphorus"
                      badgeStyle="badge-purple"
                      chartSeries={[
                        {
                          name: "Phosphorus",
                          data: getSeriesData((r) => r.avg_phosphorus),
                          color: "#8B5CF6",
                        },
                      ]}
                      chartCategories={readingsArray.map((r) =>
                        dayjs(r.reading_date).format("MMM D")
                      )}
                    />
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No plot selected
            </div>
          )}
        </div>
      </div>
    </>
  );
}
