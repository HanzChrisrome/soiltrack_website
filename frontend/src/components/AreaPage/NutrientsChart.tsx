import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import CardContainer from "../widgets/CardContainer";

interface ChartSeries {
  name: string;
  data: (number | null)[];
  color?: string; // optional custom color
}

interface NutrientsCardProps {
  title: string;
  chartSeries: ChartSeries[];
  chartCategories?: string[];
  badgeStyle: string;
}

const NutrientsCard = ({
  title,
  chartSeries,
  chartCategories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  badgeStyle,
}: NutrientsCardProps) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
      height: 160,
      sparkline: { enabled: true },
      zoom: { enabled: false },
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
    <CardContainer padding="p-4">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-primary">{title}</h2>
          {badgeStyle.includes("success") ? (
            <TrendingUp className="h-6 w-6 text-success" />
          ) : (
            <TrendingDown className="h-6 w-6 text-error" />
          )}
        </div>
      </div>
      <p className="text-sm font-light text-base-content/70">
        Here are the analyzed data plots.
      </p>

      <div className="mt-5">
        <ReactApexChart
          options={chartOptions}
          series={chartSeries.map(({ name, data }) => ({ name, data }))}
          type="area"
          height={100}
        />
      </div>
    </CardContainer>
  );
};

export default NutrientsCard;
