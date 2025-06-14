import { useReadingStore } from "../../../store/AdminStore/useReadingStore";
import NutrientTrends from "../../../components/AdminComponents/SpecificPlot/NutrientTrends";
import CardContainer from "../../../components/widgets/CardContainer";
import LabelCard from "../../../components/AdminComponents/AreaPage/LabelCard";
import { LandPlot, TractorIcon, User, User2Icon } from "lucide-react";
import * as turf from "@turf/turf";
import PlotMap from "../../../components/AdminComponents/SpecificPlot/MapPlot";
import { useEffect } from "react";
import HeatmapViewContent from "../../../components/AdminComponents/SpecificPlot/HeatmapViewContent";
import { getTodayHeatMap } from "../../../utils/NutrientTrendsUtil";
import GradientHeading from "../../../components/widgets/GradientComponent";
import { useParams } from "react-router-dom";

const SpecificPlotPage = () => {
  const { plotId } = useParams();
  const {
    selectedPlotId,
    userPlots,
    chartNutrientTrends,
    aiAnalysisByPlotId,
    isLoadingAiAnalysis,
    fetchAiAnalysis,
    fetchChartNutrients,
    setSelectedPlotId,
  } = useReadingStore();

  const selectedPlot = userPlots?.find(
    (plot) => plot.plot_id === Number(plotId)
  );

  useEffect(() => {
    if (!plotId) return;
    const numericPlotId = Number(plotId);
    setSelectedPlotId(numericPlotId);
    const formatDate = (date: Date) => date.toISOString().split("T")[0];
    const now = new Date();
    const start = new Date();
    start.setMonth(now.getMonth() - 3);
    const startDate = formatDate(start);
    const endDate = formatDate(now);

    const fetchData = async () => {
      const hasData =
        chartNutrientTrends && chartNutrientTrends[Number(plotId)]?.length > 0;
      if (!hasData) {
        await fetchChartNutrients(Number(plotId), startDate, endDate);
      }
      await fetchAiAnalysis(numericPlotId);
    };

    fetchData();
  }, [plotId, chartNutrientTrends, fetchChartNutrients, setSelectedPlotId]);

  const trendDataRaw =
    selectedPlotId !== null && chartNutrientTrends
      ? chartNutrientTrends[selectedPlotId]
      : undefined;

  const getAreaInHectares = (coords: number[][]): string => {
    if (!Array.isArray(coords) || coords.length < 3) return "0.00";

    const lngLatCoords = coords.map(([lat, lng]) => [lng, lat]);

    if (
      lngLatCoords[0][0] !== lngLatCoords[lngLatCoords.length - 1][0] ||
      lngLatCoords[0][1] !== lngLatCoords[lngLatCoords.length - 1][1]
    ) {
      lngLatCoords.push([...lngLatCoords[0]]);
    }

    const polygon = turf.polygon([lngLatCoords]);
    const areaSqMeters = turf.area(polygon);
    const hectares = areaSqMeters / 10000;

    return hectares.toFixed(2);
  };

  const areaHectares = getAreaInHectares(selectedPlot?.polygons || []);

 const headline =
  typeof selectedPlotId === "number"
    ? aiAnalysisByPlotId[selectedPlotId]?.[0]?.analysis?.AI_Analysis?.headline ?? "No insight available."
    : "No insight available.";

    console.log("AI Headline:", headline);
    console.log("Full:", aiAnalysisByPlotId[selectedPlotId]);

  


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 py-4">
      <div className="flex flex-col gap-2">
        
        <CardContainer className="p-4 rounded-2xl shadow-md bg-white">
          {/* Top row with user and plot name */}
          <div className="my-2 flex flex-wrap items-center space-x-6 mb-3">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <User className="w-4 h-4 text-gray-500" />
              <span>{selectedPlot?.user_fname} {selectedPlot?.user_lname}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <LandPlot className="w-4 h-4" />
              <span>{selectedPlot?.plot_name}</span>
            </div>
          </div>
          <div className="leading-none tracking-tighter mb-2">
            <h2 className="text-3xl font-semibold text-primary tracking-tighter">
              {aiAnalysisByPlotId[selectedPlotId]?.[0]?.analysis?.AI_Analysis?.headline ?? "No insight available."}
            </h2>
            <span className="text-sm leading-none tracking-tighter">
              {aiAnalysisByPlotId[selectedPlotId]?.[0]?.analysis?.AI_Analysis?.short_summary ?? "No insight available."}
            </span>
          </div>
        </CardContainer>
        
        <CardContainer className="">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <GradientHeading className="text-2xl font-bold">
                Plot Nutrients
              </GradientHeading>
              <CardContainer padding="px-2 py-0.5 border border-base-200">
                <span className="text-sm text-neutral">
                  Over the last 7 days
                </span>
              </CardContainer>
            </div>
            <hr className="my-2 border-t border-base-200" />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs text-neutral">Moisture</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-400" />
                <span className="text-xs text-neutral">Nitrogen</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-violet-500" />
                <span className="text-xs text-neutral">Phosphorus</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-pink-400" />
                <span className="text-xs text-neutral">Potassium</span>
              </div>
            </div>
          </div>
          <HeatmapViewContent
            variant="daily"
            data={getTodayHeatMap(trendDataRaw || [])}
          />
        </CardContainer>

        <CardContainer>
          <div className="flex items-start">
            <div className="flex flex-col items-start w-full">
              <h1 className="text-xl font-semibold leading-none">
                {selectedPlot?.user_fname} {selectedPlot?.user_lname}
              </h1>
              <span className="text-sm text-neutral">
                {selectedPlot?.user_email || "Not specified"}
              </span>
            </div>
            <div className="flex items-center w-full gap-2 justify-end">
              <h3 className="text-md font-normal text-neutral">Plot Owner</h3>
              <div className="p-1 bg-white rounded flex items-center justify-center">
                <CardContainer padding="p-0.5">
                  <User2Icon className="w-4 h-4 text-primary" />
                </CardContainer>
              </div>
            </div>
          </div>
          <hr className="my-3 border-t border-base-200" />
          <p className="text-sm text-neutral">
            The area is located in the{" "}
            <span className="font-semibold text-primary">
              {selectedPlot?.plot_address}
            </span>
            . This plot covers an area of{" "}
            <span className="font-semibold text-primary">
              {areaHectares} hectares
            </span>
            . The coordinates of the plot are displayed on the map below.
          </p>
          <div className="mt-3 z-10">
            <PlotMap coords={selectedPlot?.polygons || []} />
          </div>
        </CardContainer>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <LabelCard
            icon={<User className="w-6 h-6 text-primary" />}
            label={selectedPlot?.crop_name || "Not specified"}
            title="Crop Planted"
          />
          <LabelCard
            icon={<TractorIcon className="w-6 h-6 text-primary" />}
            label={selectedPlot?.soil_type || "Not specified"}
            title="Soil Type"
          />
        </div>
      </div>

      <div className="col-span-2">
        <NutrientTrends plotId={selectedPlotId!} />
      </div>
    </div>
  );
};

export default SpecificPlotPage;
