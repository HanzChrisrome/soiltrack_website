// src/services/readingService.ts
import { axiosInstance } from "../lib/axios";

export const getOverallAverage = (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  return axiosInstance.get(
    `/readings/overall-plot-average?${params.toString()}`
  );
};

export const getSoilTypes = (municipality: string, province: string) => {
  const params = new URLSearchParams();
  params.append("municipality", municipality);
  params.append("province", province);
  return axiosInstance.get(`/readings/soil-distribution?${params.toString()}`);
};

export const getCropTypes = (municipality: string, province: string) => {
  const params = new URLSearchParams();
  params.append("municipality", municipality);
  params.append("province", province);
  return axiosInstance.get(`/readings/crop-distribution?${params.toString()}`);
};

export const getPlotPerformanceSummary = (
  startDate: string,
  endDate: string,
  municipality: string,
  province: string
) => {
  const params = new URLSearchParams();
  params.append("startDate", startDate);
  params.append("endDate", endDate);
  params.append("municipality", municipality);
  params.append("province", province);
  return axiosInstance.get(
    `/readings/plot-performance-summary?${params.toString()}`
  );
};

export const getPlotsByMunicipality = (
  municipality: string,
  province: string
) => {
  const params = new URLSearchParams();
  params.append("municipality", municipality);
  params.append("province", province);
  return axiosInstance.get(
    `/readings/plots-by-municipality?${params.toString()}`
  );
};

export const getPlotReadingsByDateRange = (
  plotId: number,
  startDate: string,
  endDate: string,
  isForTrends?: boolean
) => {
  const params = new URLSearchParams();
  params.append("plotId", plotId.toString());
  params.append("startDate", startDate);
  params.append("endDate", endDate);

  if (isForTrends) {
    return axiosInstance.get(
      `/readings/get-raw-nutrients?${params.toString()}`
    );
  } else {
    return axiosInstance.get(`/readings/get-nutrients?${params.toString()}`);
  }
};
