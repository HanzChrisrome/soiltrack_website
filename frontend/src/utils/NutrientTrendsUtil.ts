import { eachDayOfInterval, format } from "date-fns";
import { PlotReadingsTrend } from "../models/readingStoreModels";

const nutrients = ["moisture", "nitrogen", "phosphorus", "potassium"] as const;

export const getTodayHeatMap = (raw: PlotReadingsTrend[]) => {
  if (!raw) return [];

  const today = new Date();
  const utcStartOfDay = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );
  const utcEndOfDay = utcStartOfDay + 24 * 60 * 60 * 1000 - 1;

  return nutrients.map((nutrient) => ({
    name: nutrient.charAt(0).toUpperCase() + nutrient.slice(1),
    values: raw
      .filter((r) => {
        const readingDate = new Date(r.reading_date).getTime();
        return readingDate >= utcStartOfDay && readingDate <= utcEndOfDay;
      })
      .map((r) => ({
        value: r[nutrient],
        time: new Date(r.reading_date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      })),
  }));
};

export const getWeeklyHeatmapData = (
  raw: PlotReadingsTrend[],
  nutrient: "moisture" | "nitrogen" | "phosphorus" | "potassium"
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
      const readingDate = new Date(r.reading_date).getTime();
      return readingDate >= utcStartOfDay && readingDate <= utcEndOfDay;
    });

    const values = matches
      .map((r) => ({
        value: r[nutrient],
        time: format(new Date(r.reading_date), "HH:mm"),
      }))
      .filter((entry) => entry.value !== null && entry.value !== undefined);

    return {
      day: format(new Date(utcStartOfDay), "EEEE"),
      date: format(new Date(utcStartOfDay), "yyyy-MM-dd"),
      values,
    };
  });
};
