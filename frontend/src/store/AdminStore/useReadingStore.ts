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
  getIrrigationSummaryByPlotId,
} from "../../service/AdminService/readingService";

import {
  AnalysisSummary,
  ChartSummaryTrend,
  CropStat,
  ImprovementSummary,
  OverallAverage,
  PlotReadingsTrend,
  SoilTypeStat,
  UserPlots,
  IrrigationLogSummary,
} from "../../models/readingStoreModels";

interface ReadingState {
  // Data
  overallAverage: OverallAverage | null;
  soilTypes: SoilTypeStat[] | null;
  cropTypes: CropStat[] | null;
  userPlots: UserPlots[] | null;
  analysisGeneratedCount: number;
  plotPerformance: ImprovementSummary | null;
  plotReadingsByPlotId: Record<number, PlotReadingsTrend[]>;
  plotNutrientsTrends: Record<number, PlotReadingsTrend[]>;
  chartNutrientTrends: Record<number, ChartSummaryTrend[]>;
  customPlotNutrientsTrends: ChartSummaryTrend[] | null;
  aiAnalysisByPlotId: Record<number, AnalysisSummary | null>;
  irrigationSummaryByPlotId: Record<number, IrrigationLogSummary[]>;

  // UI State
  selectedPlotId: number | null;

  // Loading Flags
  isLoadingOverallAverage: boolean;
  isLoadingSoilTypes: boolean;
  isLoadingCropTypes: boolean;
  isLoadingPlotPerformance: boolean;
  isLoadingPlotNutrients: boolean;
  isLoadingAiAnalysis: boolean;
  isLoadingIrrigationSummary: boolean;

  // Fetch Control Flags
  hasFetchedOverallAverage: boolean;
  hasFetchedAnalysis: boolean;

  // Actions
  fetchOverallAverage: (startDate?: string, endDate?: string) => Promise<void>;
  fetchSoilTypes: (municipality: string, province: string) => Promise<void>;
  fetchCropTypes: (municipality: string, province: string) => Promise<void>;
  fetchIrrigationSummaryByPlotId: (plotId: number) => Promise<void>;
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

  fetchPlotNutrients: (
    plotId: number,
    startDate: string,
    endDate: string,
    isForTrends?: boolean
  ) => Promise<void>;

  fetchChartNutrients: (
    plotId: number,
    startDate: string,
    endDate: string
  ) => Promise<void>;

  fetchCustomDatePlotNutrients: (
    plotId: number,
    startDate: string,
    endDate: string
  ) => Promise<void>;

  fetchAiAnalysis: (plotId: number) => Promise<void>;
  fetchAnalysisGeneratedCount: (
    municipality: string,
    province: string,
    date: string
  ) => Promise<void>;

  setCustomPlotNutrientsTrends: (data: ChartSummaryTrend[] | null) => void;
  setSelectedPlotId: (plotId: number | null) => void;
}

