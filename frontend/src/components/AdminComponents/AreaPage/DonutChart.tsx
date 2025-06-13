// components/widgets/DonutChart.tsx

import React from "react";
import ReactApexChart from "react-apexcharts";
import CardContainer from "../../widgets/CardContainer";

interface DonutChartProps {
  labels: string[];
  series: number[];
  total: number;
  colors?: string[];
}

const DonutChart: React.FC<DonutChartProps> = ({
  labels,
  series,
  total,
  colors = ["#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA", "#818CF8"],
}) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
    },
    labels,
    legend: {
      show: false,
    },
    colors,
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toLocaleString()} planted`,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: { show: false },
            value: { show: false },
            total: {
              show: true,
              label: "Crops",
              fontSize: "16px",
              color: "#111827",
              formatter: () => total.toLocaleString(),
            },
          },
        },
      },
    },
  };

  return (
    <CardContainer padding="px-4 py-4" className="mt-4">
      <div className="flex flex-row mt-4 relative z-0 w-full justify-around">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height={150}
          width={120}
        />
        <div className="mt-4 ml-5 space-y-1 text-sm w-full">
          {labels.map((label, index) => (
            <div key={label} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 inline-block"
                  style={{ backgroundColor: colors[index] }}
                />
                <span>{label}</span>
              </div>
              <div className="text-gray-500">
                {((series[index] / total) * 100).toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardContainer>
  );
};

export default DonutChart;
