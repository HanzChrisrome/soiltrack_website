import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import CardContainer from "../widgets/CardContainer";

interface SoilDistributionItem {
  soil_type: string;
  count: number;
  percentage: number;
}

interface Props {
  soilData: SoilDistributionItem[];
}

export default function SoilDistributionCard({ soilData }: Props) {
  if (!soilData || soilData.length === 0) {
    return <div>No soil distribution data available.</div>;
  }

  const topSoil = soilData[0];

  return (
    <CardContainer padding="px-8 py-5">
      <div className="flex flex-col md:flex-row gap-2 h-full items-center">
        {/* Left: Circular Progress */}
        {/* <div className="flex justify-center items-center md:w-1/3">
          <div className="flex flex-col items-center">
            <div className="w-36 h-36">
              <CircularProgressbar
                value={topSoil.percentage}
                text={`${topSoil.percentage.toFixed(1)}%`}
                styles={buildStyles({
                  textColor: "#22c55e",
                  pathColor: "#22c55e",
                  trailColor: "#e5e7eb",
                })}
              />
            </div>
          </div>
        </div> */}

        {/* Right: Description + Table */}
        <div className="flex flex-col justify-center md:w-full">
          <h3 className="text-2xl font-bold text-primary">
            {topSoil.soil_type}
          </h3>
          <p className="text-xs text-base-content/70 mb-3">
            {topSoil.percentage.toFixed(1)}% in your area is using this soil
            type.
          </p>

          <div className="overflow-x-auto">
            <table className="table table-xs w-full">
              <thead>
                <tr className="text-xs text-base-content/60">
                  <th>Soil Type</th>
                  <th className="text-right">Usage</th>
                </tr>
              </thead>
              <tbody>
                {soilData.map(({ soil_type, percentage }) => (
                  <tr key={soil_type}>
                    <td>{soil_type}</td>
                    <td className="text-right">{percentage.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CardContainer>
  );
}
