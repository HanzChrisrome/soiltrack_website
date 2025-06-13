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
} from "../../service/readingService";
import {
  AnalysisSummary,
  CropStat,
  DailyReading,
  ImprovementSummary,
  OverallAverage,
  PlotReadingsTrend,
  SoilTypeStat,
  UserPlots,
} from "../../models/readingStoreModels";

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
  hasFetchedOverallAverage: boolean;

  selectedPlotId: number | null;

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

  //FOR THE NUTRIENT TRENDS IN SPECIFIC PLOTS PAGE
  plotNutrientsTrends: Record<number, DailyReading[]> | null;
  chartNutrientTrends: Record<number, PlotReadingsTrend[]> | null;
  customPlotNutrientsTrends: PlotReadingsTrend[] | null;
  fetchPlotNutrients: (
    plotId: number,
    startDate: string,
    endDate: string
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

  aiAnalysisByPlotId: {},
  customPlotNutrientsTrends: null,
  userSummary: null,

  //CHART DATA
  plotNutrientsTrends: {},
  chartNutrientTrends: {},

  //FETCHING FLAGS
  hasFetchedAnalysis: false,
  hasFetchedOverallAverage: false,

  isGettingPlotSummary: false,
  isLoadingOverallAverage: false,
  isLoadingSoilTypes: false,
  isLoadingCropTypes: false,
  isLoadingPlotPerformance: false,
  isLoadingPlotNutrients: false,
  isLoadingAiAnalysis: false,

  selectedPlotId: null,

  fetchOverallAverage: async (startDate?: string, endDate?: string) => {
    const state = get();
    if (state.hasFetchedOverallAverage) return;

    set({ isLoadingOverallAverage: true });
    const data = await getOverallAverage(startDate, endDate);
    set({
      overallAverage: data,
      isLoadingOverallAverage: false,
      hasFetchedOverallAverage: true,
    });
  },

  fetchSoilTypes: async (municipality, province) => {
    const state = get();
    if (state.hasFetchedOverallAverage) return;

    set({ isLoadingSoilTypes: true });
    const data = await getSoilTypes(municipality, province);
    set({
      soilTypes: data,
      isLoadingSoilTypes: false,
      hasFetchedOverallAverage: true,
    });
  },

  fetchCropTypes: async (municipality, province) => {
    const state = get();
    if (state.hasFetchedOverallAverage) return;

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
    const state = get();
    if (state.hasFetchedOverallAverage) return;

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
    const state = get();
    if (state.hasFetchedOverallAverage) return;

    const data = await getPlotsByMunicipality(municipality, province);
    set({ userPlots: data, hasFetchedOverallAverage: true });
  },

  fetchPlotNutrients: async (
    plotId: number,
    startDate: string,
    endDate: string,
    isForTrends: boolean = false
  ): Promise<void> => {
    const state = get();
    if (state.plotNutrientsTrends && state.plotNutrientsTrends[plotId]) return;

    set({ isLoadingPlotNutrients: true });

    const data: DailyReading[] =
      (await getPlotReadingsByDateRange(
        plotId,
        startDate,
        endDate,
        isForTrends
      )) ?? [];

    set((state) => ({
      plotNutrientsTrends: {
        ...state.plotNutrientsTrends,
        [plotId]: data,
      },
      isLoadingPlotNutrients: false,
    }));
  },

  fetchChartNutrients: async (
    plotId: number,
    startDate: string,
    endDate: string
  ) => {
    const state = get();
    if (state.chartNutrientTrends && state.chartNutrientTrends[plotId]) return;

    set({ isLoadingPlotNutrients: true });

    const data: PlotReadingsTrend[] =
      (await getPlotReadingsByDateRange(plotId, startDate, endDate)) ?? [];

    set((state) => ({
      chartNutrientTrends: {
        ...state.chartNutrientTrends,
        [plotId]: data,
      },
      isLoadingPlotNutrients: false,
    }));
  },

  fetchCustomDatePlotNutrients: async (plotId, startDate, endDate) => {
    set({ isLoadingPlotNutrients: true });
    const rawData = await getPlotReadingsByDateRange(
      plotId,
      startDate,
      endDate,
      true
    );

    if (!rawData || rawData.length === 0) {
      console.warn("No nutrient data found for plot:", plotId);
      set({ isLoadingPlotNutrients: false });
      return;
    }

    set({
      customPlotNutrientsTrends: rawData,
      isLoadingPlotNutrients: false,
    });
  },

  fetchAiAnalysis: async (plotId: number) => {
    const state = get();

    if (state.aiAnalysisByPlotId && state.aiAnalysisByPlotId[plotId]) return;

    set({ isLoadingAiAnalysis: true });
    const data = await getAiSummaryByPlotId(plotId);
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

    const data = await getAnalysisGeneratedCount(municipality, province, date);

    const count = data?.[0]?.users_generated_daily_analysis_today ?? 0;
    set({ analysisGeneratedCount: count, hasFetchedAnalysis: true });
  },

  setCustomPlotNutrientsTrends: (data) =>
    set({ customPlotNutrientsTrends: data }),

  setSelectedPlotId: (plotId) => set({ selectedPlotId: plotId }),
}));
