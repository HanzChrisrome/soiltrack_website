import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import CardContainer from "./widgets/CardContainer";
import SmallNutrientsChart from "./MainPage/SmallNutrientsChart";

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
  chartSeries: ChartSeries[];
  chartCategories?: string[];
  nutrientAverages?: NutrientDataEntry[];
}

const PerformanceCard = ({
  chartSeries,
  chartCategories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  nutrientAverages = [],
}: PerformanceCardProps) => {
  const nutrientCharts = [
    { label: "Moisture", key: "avg_moisture", color: "#0ea5e9" },
    { label: "Nitrogen", key: "avg_nitrogen", color: "#facc15" },
    { label: "Phosphorus", key: "avg_phosphorus", color: "#a78bfa" },
    { label: "Potassium", key: "avg_potassium", color: "#f472b6" },
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
    <>
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
    </>
  );
};

export default PerformanceCard;
