import React from "react";
import MapView from "../../components/MapView";
import CardContainer from "../../components/widgets/CardContainer";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import MostCropsBarChart from "../../components/CropsBarChart";
import SoilDistributionCard from "../../components/MainPage/SoilDistributionCard";
import useMainPage from "../../hooks/useMainPage";

const AreaPage = () => {
  const { soilTypes } = useMainPage();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Good Morning!</h1>
          <p className="text-sm text-base-content/70">
            Optimize Your Farm Operations with Real-Time Insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="badge badge-warning text-sm p-4">
            ☀️ 24° Today is partly sunny day
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="grid grid-cols-3 gap-x-3">
        {/* FIRST GRID */}
        <div className="col-span-2 h-full">
          <MapView />
        </div>

        {/* SECOND GRID */}
        <div className="col-span-1 flex flex-col gap-3">
          <CardContainer className="">
            <h2 className="text-lg font-semibold">Most Crops Planted</h2>
            <MostCropsBarChart />
          </CardContainer>
          <SoilDistributionCard soilData={soilTypes ?? []} />
        </div>
      </div>
    </div>
  );
};

export default AreaPage;
