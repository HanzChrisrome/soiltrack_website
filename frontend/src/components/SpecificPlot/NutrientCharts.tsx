import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import CardContainer from "../widgets/CardContainer";

interface ChartPoint {
  x: string; // ISO timestamp
  y: number;
}

interface ChartSeries {
  name: string;
  data: ChartPoint[];
  color?: string;
}

interface NutrientChartProps {
  title: string;
  chartSeries: ChartSeries[];
  selectedRange: "1D" | "7D" | "1M" | "3M" | "Custom";
}

const NutrientChart = ({
  title,
  chartSeries,
  selectedRange,
}: NutrientChartProps) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
      height: 160,
      sparkline: { enabled: false },
      zoom: { enabled: true },
      toolbar: { show: false },
    },
    dataLabels: {
      enabled: false,
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
      type: "datetime",
      tickAmount:
        selectedRange === "3M"
          ? 5
          : selectedRange === "1M"
          ? 7
          : selectedRange === "7D"
          ? 7
          : 6,
      labels: {
        rotate: -45,
        style: {
          fontSize: "10px",
          colors: "#6b7280",
        },
        datetimeFormatter: {
          hour: selectedRange === "1D" ? "HH:mm" : "MMM dd HH:mm",
          day: "MMM dd",
          month: "MMM",
          year: "yyyy",
        },
      },
      axisBorder: {
        show: false,
        color: "#e5e7eb",
      },
      axisTicks: {
        show: false,
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
      x: {
        format:
          selectedRange === "1D"
            ? "HH:mm"
            : selectedRange === "7D"
            ? "MMM dd HH:mm"
            : "MMM dd",
      },
      y: {
        formatter: (value: number) => `${value}%`,
      },
    },
  };

  return (
    <CardContainer padding="p-3" className="bg-base-100">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-primary">{title}</h2>
        </div>
      </div>

      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="area"
        height={200}
      />
    </CardContainer>
  );
};

export default NutrientChart;
