import ReactApexChart from "react-apexcharts";

type DataPoint = {
  x: string;
  y: string;
  value: number;
  color: string;
  time?: string;
};

type HeatmapChartProps = {
  data: DataPoint[];
  variant?: "daily" | "weekly";
};

const HeatmapChart = ({ data, variant }: HeatmapChartProps) => {
  // Group by nutrient (y)
  const seriesMap: Record<
    string,
    { name: string; data: { x: string; y: number }[] }
  > = {};

  data.forEach(({ x, y, value, time }) => {
    if (!seriesMap[y]) {
      seriesMap[y] = { name: y, data: [] };
    }

    const xLabel = time ? `${x} (${time})` : x;
    seriesMap[y].data.push({ x: xLabel, y: value });
  });

  const chartData = Object.values(seriesMap);

  const colors = chartData.map((series) => {
    const match = data.find(
      (d) => d.y === series.name && d.x === series.data[0]?.x.split(" (")[0]
    );
    return match?.color || "#008FFB";
  });

  const isDaily = variant === "daily";

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "heatmap",

      toolbar: { show: false },
      offsetX: 0,
      offsetY: 0,
      parentHeightOffset: 0,
      animations: {
        enabled: false,
      },
    },

    tooltip: {
      enabled: true,
      shared: false,
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const dataPoint = w.config.series[seriesIndex].data[dataPointIndex];
        const timeMatch = dataPoint.x.match(/\(([^)]+)\)$/);
        const time = timeMatch ? timeMatch[1] : "N/A";
        return `
          <div style="padding: 8px; background: white; border: 1px solid #ccc; border-radius: 4px;">
            <div><strong>Value:</strong> ${dataPoint.y}</div>
            <div><strong>Time:</strong> ${time}</div>
          </div>
        `;
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors,
    xaxis: {
      type: "category",
      labels: {
        trim: false,
        style: {
          fontSize: "12px",
        },
        show: !isDaily,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: !isDaily,
    },
    grid: {
      show: true,
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      padding: {
        top: 0,
        bottom: 0,
        left: isDaily ? 0 : 20,
        right: 0,
      },
    },

    plotOptions: {
      heatmap: {
        useFillColorAsStroke: false,
        shadeIntensity: 0.8,
        colorScale: {
          inverse: false,
          min: 0,
          max: 30,
        },
      },
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={chartData}
      style={{ paddingTop: 0, paddingBottom: 0 }}
      type="heatmap"
      height={300}
      width="100%"
    />
  );
};

export default HeatmapChart;
