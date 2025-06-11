import { useState } from "react";
import PerformanceCard from "../AreaChart";
import { useReadingStore } from "../../store/useReadingStore";
import { LandPlotIcon, Layers } from "lucide-react";
import CardContainer from "../widgets/CardContainer";
import { Skeleton, ToggleSelector } from "../widgets/Widgets";

export default function PerformanceView() {
  const [viewType, setViewType] = useState<"improved" | "declined">("improved");
  const viewOptions = [
    { label: "Improved", value: "improved" },
    { label: "Declined", value: "declined" },
  ];

  const { plotPerformance, isLoadingPlotPerformance } = useReadingStore();

  const isImproved = viewType === "improved";
  const data = isImproved
    ? plotPerformance?.most_improved
    : plotPerformance?.least_improved;

  const PerformanceSkeleton = () => (
    <CardContainer className="flex flex-col h-full gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-48 w-full" />
    </CardContainer>
  );

  if (isLoadingPlotPerformance) {
    return <PerformanceSkeleton />;
  }

  if (!data) return null;

  return (
    <CardContainer className="flex-flex-col h-full">
      <div className="flex items-start gap-2 justify-between">
        <div className="flex flex-col items-start gap-2">
          <h2 className="text-xl font-semibold text-primary leading-none">
            {isImproved
              ? "Area with Improved Performance"
              : "Area with Decreased Performance"}
          </h2>
          <p className="text-sm font-sembiold text-base-content/70 flex items-center gap-1">
            <LandPlotIcon className="h-4 w-4 text-primary" />
            {data.user_name}
            <span
              className="mx-2 h-4 border-l border-neutral inline-block"
              aria-hidden="true"
            ></span>
            <Layers className="h-4 w-4 text-primary" />
            {data.location}
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <ToggleSelector
            options={viewOptions.map((o) => o.value)}
            selected={viewType}
            onSelect={(val) => setViewType(val as "improved" | "declined")}
            labelMap={{ improved: "Improved", declined: "Declined" }}
          />
        </div>
      </div>

      <PerformanceCard
        chartSeries={[
          {
            name: isImproved ? "Improvement" : "Least Improvement",
            data: data.daily_averages.map((entry) =>
              Math.floor(entry.total_avg)
            ),
            color: isImproved ? "#3b82f6" : "#ef4444",
          },
        ]}
        chartCategories={data.daily_averages.map((entry) =>
          new Date(entry.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        )}
        nutrientAverages={data.daily_averages.map((entry) => ({
          ...entry,
          avg_moisture: entry.avg_moisture ?? 0,
          avg_nitrogen: entry.avg_nitrogen ?? 0,
          avg_phosphorus: entry.avg_phosphorus ?? 0,
          avg_potassium: entry.avg_potassium ?? 0,
        }))}
      />
    </CardContainer>
  );
}
