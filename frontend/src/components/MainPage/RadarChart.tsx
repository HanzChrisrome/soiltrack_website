import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useReadingStore } from "../../store/useReadingStore";

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

  const chartOptions: ApexOptions = {
    chart: {
      type: "radar",
      toolbar: { show: false },
    },
    xaxis: {
      categories: [],
      labels: {
        show: false,
      },
    },
    yaxis: {
      max: 100,
      tickAmount: 5,
      labels: {
        show: false,
      },
    },
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.4,
    },
    markers: {
      size: 4,
    },
    colors: ["#00B8D9"],
    tooltip: {
      enabled: true,
    },
  };

  const chartSeries = [
    {
      name: "Average",
      data,
    },
  ];

  return (
    <div className="w-full max-w-xl mx-auto">
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="radar"
        height={400}
      />
    </div>
  );
}
