import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import CardContainer from "../../widgets/CardContainer";

interface ChartSeries {
  name: string;
  data: (number | null)[];
  color?: string; // optional custom color
}

interface SmallNutrientsChartProps {
  title: string;
  chartSeries: ChartSeries[];
  chartCategories?: string[];
}

const SmallNutrientsChart = ({
  title,
  chartSeries,
  chartCategories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
}: SmallNutrientsChartProps) => {
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
      labels: {
        show: true,
        offsetY: 3,
        style: {
          fontSize: "10px",
          colors: "#6b7280",
        },
      },
      axisBorder: {
        show: true,
        color: "#e5e7eb",
      },
      axisTicks: {
        show: true,
        color: "#e5e7eb",
      },
    },
    yaxis: {
      show: true,
      labels: {
        show: true,
        offsetX: -10,
        style: {
          fontSize: "10px",
          colors: "#6b7280",
        },
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
      enabled: true,
      y: {
        formatter: (value: number) => `${value.toFixed(1)}%`,
      },
    },
  };

  const isTrendUp = () => {
    if (!chartSeries.length) return false;

    const firstSeries = chartSeries[0].data;
    const data = firstSeries.filter((value) => value !== null);

    if (data.length < 2) return false;

    return data[data.length - 1] > data[0];
  };

  return (
    <CardContainer padding="p-4" className="border border-base-300 mt-3">
      <div className="flex items-center gap-2 justify-between">
        <h2 className="text-md font-semibold text-primary">{title}</h2>
        <CardContainer padding="p-1">
          {isTrendUp() ? (
            <TrendingUp className="h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="h-4 w-4 text-error" />
          )}
        </CardContainer>
      </div>

      <div className="mt-5">
        <ReactApexChart
          options={chartOptions}
          series={chartSeries.map(({ name, data }) => ({ name, data }))}
          type="area"
          height={50}
        />
      </div>
    </CardContainer>
  );
};

export default SmallNutrientsChart;
