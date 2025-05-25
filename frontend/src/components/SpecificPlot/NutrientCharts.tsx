import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import CardContainer from "../widgets/CardContainer";

interface ChartSeries {
  name: string;
  data: number[];
  color?: string;
}

interface NutrientChartProps {
  title: string;
  chartSeries: ChartSeries[];
  chartCategories?: string[];
}

const NutrientChart = ({
  title,
  chartSeries,
  chartCategories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
}: NutrientChartProps) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
      height: 160,
      sparkline: { enabled: false },
      zoom: { enabled: true },
      toolbar: { show: false },
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
      padding: {
        left: 16,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
    colors: chartSeries.map((s) => s.color || "#22c55e"),
    tooltip: {
      y: {
        formatter: (value: number) => `${value}%`,
      },
    },
  };

  return (
    <CardContainer padding="p-3" className="mt-2 bg-base-100">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-primary">{title}</h2>
        </div>
      </div>

      <ReactApexChart
        options={chartOptions}
        series={chartSeries.map(({ name, data }) => ({ name, data }))}
        type="area"
        height={200}
      />
    </CardContainer>
  );
};

export default NutrientChart;
