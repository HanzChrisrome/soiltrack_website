import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useReadingStore } from "../../store/useReadingStore";
import { LucideActivity } from "lucide-react";
import GradientHeading from "../widgets/GradientComponent";

export default function AreaPerformancesCard() {
  const { overallAverage, fetchOverallAverage } = useReadingStore();

  useEffect(() => {
    const now = new Date();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString();
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).toISOString();
    fetchOverallAverage(startOfMonth, endOfMonth);
  }, []);

  if (!overallAverage) {
    return (
      <div className="text-center py-10 text-gray-500">
        No overall performance data available.
      </div>
    );
  }

  const data = [
    overallAverage.moisture ?? 0,
    overallAverage.nitrogen ?? 0,
    overallAverage.phosphorus ?? 0,
    overallAverage.potassium ?? 0,
  ];

  const labels = ["Moisture", "Nitrogen", "Phosphorus", "Potassium"];

  const chartOptions: ApexOptions = {
    chart: {
      type: "donut",
    },
    labels,
    colors: [
      "#2196F3", // Blue for Moisture
      "#FFEB3B", // Yellow for Nitrogen
      "#9C27B0", // Violet for Phosphorus
      "#E91E63", // Pink for Potassium
    ],
    legend: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
        },
      },
    },
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        <GradientHeading className="text-xl font-bold leading-none">
          Plot Details
        </GradientHeading>
        <p className="text-sm text-neutral">
          Here you can view the details of the selected plot, including its
          nutrient trends and performance over time.
        </p>
      </div>
      <div className="relative">
        <ReactApexChart
          options={chartOptions}
          series={data}
          type="donut"
          height={220}
          width={0}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <LucideActivity className="w-12 h-12 text-gray-500" />
        </div>
      </div>
      <div>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center">
              <LucideActivity className="w-5 h-5 text-blue-500 mr-2" />
              <p className="text-gray-600 mb-1">Moisture</p>
            </div>
            <span className="text-sm font-bold text-neutral">
              {overallAverage.moisture?.toFixed(2) ?? "N/A"}%
            </span>
          </div>
          <hr className="my-1 border-t border-gray-200" />
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center">
              <LucideActivity className="w-5 h-5 text-yellow-500 mr-2" />
              <p className="text-gray-600 mb-1">Nitrogen</p>
            </div>
            <span className="text-sm font-bold text-neutral">
              {overallAverage.nitrogen?.toFixed(2) ?? "N/A"}%
            </span>
          </div>
          <hr className="my-1 border-t border-gray-200" />
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center">
              <LucideActivity className="w-5 h-5 text-pink-500 mr-2" />
              <p className="text-gray-600 mb-1">Potassium</p>
            </div>
            <span className="text-sm font-bold text-neutral">
              {overallAverage.phosphorus?.toFixed(2) ?? "N/A"}%
            </span>
          </div>
          <hr className="my-1 border-t border-gray-200" />
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center">
              <LucideActivity className="w-5 h-5 text-violet-500 mr-2" />
              <p className="text-gray-600 mb-1">Phosphorus</p>
            </div>
            <span className="text-sm font-bold text-neutral">
              {overallAverage.potassium?.toFixed(2) ?? "N/A"}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
