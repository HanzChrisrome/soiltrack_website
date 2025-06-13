import ReactApexChart from "react-apexcharts";
import CardContainer from "../../widgets/CardContainer";

interface DataItem {
  name: string;
  count: number;
  percentage?: number;
}

interface DataBarChartProps {
  data: DataItem[];
}

const DataBarChart: React.FC<DataBarChartProps> = ({ data }) => {
  const categories = data.map((item) => item.name);
  const counts = data.map((item) => item.count);

  const series = [
    {
      name: "Count",
      data: counts,
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 6,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories,
      labels: {
        style: {
          fontSize: "10px",
          colors: "#888888",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "10px",
          colors: "#888888",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: {
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    fill: {
      colors: ["#134f14"],
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} planted`,
      },
    },
  };

  return (
    <CardContainer padding="p-0" className="mt-4 relative z-0">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={200}
      />
    </CardContainer>
  );
};

export default DataBarChart;
