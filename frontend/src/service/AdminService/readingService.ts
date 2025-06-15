/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/readingService.ts
import supabase from "../../lib/supabase";
import { AnalysisSummary } from "../../models/readingStoreModels";

export const getOverallAverage = async (
  startDate?: string,
  endDate?: string
) => {
  console.info("Fetching overall plot average");

  if (!startDate || !endDate) {
    console.warn("Missing startDate or endDate for overall average");
    return;
  }

  const { data, error } = await supabase.rpc("get_overall_plot_average", {
    start_time: startDate,
    end_time: endDate,
  });

  if (error) {
    console.error("Error fetching overall plot average:", error);
    throw new Error(error.message);
  }

  return data?.[0] ?? null;
};

export const getSoilTypes = async (municipality: string, province: string) => {
  console.log("Fetching soil types");

  if (!municipality || !province) {
    console.warn("Missing municipality or province for soil types");
    return;
  }

  const { data, error } = await supabase.rpc("get_soil_type_distribution", {
    target_municipality: municipality,
    target_province: province,
  });

  if (error) {
    console.error("Error fetching soil types:", error);
    throw new Error(error.message);
  }

  return data || [];
};

export const getCropTypes = async (municipality: string, province: string) => {
  console.info("Fetching crop types");

  if (!municipality || !province) {
    console.warn("Missing municipality or province for crop types");
    return;
  }

  const { data, error } = await supabase.rpc("get_crop_distribution", {
    target_municipality: municipality,
    target_province: province,
  });

  if (error) {
    console.error("Error fetching crop types:", error);
    throw new Error(error.message);
  }

  return data || [];
};

export const getPlotPerformanceSummary = async (
  startDate: string,
  endDate: string,
  municipality: string,
  province: string
) => {
  console.info("Fetching plot performance summary");

  if (!startDate || !endDate || !municipality || !province) {
    console.warn("Missing parameters for plot performance summary");
    return;
  }

  const { data, error } = await supabase.rpc("get_plot_improvement_summary", {
    start_time: startDate,
    end_time: endDate,
    target_municipality: municipality,
    target_province: province,
  });

  if (error) {
    console.error("Error fetching plot performance summary:", error);
    throw new Error(error.message);
  }

  return data || [];
};

export const getPlotsByMunicipality = async (
  municipality: string,
  province: string
) => {
  console.info("Fetching plots by municipality");

  if (!municipality || !province) {
    console.warn("Missing municipality or province for plots");
    return;
  }

  const { data, error } = await supabase.rpc("get_user_plots_by_municipality", {
    target_municipality: municipality,
    target_province: province,
  });

  if (error) {
    console.error("Error fetching plots by municipality:", error);
    throw new Error(error.message);
  }

  const safeData = Array.isArray(data) ? data : [];
  const normalizedData = safeData.map((plot: any) => ({
    ...plot,
    polygons: Array.isArray(plot.polygons)
      ? plot.polygons.map((point: any) => {
          if (typeof point === "object" && "lat" in point && "lng" in point) {
            return [point.lat, point.lng];
          }
          if (Array.isArray(point) && point.length === 2) {
            return point;
          }
          return [0, 0];
        })
      : [],
  }));

  return normalizedData || [];
};

export const getPlotReadingsByDateRange = async (
  plotId: number,
  startDate: string,
  endDate: string,
  isForTrends?: boolean
) => {
  console.info("Fetching plot readings by date range");

  if (!plotId || !startDate || !endDate) {
    console.warn("Missing parameters for plot readings");
    return;
  }

  let plotReadingData;

  if (isForTrends) {
    const { data, error } = await supabase.rpc("get_plot_raw_readings", {
      p_plot_id: parseInt(plotId.toString()),
      p_start_date: startDate,
      p_end_date: endDate,
    });

    if (error) {
      console.error("Error fetching raw readings:", error);
      return [];
    }

    plotReadingData = data || [];
  } else {
    const { data, error } = await supabase.rpc(
      "get_plot_readings_by_date_range",
      {
        p_plot_id: parseInt(plotId.toString()),
        p_start_date: startDate,
        p_end_date: endDate,
      }
    );

    if (error) {
      console.error("Error fetching plot readings:", error);
      throw new Error(error.message);
    }

    plotReadingData = data || [];
  }

  return plotReadingData;
};

export const getAiSummaryByPlotId = async (
  plotId: number
): Promise<AnalysisSummary | null> => {
  console.info("Fetching AI summary for plot ID:", plotId);

  if (!plotId) {
    console.warn("Missing plotId for AI summary");
    return null;
  }

  const { data, error } = await supabase.rpc("get_plot_ai_analysis", {
    plot_id_input: plotId,
  });

  if (error) {
    console.error("Error fetching AI summary:", error);
    return null;
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn("No AI summary found for plot ID:", plotId);
    return null;
  }

  const result = data[0];

  if (typeof result.analysis === "string") {
    try {
      result.analysis = JSON.parse(result.analysis);
    } catch (e) {
      console.error("Failed to parse analysis JSON", e);
      return null;
    }
  }

  return result as AnalysisSummary;
};

export const getAnalysisGeneratedCount = async (
  municipality: string,
  province: string,
  date: string
) => {
  console.info(
    "Fetching analysis generated count for:",
    municipality,
    province,
    date
  );

  if (!municipality || !province || !date) {
    console.warn("Missing parameters for analysis generated count");
    return;
  }

  const { data, error } = await supabase.rpc(
    "get_daily_analysis_user_counts_filtered",
    {
      target_municipality: municipality,
      target_province: province,
      target_date: date,
    }
  );

  if (error) {
    console.error("Error fetching analysis generated count:", error);
    throw new Error(error.message);
  }

  return data || [];
};
