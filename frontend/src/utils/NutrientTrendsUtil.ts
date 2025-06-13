import { eachDayOfInterval, format } from "date-fns";
import { ChartSummaryTrend } from "../models/readingStoreModels";

const nutrients = [
  { key: "soil_moisture", label: "Moisture" },
  { key: "readed_nitrogen", label: "Nitrogen" },
  { key: "readed_phosphorus", label: "Phosphorus" },
  { key: "readed_potassium", label: "Potassium" },
];

export const getTodayHeatMap = (raw: ChartSummaryTrend[]) => {
  if (!raw) return [];

  const today = new Date();
  const utcStartOfDay = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );
  const utcEndOfDay = utcStartOfDay + 24 * 60 * 60 * 1000 - 1;

  return nutrients.map((nutrient) => ({
    name: nutrient.label,
    values: raw
      .filter((r) => {
        const readingDate = new Date(r.read_time).getTime();
        return readingDate >= utcStartOfDay && readingDate <= utcEndOfDay;
      })
      .map((r) => {
        const rawValue = r[nutrient.key as keyof ChartSummaryTrend];
        return {
          value:
            typeof rawValue === "number"
              ? rawValue
              : typeof rawValue === "string"
              ? parseFloat(rawValue)
              : null,
          time: new Date(r.read_time).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        };
      }),
  }));
};

export const getWeeklyHeatmapData = (
  raw: ChartSummaryTrend[],
  nutrient:
    | "soil_moisture"
    | "readed_nitrogen"
    | "readed_phosphorus"
    | "readed_potassium"
) => {
  if (!raw) return [];

  const now = new Date();
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 6)
  );

  const end = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  const days = eachDayOfInterval({ start, end });

  return days.map((dayUTC) => {
    const utcStartOfDay = Date.UTC(
      dayUTC.getUTCFullYear(),
      dayUTC.getUTCMonth(),
      dayUTC.getUTCDate()
    );
    const utcEndOfDay = utcStartOfDay + 24 * 60 * 60 * 1000 - 1;

    const matches = raw.filter((r) => {
      const readingDate = new Date(r.read_time).getTime();
      return readingDate >= utcStartOfDay && readingDate <= utcEndOfDay;
    });

    const values = matches
      .map((r) => {
        const rawValue = r[nutrient];
        return {
          value:
            typeof rawValue === "number"
              ? rawValue
              : typeof rawValue === "string"
              ? parseFloat(rawValue)
              : null,
          time: format(new Date(r.read_time), "HH:mm"),
        };
      })
      .filter((entry) => entry.value !== null && !isNaN(entry.value));

    return {
      day: format(new Date(utcStartOfDay), "EEEE"),
      date: format(new Date(utcStartOfDay), "yyyy-MM-dd"),
      values,
    };
  });
};
