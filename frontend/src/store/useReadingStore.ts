import { create } from "zustand";
import {
  getOverallAverage,
  getSoilTypes,
  getCropTypes,
  getPlotPerformanceSummary,
  getPlotsByMunicipality,
  getPlotReadingsByDateRange,
  getAiSummaryByPlotId,
  getAnalysisGeneratedCount,
} from "../service/readingService";
import {
  AnalysisSummary,
  CropStat,
  DailyReading,
  ImprovementSummary,
  OverallAverage,
  PlotReadingsTrend,
  SoilTypeStat,
  UserPlots,
} from "../models/readingStoreModels";
import safeAsync from "../utils/safeAsync";

interface ReadingState {
  overallAverage: OverallAverage | null;
  soilTypes: SoilTypeStat[] | null;
  cropTypes: CropStat[] | null;
  userPlots: UserPlots[] | null;
  analysisGeneratedCount: number;
  plotPerformance: ImprovementSummary | null;
  plotReadingsByPlotId: Record<number, DailyReading[]> | null;

  //LOADING FLAGS
  isGettingPlotSummary: boolean;
  isLoadingOverallAverage: boolean;
  isLoadingSoilTypes: boolean;
  isLoadingCropTypes: boolean;
  isLoadingPlotPerformance: boolean;
  isLoadingPlotNutrients: boolean;
  isLoadingAiAnalysis: boolean;

  //FLAGS FOR THE PLOTS PAGE
  hasFetchedAnalysis: boolean;

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

  //FOR THE NUTRIENT TRENDS IN SPECIFIC PLOTS PAGE
  plotNutrientsTrends: Record<number, PlotReadingsTrend[]> | null;
  customPlotNutrientsTrends: PlotReadingsTrend[] | null;
  fetchPlotNutrients: (
    plotId: number,
    startDate: string,
    endDate: string
  ) => Promise<void>;
  fetchCustomDatePlotNutrients: (
    plotId: number,
    startDate: string,
    endDate: string
  ) => Promise<void>;
  setCustomPlotNutrientsTrends: (data: PlotReadingsTrend[] | null) => void;
  fetchAnalysisGeneratedCount: (
    municipality: string,
    province: string,
    date: string
  ) => Promise<void>;

  //FOR THE FETCHING OF AI ANALYSIS
  aiAnalysisByPlotId: Record<number, AnalysisSummary> | null;
  fetchAiAnalysis: (plotId: number) => Promise<void>;

  setSelectedPlotId: (plotId: number | null) => void;
}

export const useReadingStore = create<ReadingState>((set, get) => ({
  overallAverage: null,
  plotPerformance: null,
  userPlots: null,
  soilTypes: null,
  cropTypes: null,
  analysisGeneratedCount: 0,
  plotReadingsByPlotId: {},
  plotNutrientsTrends: {},
  aiAnalysisByPlotId: {},
  customPlotNutrientsTrends: null,
  userSummary: null,
  hasFetchedAnalysis: false,

  isGettingPlotSummary: false,
  isLoadingOverallAverage: false,
  isLoadingSoilTypes: false,
  isLoadingCropTypes: false,
  isLoadingPlotPerformance: false,
  isLoadingPlotNutrients: false,
  isLoadingAiAnalysis: false,

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

  fetchNutrientsReadings: async (
    plotId: number,
    startDate: string,
    endDate: string
  ): Promise<void> => {
    const state = get();

    if (state.plotReadingsByPlotId && state.plotReadingsByPlotId[plotId])
      return;

    set({ isLoadingPlotNutrients: true });
    const data: DailyReading[] = await safeAsync(
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

  fetchPlotNutrients: async (
    plotId: number,
    startDate: string,
    endDate: string
  ): Promise<void> => {
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

  fetchCustomDatePlotNutrients: async (plotId, startDate, endDate) => {
    set({ isLoadingPlotNutrients: true });
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

    set({
      customPlotNutrientsTrends: transformedData,
      isLoadingPlotNutrients: false,
    });
  },

  fetchAiAnalysis: async (plotId: number) => {
    const state = get();

    if (state.aiAnalysisByPlotId && state.aiAnalysisByPlotId[plotId]) return;

    set({ isLoadingAiAnalysis: true });
    const data = await safeAsync(getAiSummaryByPlotId(plotId), undefined);
    if (!data) {
      set({ isLoadingAiAnalysis: false });
      return;
    }
    set((state) => ({
      aiAnalysisByPlotId: {
        ...state.aiAnalysisByPlotId,
        [plotId]: data,
      },
      isLoadingAiAnalysis: false,
    }));
  },

  fetchAnalysisGeneratedCount: async (municipality, province, date) => {
    const state = get();
    if (state.hasFetchedAnalysis) return;

    const data = await safeAsync(
      getAnalysisGeneratedCount(municipality, province, date),
      0
    );

    const count = data?.[0]?.users_generated_daily_analysis_today ?? 0;
    set({ analysisGeneratedCount: count, hasFetchedAnalysis: true });
  },

  setCustomPlotNutrientsTrends: (data) =>
    set({ customPlotNutrientsTrends: data }),
}));