export const useReadingStore = create<ReadingState>((set, get) => ({
  // Initial State
  overallAverage: null,
  soilTypes: null,
  cropTypes: null,
  userPlots: null,
  plotPerformance: null,
  analysisGeneratedCount: 0,
  plotReadingsByPlotId: {},
  plotNutrientsTrends: {},
  chartNutrientTrends: {},
  customPlotNutrientsTrends: null,
  aiAnalysisByPlotId: {},
  selectedPlotId: null,
  irrigationSummaryByPlotId: {},

  // Loading
  isLoadingOverallAverage: false,
  isLoadingSoilTypes: false,
  isLoadingCropTypes: false,
  isLoadingPlotPerformance: false,
  isLoadingPlotNutrients: false,
  isLoadingAiAnalysis: false,
  isLoadingIrrigationSummary: false,

  // Flags
  hasFetchedOverallAverage: false,
  hasFetchedAnalysis: false,

  // Actions

  fetchOverallAverage: async (startDate, endDate) => {
    if (get().hasFetchedOverallAverage) return;
    set({ isLoadingOverallAverage: true });

    const data = await getOverallAverage(startDate, endDate);
    set({
      overallAverage: data,
      isLoadingOverallAverage: false,
      hasFetchedOverallAverage: true,
    });
  },

  fetchSoilTypes: async (municipality, province) => {
    if (get().hasFetchedOverallAverage) return;
    set({ isLoadingSoilTypes: true });

    const data = await getSoilTypes(municipality, province);
    set({
      soilTypes: data,
      isLoadingSoilTypes: false,
      hasFetchedOverallAverage: true,
    });
  },

  fetchCropTypes: async (municipality, province) => {
    if (get().hasFetchedOverallAverage) return;
    set({ isLoadingCropTypes: true });

    const data = await getCropTypes(municipality, province);
    set({
      cropTypes: data,
      isLoadingCropTypes: false,
      hasFetchedOverallAverage: true,
    });
  },

  fetchPlotPerformanceSummary: async (
    startDate,
    endDate,
    municipality,
    province
  ) => {
    if (get().hasFetchedOverallAverage) return;
    set({ isLoadingPlotPerformance: true });

    const data = await getPlotPerformanceSummary(
      startDate,
      endDate,
      municipality,
      province
    );

    set({
      plotPerformance: data,
      isLoadingPlotPerformance: false,
      hasFetchedOverallAverage: true,
    });
  },

  fetchPlotsByMunicipality: async (municipality, province) => {
    if (get().hasFetchedOverallAverage) return;
    const data = await getPlotsByMunicipality(municipality, province);
    set({ userPlots: data, hasFetchedOverallAverage: true });
  },

  fetchPlotNutrients: async (
    plotId,
    startDate,
    endDate,
    isForTrends = false
  ) => {
    const existing = get().plotNutrientsTrends[plotId];
    if (existing) return;

    set({ isLoadingPlotNutrients: true });
    const data = await getPlotReadingsByDateRange(
      plotId,
      startDate,
      endDate,
      isForTrends
    );

    set((state) => ({
      plotNutrientsTrends: {
        ...state.plotNutrientsTrends,
        [plotId]: data ?? [],
      },
      isLoadingPlotNutrients: false,
    }));
  },

  fetchChartNutrients: async (plotId, startDate, endDate) => {
    const existing = get().chartNutrientTrends[plotId];
    if (existing) return;

    set({ isLoadingPlotNutrients: true });
    const data = await getPlotReadingsByDateRange(
      plotId,
      startDate,
      endDate,
      true
    );

    set((state) => ({
      chartNutrientTrends: {
        ...state.chartNutrientTrends,
        [plotId]: data ?? [],
      },
      isLoadingPlotNutrients: false,
    }));
  },

  fetchCustomDatePlotNutrients: async (plotId, startDate, endDate) => {
    set({ isLoadingPlotNutrients: true });
    const data = await getPlotReadingsByDateRange(
      plotId,
      startDate,
      endDate,
      true
    );

    if (!data?.length) {
      console.warn("No data found for plot:", plotId);
      set({ isLoadingPlotNutrients: false });
      return;
    }

    set({
      customPlotNutrientsTrends: data,
      isLoadingPlotNutrients: false,
    });
  },

  fetchAiAnalysis: async (plotId) => {
    const exists = get().aiAnalysisByPlotId[plotId];
    if (exists !== undefined) return;

    set({ isLoadingAiAnalysis: true });

    const data = await getAiSummaryByPlotId(plotId);

    console.log("Data fetched: ", data);

    if (!data || !data.analysis?.AI_Analysis) {
      console.warn("Invalid or missing AI_Analysis data");

      set((state) => ({
        aiAnalysisByPlotId: {
          ...state.aiAnalysisByPlotId,
          [plotId]: null,
        },
        isLoadingAiAnalysis: false,
      }));

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
    if (get().hasFetchedAnalysis) return;

    const data = await getAnalysisGeneratedCount(municipality, province, date);
    const count = data?.[0]?.users_generated_daily_analysis_today ?? 0;

    set({ analysisGeneratedCount: count, hasFetchedAnalysis: true });
  },

  setCustomPlotNutrientsTrends: (data) => {
    set({ customPlotNutrientsTrends: data });
  },

  setSelectedPlotId: (plotId) => {
    set({ selectedPlotId: plotId });
  },

  fetchIrrigationSummaryByPlotId: async (plotId) => {
    set({ isLoadingIrrigationSummary: true });

    const data = await getIrrigationSummaryByPlotId(plotId);

    set((state) => ({
      irrigationSummaryByPlotId: {
        ...state.irrigationSummaryByPlotId,
        [plotId]: data ?? [],
      },
      isLoadingIrrigationSummary: false,
    }));
  },
}));
