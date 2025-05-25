import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import {
  Maximize2,
  TrendingDown,
  TrendingUp,
  ChevronUp,
  LandPlotIcon,
  Layers,
} from "lucide-react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import CardContainer from "./widgets/CardContainer";
import SmallNutrientsChart from "./MainPage/SmallNutrientsChart";
import { motion } from "framer-motion";

interface ChartSeries {
  name: string;
  data: number[];
  color?: string;
}

interface NutrientDataEntry {
  date: string;
  avg_moisture: number;
  avg_nitrogen: number;
  avg_phosphorus: number;
  avg_potassium: number;
}

interface PerformanceCardProps {
  title: string;
  plotOwner: string;
  plotName: string;
  chartSeries: ChartSeries[];
  chartCategories?: string[];
  nutrientAverages?: NutrientDataEntry[];
}

const PerformanceCard = ({
  title,
  plotOwner,
  plotName,
  chartSeries,
  chartCategories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],

  nutrientAverages = [],
}: PerformanceCardProps) => {
  const nutrientCharts = [
    { label: "Moisture", key: "avg_moisture", color: "#0ea5e9" },
    { label: "Nitrogen", key: "avg_nitrogen", color: "#16a34a" },
    { label: "Phosphorus", key: "avg_phosphorus", color: "#facc15" },
    { label: "Potassium", key: "avg_potassium", color: "#f97316" },
  ];

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
    <CardContainer>
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-primary">{title}</h2>
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

      <p className="text-sm font-sembiold text-base-content/70 flex items-center gap-1">
        <LandPlotIcon className="h-4 w-4 text-primary" />
        {plotOwner}
        <span
          className="mx-2 h-4 border-l border-neutral inline-block"
          aria-hidden="true"
        ></span>
        <Layers className="h-4 w-4 text-primary" />
        {plotName}
      </p>

      <CardContainer padding="p-3" className="mt-3">
        <ReactApexChart
          options={chartOptions}
          series={chartSeries.map(({ name, data }) => ({ name, data }))}
          type="area"
          height={200}
        />
      </CardContainer>

      {nutrientAverages.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
          {nutrientCharts.map(({ label, key, color }) => (
            <SmallNutrientsChart
              key={key}
              title={label}
              chartSeries={[
                {
                  name: label,
                  data: nutrientAverages.map(
                    (entry) => entry[key as keyof NutrientDataEntry] as number
                  ),
                  color: color,
                },
              ]}
              chartCategories={nutrientAverages.map((entry) =>
                new Date(entry.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              )}
            />
          ))}
        </div>
      )}
    </CardContainer>
  );
};

export default PerformanceCard;
