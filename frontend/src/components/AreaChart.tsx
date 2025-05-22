import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { Maximize2, TrendingDown, TrendingUp } from "lucide-react";
import CardContainer from "./widgets/CardContainer";

interface ChartSeries {
  name: string;
  data: number[];
  color?: string; // optional custom color
}

interface PerformanceCardProps {
  title: string;
  chartSeries: ChartSeries[];
  chartCategories?: string[];
  location: string;
  badgeText: string;
  badgeStyle: string;
}

const PerformanceCard = ({
  title,
  chartSeries,
  chartCategories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  location,
  badgeText,
  badgeStyle,
}: PerformanceCardProps) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
      height: 160,
      sparkline: { enabled: true },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: chartCategories,
    },
    yaxis: {
      show: false,
      labels: {
        formatter: (value) => Math.floor(value).toString(),
      },
    },
    grid: {
      show: true,
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
    },
    colors: chartSeries.map((s) => s.color || "#22c55e"),
    tooltip: {
      y: {
        formatter: (value: number) => `${value}%`,
      },
    },
  };

  return (
    <CardContainer>
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-primary">{title}</h2>
          {badgeStyle.includes("success") ? (
            <TrendingUp className="h-6 w-6 text-success" />
          ) : (
            <TrendingDown className="h-6 w-6 text-error" />
          )}
        </div>
        <button
          type="button"
          className="rounded-md border border-base-300 p-1 hover:bg-base-200 transition"
          aria-label="Expand chart"
        >
          <span className="sr-only">Expand chart</span>
          <Maximize2 className="h-5 w-5 text-base-content" />
        </button>
      </div>
      <p className="text-sm font-light text-base-content/70">
        Here are the analyzed data plots.
      </p>

      <div className="mt-5 mb-5">
        <ReactApexChart
          options={chartOptions}
          series={chartSeries.map(({ name, data }) => ({ name, data }))}
          type="area"
          height={200}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="card border border-neutral p-4 flex flex-row items-center justify-between shadow-none">
          <div>
            <span className="text-lg font-semibold">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`badge ${badgeStyle}`}>{badgeText}</span>
          </div>
        </div>
      </div>
    </CardContainer>
  );
};

export default PerformanceCard;
