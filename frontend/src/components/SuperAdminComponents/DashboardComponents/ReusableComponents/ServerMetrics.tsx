import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

type ReusableMetricChartProps = {
  timestamps: string[];
  data: number[];
  label: string;
  unit?: string;
  color?: string;
  width?: number | string;
  height?: number | string;
};

const ReusableMetricChart = ({
  timestamps,
  data,
  label,
  unit = "%",
  color = "#22c55e",
  width = "100%",
  height = 300,
}: ReusableMetricChartProps) => {
  const options: ApexOptions = {
    chart: {
      id: `${label.toLowerCase().replace(/\s+/g, "-")}-chart`,
      animations: {
        enabled: true,
        dynamicAnimation: { speed: 500 },
      },
      sparkline: { enabled: false },
      zoom: { enabled: true },
      toolbar: { show: false },
      offsetY: 5,
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: timestamps,
      labels: {
        show: false,
        offsetY: 3,
        style: {
          fontSize: "10px",
          colors: "#6b7280",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `${value}${unit ?? ""}`,
        offsetX: -10,
        style: {
          fontSize: "10px",
          colors: "#6b7280",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value}${unit ?? ""}`,
      },
    },
    stroke: {
      curve: "smooth",
      width: 5,
      colors: [color],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.9,
        opacityTo: 0.5,
        stops: [0, 90, 100],
        colorStops: [
          [
            {
              offset: 0,
              color: color,
              opacity: 0.9,
            },
            {
              offset: 100,
              color: "#bbf7d0",
              opacity: 0.5,
            },
          ],
        ],
      },
      colors: [color],
    },
    grid: {
      show: true,
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      padding: {
        left: 15,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
    colors: [color],
  };

  const series = [
    {
      name: label,
      data,
    },
  ];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height={height ?? 400}
      width={width ?? "100%"}
    />
  );
};

export default ReusableMetricChart;
