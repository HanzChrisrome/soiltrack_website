import MapView from "../../../components/AdminComponents/MapView";
import ReusableCard from "../../../components/AdminComponents/AreaPage/ReusableCard";
import DataBarChart from "../../../components/AdminComponents/AreaPage/DataBarChart";
import DonutChart from "../../../components/AdminComponents/AreaPage/DonutChart";
import { LandPlot, Leaf } from "lucide-react";
import LabelCard from "../../../components/AdminComponents/AreaPage/LabelCard";
import { useReadingStore } from "../../../store/AdminStore/useReadingStore";
import { useMainPageHook } from "../../../hooks/useMainPage";

const AreaPage = () => {
  useMainPageHook();

  //STORE DATA
  const { soilTypes, cropTypes, userPlots } = useReadingStore();

  return (
    <div className="h-full mt-2">
      <div className="grid lg:grid-cols-4 gap-3">
        <div className="lg:col-span-3">
          <MapView />
        </div>

        {/* SECOND GRID */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <LabelCard
              icon={<LandPlot className="w-4 h-4" />}
              title="Total Plots"
              label={`${userPlots?.length ?? 0} plots`}
            />
          </div>
          <ReusableCard
            title="Most Planted Crops"
            subtitle="Based on your users planted crops."
            icon={<Leaf />}
          >
            <DonutChart
              series={(cropTypes ?? []).map((crop) => crop.count)}
              labels={(cropTypes ?? []).map((crop) => crop.crop_name)}
              total={cropTypes ? cropTypes.length : 0}
            />
          </ReusableCard>
          <ReusableCard
            title="Most Used Soil"
            subtitle="Based on your users assigned soil types."
            icon={<LandPlot />}
          >
            <DataBarChart
              data={(soilTypes ?? []).map((soil) => ({
                name: soil.soil_type ?? "",
                count: soil.count,
                percentage: soil.percentage,
              }))}
            />
          </ReusableCard>
          {/* <SoilDistributionCard soilData={soilTypes ?? []} /> */}
        </div>
      </div>
    </div>
  );
};

export default AreaPage;
