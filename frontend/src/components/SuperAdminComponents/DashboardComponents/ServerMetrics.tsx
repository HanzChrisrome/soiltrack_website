import type { ApexOptions } from "apexcharts";
import { useDashboardStore } from "../../../store/SuperAdminStore/useDashboardStore";
import ReactApexChart from "react-apexcharts";
import { parseTimestamp } from "../../../utils/TimeParser";
import CardContainer from "../../widgets/CardContainer";

const ServerMetricsChart = () => {
  const metrics = useDashboardStore((s) => s.metrics);

  const timestamps = metrics.map((m) => {
    const utcDate = parseTimestamp(m.timestamp);
    return utcDate.toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  });
  const cpuData = metrics.map((m) => parseFloat(m.cpu_usage.toFixed(2)));

  const options: ApexOptions = {
    chart: {
      id: "server-metrics-chart",
      animations: {
        enabled: true,
        dynamicAnimation: {
          speed: 500,
        },
      },
      sparkline: { enabled: false },
      zoom: { enabled: true },
      toolbar: { show: false },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: timestamps,
      labels: {
        show: true,
        offsetY: 3,
        style: {
          fontSize: "10px",
          colors: "#6b7280",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `${value}%`,
        offsetX: -10,
        style: {
          fontSize: "10px",
          colors: "#6b7280",
        },
      },
    },
    stroke: {
      curve: "smooth",
      width: 5,
      colors: ["#22c55e"], // green-500
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
              color: "#22c55e",
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
      colors: ["#22c55e"],
    },
    grid: {
      show: true,
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      padding: {
        left: 25,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
    colors: ["#22c55e"], // green-500
  };

  const series = [
    {
      name: "CPU Usage",
      data: cpuData,
    },
  ];

  return (
    <>
      <CardContainer padding="p-2" className="mt-2 border border-base-300">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={400}
        />
      </CardContainer>
    </>
  );
};

export default ServerMetricsChart;
