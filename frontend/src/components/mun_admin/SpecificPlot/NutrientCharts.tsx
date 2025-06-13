import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import CardContainer from "../../widgets/CardContainer";
import { Skeleton } from "../../widgets/Widgets";
import { TrendingDown, TrendingUp } from "lucide-react";

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
  isLoading?: boolean;
}

const calculateChange = (series: ChartSeries) => {
  const data = series.data;
  if (data.length < 2) return null;

  const sortedData = [...data].sort(
    (a, b) => new Date(a.x).getTime() - new Date(b.x).getTime()
  );
  const first = sortedData[0].y;
  const last = sortedData[sortedData.length - 1].y;

  if (first === 0) return null;

  const absoluteChange = last - first;
  const percentChange = (absoluteChange / first) * 100;

  return {
    absolute: absoluteChange,
    percent: percentChange,
    isIncrease: percentChange > 0,
  };
};

const NutrientChart = ({
  title,
  chartSeries,
  selectedRange,
  isLoading = false,
}: NutrientChartProps) => {
  // Convert UTC ISO string to Philippine Time ISO string (UTC+8)
  const convertToPHT = (isoString: string): string => {
    const date = new Date(isoString);
    // Add 8 hours in milliseconds
    const phtDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    return phtDate.toISOString();
  };

  // Map chartSeries data points to PHT timestamps
  const convertedSeries = chartSeries.map((series) => ({
    ...series,
    data: series.data.map((point) => ({
      ...point,
      x: convertToPHT(point.x),
    })),
  }));

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
      min: 0,
      max: 200,
      tickAmount: 4,
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
    colors: convertedSeries.map((s) => s.color || "#22c55e"),
    tooltip: {
      x: {
        show: false,
        format: "MMM dd yyyy HH:mm:ss",
      },
      y: {
        formatter: (value: number) => `${value}%`,
      },
    },

    legend: {
      show: false,
    },
  };

  const changes = convertedSeries.map((series) => ({
    name: series.name,
    change: calculateChange(series),
  }));

  return (
    <CardContainer padding="p-5" className="border border-base-300">
      <div className="flex items-center gap-2 justify-between flex-wrap">
        <h2 className="text-xl font-semibold text-primary">{title}</h2>
        {!isLoading &&
          changes.map((c) =>
            c.change ? (
              <CardContainer padding="px-2 py-1" className="" key={c.name}>
                <span
                  className={`text-sm font-medium flex items-center gap-1 ${
                    c.change.isIncrease ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {c.change.isIncrease ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}{" "}
                  {Math.abs(c.change.percent).toFixed(1)}%
                </span>
              </CardContainer>
            ) : null
          )}
      </div>

      {isLoading ? (
        <div className="h-[200px] w-full mt-4">
          <Skeleton className="h-full w-full" />
        </div>
      ) : (
        <ReactApexChart
          options={chartOptions}
          series={convertedSeries}
          type="area"
          height={200}
        />
      )}
    </CardContainer>
  );
};

export default NutrientChart;
