import React from "react";
import ReactApexChart from "react-apexcharts";

const MostCropsBarChart = () => {
  const series = [
    {
      name: "Crops Planted",
      data: [400, 700, 850, 650, 300],
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 6,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Corn", "Wheat", "Rice", "Soybean", "Potato"],
      labels: {
        style: {
          fontSize: "12px",
          colors: "#888888",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: "#888888",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: {
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    fill: {
      colors: ["#134f14"], // solid dark green color
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} planted`,
      },
    },
  };

  return (
    <div className="w-full h-full">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={300}
      />
    </div>
  );
};

export default MostCropsBarChart;
