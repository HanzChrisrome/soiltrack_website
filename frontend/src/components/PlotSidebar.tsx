import React from "react";
import CardContainer from "./widgets/CardContainer";
import PerformanceCard from "./AreaChart";

type Plot = {
  id: number;
  name: string;
  crop: string;
  area: string;
  color: string;
};

type PlotSidebarProps = {
  plot: Plot | null;
  visible: boolean;
  onClose: () => void;
};

export default function PlotSidebar({
  plot,
  visible,
  onClose,
}: PlotSidebarProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[700px] bg-white shadow-lg z-50
        transform transition-transform duration-300
        ${visible ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 flex flex-col h-full">
          {plot ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{plot.name}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-black"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-3">
                <CardContainer>
                  <h3 className="text-md font-semibold mb-2">Plot Details</h3>
                  <div className="flex items-center">
                    <span
                      className="inline-block w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: plot.color }}
                    ></span>
                    <span>{plot.crop}</span>
                  </div>
                </CardContainer>
                <CardContainer>
                  <h3 className="text-md font-semibold mb-2">Area</h3>
                  <p>{plot.area}</p>
                </CardContainer>
                <CardContainer>
                  <h3 className="text-md font-semibold mb-2">Plot Owner</h3>
                  <p> Hanz Chrisrome Chico </p>
                </CardContainer>
              </div>
              <PerformanceCard
                title="Performance"
                location="Location"
                badgeText="Good"
                badgeStyle="badge-success"
                lastChecked="2 hours ago"
                chartSeries={[
                  { name: "Temperature", data: [30, 32, 31, 29, 28] },
                  { name: "Humidity", data: [60, 65, 70, 75, 80] },
                ]}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No plot selected
            </div>
          )}
        </div>
      </div>
    </>
  );
}
