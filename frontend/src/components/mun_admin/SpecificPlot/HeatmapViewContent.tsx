import HeatmapChart from "./HeatmapChart";

type DataPoint = {
  x: string;
  y: string;
  value: number;
  color: string;
  time?: string;
};

type DailyHeatMapData = {
  name: string; // nutrient name: moisture, nitrogen, etc.
  values: { value: number | null; time: string }[];
};

type WeeklyHeatmapData = {
  day: string;
  date: string;
  values: { value: number | null; time: string }[];
};

type HeatmapViewContentProps =
  | {
      variant: "daily";
      data: DailyHeatMapData[];
    }
  | {
      variant: "weekly";
      data: WeeklyHeatmapData[];
      nutrient: "moisture" | "nitrogen" | "phosphorus" | "potassium";
    };

const colorMap: Record<string, string> = {
  moisture: "#3b82f6",
  nitrogen: "#fde047",
  phosphorus: "#a78bfa",
  potassium: "#f472b6",
};

const HeatmapViewContent = (props: HeatmapViewContentProps) => {
  if (props.variant === "daily") {
    const { data } = props;
    const seriesData: DataPoint[] = data.flatMap((entry) =>
      entry.values.map(
        (valueObj, index): DataPoint => ({
          x: String(index + 1),
          y: entry.name.toLowerCase(),
          value: typeof valueObj.value === "number" ? valueObj.value : 0,
          color: colorMap[entry.name.toLowerCase()],
          time: valueObj.time,
        })
      )
    );

    console.log("Daily Heatmap Data:", seriesData);

    return <HeatmapChart data={seriesData} variant={props.variant} />;
  } else {
    const { data, nutrient } = props;
    const seriesData: DataPoint[] = data.flatMap((entry) =>
      entry.values
        .slice()
        .sort((a, b) => a.time.localeCompare(b.time))
        .map(
          (valueObj): DataPoint => ({
            x: valueObj.time,
            y: entry.day.slice(0, 3),
            value: typeof valueObj.value === "number" ? valueObj.value : 0,
            color: colorMap[nutrient],
            time: valueObj.time,
          })
        )
    );

    console.log("Weekly Heatmap Data:", seriesData);

    return <HeatmapChart data={seriesData} variant={props.variant} />;
  }
};

export default HeatmapViewContent;
