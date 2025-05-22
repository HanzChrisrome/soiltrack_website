import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

interface ImprovementPlot {
  plot_id: number;
  user_name: string;
  location: string;
  user_barangay: string;
  user_municipality: string;
  user_province: string;
  improvement_score: number;
  daily_averages: {
    date: string;
    avg_moisture: number | null;
    avg_nutrients: number | null;
    total_avg: number;
  }[];
}

interface ImprovementSummary {
  date_range: {
    start_time: string;
    end_time: string;
  };
  most_improved: ImprovementPlot;
  least_improved: ImprovementPlot;
}

interface OverallAverage {
  moisture: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

interface SoilTypeStat {
  soil_type: string;
  count: number;
  percentage: number;
}

interface CropStat {
  crop_name: string;
  count: number;
  percentage: number;
}

interface ReadingState {
  overallAverage: OverallAverage | null;
  soilTypes: SoilTypeStat[] | null;
  cropTypes: CropStat[] | null;
  plotPerformance: ImprovementSummary | null;
  isGettingPlotSummary: boolean;
  fetchOverallAverage: (startDate?: string, endDate?: string) => Promise<void>;
  fetchSoilTypes: () => Promise<void>;
  fetchCropTypes: () => Promise<void>;
  fetchPlotPerformanceSummary: (
    startDate: string,
    endDate: string
  ) => Promise<void>;
}

export const useReadingStore = create<ReadingState>((set) => ({
  overallAverage: null,
  plotPerformance: null,
  isGettingPlotSummary: false,
  soilTypes: null,
  cropTypes: null,

  fetchOverallAverage: async (startDate?: string, endDate?: string) => {
    set({ isGettingPlotSummary: true });

    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await axiosInstance.get(
        `/readings/overall-plot-average?${params.toString()}`
      );
      set({ overallAverage: res.data });
    } catch (err) {
      console.error("Error during checkAuth:", err);
    } finally {
      set({ isGettingPlotSummary: false });
    }
  },

  fetchSoilTypes: async () => {
    try {
      const res = await axiosInstance.get("/readings/soil-distribution");
      set({ soilTypes: res.data });
    } catch (err) {
      console.error("Error fetching soil types:", err);
    }
  },

  fetchCropTypes: async () => {
    try {
      const res = await axiosInstance.get("/readings/crop-distribution");
      set({ cropTypes: res.data });
    } catch (err) {
      console.error("Error fetching crop types:", err);
    }
  },

  fetchPlotPerformanceSummary: async (startDate: string, endDate: string) => {
    try {
      const params = new URLSearchParams();
      params.append("startDate", startDate);
      params.append("endDate", endDate);

      const res = await axiosInstance.get(
        `/readings/plot-performance-summary?${params.toString()}`
      );

      console.info("Plot performance summary data:", res.data);
      set({ plotPerformance: res.data });
    } catch (err) {
      console.error("Error fetching plot performance summary:", err);
    }
  },
}));
