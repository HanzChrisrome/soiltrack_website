import { create } from "zustand";
import {
  getOverallAverage,
  getSoilTypes,
  getCropTypes,
  getPlotPerformanceSummary,
  getPlotsByMunicipality,
  getPlotReadingsByDateRange,
  getUserSummary,
} from "../service/readingService";
import axios from "axios";
import {
  CropStat,
  DailyReading,
  ImprovementSummary,
  OverallAverage,
  PlotReadingsTrend,
  SoilTypeStat,
  UserPlots,
  UserSummary,
} from "../models/readingStoreModels";

interface ReadingState {
  overallAverage: OverallAverage | null;
  soilTypes: SoilTypeStat[] | null;
  cropTypes: CropStat[] | null;
  userPlots: UserPlots[] | null;
  plotPerformance: ImprovementSummary | null;
  plotReadingsByPlotId: Record<number, DailyReading[]> | null;
  plotNutrientsTrends: Record<number, PlotReadingsTrend[]> | null;
  userSummary: UserSummary[] | null;

  isGettingPlotSummary: boolean;
  isLoadingOverallAverage: boolean;
  isLoadingSoilTypes: boolean;
  isLoadingCropTypes: boolean;
  isLoadingPlotPerformance: boolean;
  isLoadingPlotNutrients: boolean;

  selectedPlotId: number | null;
  getPlotReadings: (plotId: number) => DailyReading[] | null;
  getPlotNutrientsTrend: (plotId: number) => PlotReadingsTrend[] | null;

  fetchOverallAverage: (startDate?: string, endDate?: string) => Promise<void>;
  fetchSoilTypes: (municipality: string, province: string) => Promise<void>;
  fetchCropTypes: (municipality: string, province: string) => Promise<void>;
  fetchPlotPerformanceSummary: (
    startDate: string,
    endDate: string,
    municipality: string,
    province: string
  ) => Promise<void>;
  fetchPlotsByMunicipality: (
    municipality: string,
    province: string
  ) => Promise<void>;
  fetchNutrientsReadings: (
    plotId: number,
    startDate: string,
    endDate: string
  ) => Promise<void>;
  fetchUserSummary: (municipality: string, province: string) => Promise<void>;
  fetchPlotNutrients: (
    plotId: number,
    startDate: string,
    endDate: string
  ) => Promise<void>;

  setSelectedPlotId: (plotId: number | null) => void;
}

const safeAsync = async <T>(
  promise: Promise<{ data: T }>,
  fallback: T
): Promise<T> => {
  try {
    const res = await promise;
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error("Unexpected error:", error);
    }
    return fallback;
  }
};

export const useReadingStore = create<ReadingState>((set, get) => ({
  overallAverage: null,
  plotPerformance: null,
  userPlots: null,
  soilTypes: null,
  cropTypes: null,
  plotReadingsByPlotId: {},
  plotNutrientsTrends: {},
  userSummary: null,

  isGettingPlotSummary: false,
  isLoadingOverallAverage: false,
  isLoadingSoilTypes: false,
  isLoadingCropTypes: false,
  isLoadingPlotPerformance: false,
  isLoadingPlotNutrients: false,

  selectedPlotId: null,

  fetchOverallAverage: async (startDate?: string, endDate?: string) => {
    set({ isLoadingOverallAverage: true });
    const data = await safeAsync(getOverallAverage(startDate, endDate), null);
    set({ overallAverage: data, isLoadingOverallAverage: false });
  },

  fetchSoilTypes: async (municipality, province) => {
    set({ isLoadingSoilTypes: true });
    const data = await safeAsync(getSoilTypes(municipality, province), []);
    set({ soilTypes: data, isLoadingSoilTypes: false });
  },

  fetchCropTypes: async (municipality, province) => {
    set({ isLoadingCropTypes: true });
    const data = await safeAsync(getCropTypes(municipality, province), []);
    set({ cropTypes: data, isLoadingCropTypes: false });
  },

  fetchPlotPerformanceSummary: async (
    startDate,
    endDate,
    municipality,
    province
  ) => {
    set({ isLoadingPlotPerformance: true });
    const data = await safeAsync(
      getPlotPerformanceSummary(startDate, endDate, municipality, province),
      null
    );
    set({ plotPerformance: data, isLoadingPlotPerformance: false });
  },

  fetchPlotsByMunicipality: async (municipality, province) => {
    const data = await safeAsync(
      getPlotsByMunicipality(municipality, province),
      null
    );
    set({ userPlots: data });
  },

  fetchNutrientsReadings: async (plotId, startDate, endDate) => {
    const state = get();

    if (state.plotReadingsByPlotId && state.plotReadingsByPlotId[plotId])
      return;

    set({ isLoadingPlotNutrients: true });
    const data = await safeAsync(
      getPlotReadingsByDateRange(plotId, startDate, endDate),
      []
    );

    set((state) => ({
      plotReadingsByPlotId: {
        ...state.plotReadingsByPlotId,
        [plotId]: data,
      },
      isLoadingPlotNutrients: false,
    }));
  },

  fetchPlotNutrients: async (plotId, startDate, endDate) => {
    const state = get();
    if (state.plotNutrientsTrends && state.plotNutrientsTrends[plotId]) return;

    set({ isLoadingPlotNutrients: true });
    console.log("Fetching nutrients for plot:", plotId, startDate, endDate);
    const rawData = await safeAsync(
      getPlotReadingsByDateRange(plotId, startDate, endDate, true),
      []
    );

    if (!rawData || rawData.length === 0) {
      console.warn("No nutrient data found for plot:", plotId);
      set({ isLoadingPlotNutrients: false });
      return;
    }

    const transformedData = rawData.timestamps.map(
      (timestamp: string, index: number) => ({
        reading_date: timestamp,
        moisture: rawData.moisture[index] ?? null,
        nitrogen: rawData.nitrogen[index] ?? null,
        phosphorus: rawData.phosphorus[index] ?? null,
        potassium: rawData.potassium[index] ?? null,
      })
    );

    set((state) => ({
      plotNutrientsTrends: {
        ...state.plotNutrientsTrends,
        [plotId]: transformedData,
      },
      isLoadingPlotNutrients: false,
    }));
  },

  fetchUserSummary: async (municipality, province) => {
    const data = await safeAsync(getUserSummary(municipality, province), []);
    set({ userSummary: data });
  },

  setSelectedPlotId: (plotId) => set({ selectedPlotId: plotId }),

  getPlotReadings: (plotId) => {
    const plotReadings = get().plotReadingsByPlotId;
    return plotReadings && plotReadings[plotId] ? plotReadings[plotId] : null;
  },

  getPlotNutrientsTrend: (plotId) => {
    const plotNutrients = get().plotNutrientsTrends;
    return plotNutrients && plotNutrients[plotId]
      ? plotNutrients[plotId]
      : null;
  },
}));
