import { useReadingStore } from "../../../store/mun_admin/useReadingStore";
import NutrientTrends from "../../../components/mun_admin/SpecificPlot/NutrientTrends";
import CardContainer from "../../../components/widgets/CardContainer";
import LabelCard from "../../../components/mun_admin/AreaPage/LabelCard";
import { TractorIcon, User, User2Icon } from "lucide-react";
import * as turf from "@turf/turf";
import PlotMap from "../../../components/mun_admin/SpecificPlot/MapPlot";
import { useEffect } from "react";
import HeatmapViewContent from "../../../components/mun_admin/SpecificPlot/HeatmapViewContent";
import { getTodayHeatMap } from "../../../utils/NutrientTrendsUtil";
import GradientHeading from "../../../components/widgets/GradientComponent";

const SpecificPlotPage = () => {
  const {
    selectedPlotId,
    userPlots,
    getPlotNutrientsTrend,
    fetchPlotNutrients,
  } = useReadingStore();

  const selectedPlot = userPlots?.find(
    (plot) => plot.plot_id === selectedPlotId
  );

  useEffect(() => {
    if (!selectedPlotId) return;
    const formatDate = (date: Date) => date.toISOString().split("T")[0];
    const now = new Date();
    const start = new Date();
    start.setMonth(now.getMonth() - 3);
    const startDate = formatDate(start);
    const endDate = formatDate(now);

    const fetchData = async () => {
      const hasData = getPlotNutrientsTrend(selectedPlotId);
      if (!hasData) {
        await fetchPlotNutrients(selectedPlotId, startDate, endDate);
      }
    };
    fetchData();
  }, [selectedPlotId, getPlotNutrientsTrend, fetchPlotNutrients]);

  const trendDataRaw =
    selectedPlotId !== null ? getPlotNutrientsTrend(selectedPlotId) : undefined;

  if (!selectedPlotId) return null;

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 py-4">
      <div className="flex flex-col gap-2">
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
        {/* <CardContainer className="relative overflow-hidden h-98" padding="p-0">
          <img
            src="/ai_is_here_2.png"
            alt="AI Insight"
            className="w-full h-auto object-cover"
          />
          <div className="absolute bottom-6 left-0 w-full px-4 py-2 flex justify-center">
            <div
              tabIndex={0}
              role="button"
              className="btn w-full flex flex-row items-center gap-2 px-3 py-2 font-normal bg-base-100 border border-base-200 shadow-sm rounded-lg cursor-pointer hover:bg-base-300 transition"
            >
              Analysis has been generated
              <MoveRight className="w-4 h-4 text-primary" />
            </div>
          </div>
        </CardContainer> */}

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
        <NutrientTrends plotId={selectedPlotId} />
      </div>
    </div>
  );
};

export default SpecificPlotPage;
