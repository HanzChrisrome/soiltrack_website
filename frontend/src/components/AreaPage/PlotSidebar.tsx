import CardContainer from "../widgets/CardContainer";
import NutrientsCard from "./NutrientsChart";
import { useReadingStore } from "../../store/useReadingStore";
import dayjs from "dayjs";
import { useEffect } from "react";
import {
  ExpandIcon,
  LandPlot,
  Layers,
  LeafyGreen,
  UserCheck,
} from "lucide-react";
import GradientHeading from "../widgets/GradientComponent";
import LabelCard from "./LabelCard";
import { useNavigate } from "react-router-dom";

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

type DailyReading = {
  date: string;
  moisture: number | null;
  nitrogen: number | null;
  phosphorus: number | null;
  potassium: number | null;
};

function transformPlotReadings(
  raw: {
    dates: string[];
    moisture: number[];
    nitrogen: number[];
    phosphorus: number[];
    potassium: number[];
  } | null
): DailyReading[] {
  if (
    !raw ||
    !raw.dates ||
    !raw.moisture ||
    !raw.nitrogen ||
    !raw.phosphorus ||
    !raw.potassium
  ) {
    return [];
  }

  return raw.dates.map((date, idx) => ({
    date,
    moisture: raw.moisture[idx] ?? null,
    nitrogen: raw.nitrogen[idx] ?? null,
    phosphorus: raw.phosphorus[idx] ?? null,
    potassium: raw.potassium[idx] ?? null,
  }));
}

export default function PlotSidebar({
  plot,
  visible,
  onClose,
}: PlotSidebarProps) {
  const { getPlotReadings, fetchNutrientsReadings, setSelectedPlotId } =
    useReadingStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (plot && visible) {
      const endDate = dayjs().format("YYYY-MM-DD");
      const startDate = dayjs().subtract(6, "day").format("YYYY-MM-DD");
      fetchNutrientsReadings(plot.id, startDate, endDate);
    }
  }, [plot, visible, fetchNutrientsReadings]);

  const rawReadings = plot?.id ? getPlotReadings(plot.id) : null;
  const readingsArray: DailyReading[] = transformPlotReadings(
    rawReadings && !Array.isArray(rawReadings) ? rawReadings : null
  );

  function getSeriesData(
    mapFn: (r: (typeof readingsArray)[number]) => number | null
  ): (number | null)[] {
    const dataWithNulls = readingsArray.map(mapFn);
    if (!dataWithNulls.some((v: number | null) => v !== null)) return [];
    return dataWithNulls;
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-50 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[750px] bg-white shadow-lg z-50
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
                  <GradientHeading size="text-2xl">{plot.name}</GradientHeading>
                  <CardContainer padding="px-3 py-1 ml-2">
                    <span className="text-sm"> Area size: {plot.area}</span>
                  </CardContainer>
                  <CardContainer
                    onClick={() => {
                      setSelectedPlotId(plot.id);
                      navigate("/specific-area");
                    }}
                    padding="py-2 px-3 hover:cursor-pointer"
                  >
                    <ExpandIcon className="w-4 h-4 text-gray-500" />
                  </CardContainer>
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
              <div className="grid grid-cols-2 gap-3 mt-3">
                <NutrientsCard
                  title="Moisture"
                  badgeStyle="badge-success"
                  chartSeries={[
                    {
                      name: "Moisture",
                      data: getSeriesData((r) => r.moisture),
                      color: "#3B82F6", // Blue
                    },
                  ]}
                  chartCategories={readingsArray.map((r) =>
                    dayjs(r.date).format("MMM D")
                  )}
                />

                <NutrientsCard
                  title="Nitrogen"
                  badgeStyle="badge-warning"
                  chartSeries={[
                    {
                      name: "Nitrogen",
                      data: getSeriesData((r) => r.nitrogen),
                      color: "#FACC15", // Yellow
                    },
                  ]}
                  chartCategories={readingsArray.map((r) =>
                    dayjs(r.date).format("MMM D")
                  )}
                />

                <NutrientsCard
                  title="Potassium"
                  badgeStyle="badge-pink"
                  chartSeries={[
                    {
                      name: "Potassium",
                      data: getSeriesData((r) => r.potassium),
                      color: "#EC4899", // Pink
                    },
                  ]}
                  chartCategories={readingsArray.map((r) =>
                    dayjs(r.date).format("MMM D")
                  )}
                />

                <NutrientsCard
                  title="Phosphorus"
                  badgeStyle="badge-purple"
                  chartSeries={[
                    {
                      name: "Phosphorus",
                      data: getSeriesData((r) => r.phosphorus),
                      color: "#8B5CF6", // Violet
                    },
                  ]}
                  chartCategories={readingsArray.map((r) =>
                    dayjs(r.date).format("MMM D")
                  )}
                />
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
