/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from "react";
import { useReadingStore } from "../store/useReadingStore";
import { useAuthStore } from "../store/useAuthStore";

const getDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 6);
  return {
    start: startDate.toISOString().split("T")[0],
    end: endDate.toISOString().split("T")[0],
  };
};

const useMainPageHook = () => {
  const {
    overallAverage,
    soilTypes,
    fetchSoilTypes,
    cropTypes,
    fetchCropTypes,
    plotPerformance,
    fetchPlotPerformanceSummary,
    userPlots,
    fetchPlotsByMunicipality,
    fetchOverallAverage,
  } = useReadingStore();

  const { authUser } = useAuthStore();
  const { start, end } = useMemo(getDateRange, []);

  const locationReady =
    !!authUser?.user_municipality && !!authUser?.user_province;

  useEffect(() => {
    if (
      !locationReady ||
      (overallAverage && Object.keys(overallAverage).length > 0)
    )
      return;

    fetchOverallAverage(start, end);
  }, [locationReady, overallAverage, fetchOverallAverage, start, end]);

  useEffect(() => {
    if (!locationReady || (userPlots && userPlots.length > 0)) return;

    fetchPlotsByMunicipality(
      authUser.user_municipality,
      authUser.user_province
    );
  }, [locationReady, userPlots, fetchPlotsByMunicipality]);

  useEffect(() => {
    if (
      !locationReady ||
      (plotPerformance && Object.keys(plotPerformance).length > 0)
    )
      return;

    fetchPlotPerformanceSummary(
      start,
      end,
      authUser.user_municipality,
      authUser.user_province
    );
  }, [locationReady, plotPerformance, fetchPlotPerformanceSummary, start, end]);

  useEffect(() => {
    if (!locationReady || (soilTypes && soilTypes.length > 0)) return;

    fetchSoilTypes(authUser.user_municipality, authUser.user_province);
  }, [locationReady, soilTypes, fetchSoilTypes]);

  useEffect(() => {
    if (!locationReady || (cropTypes && cropTypes.length > 0)) return;

    fetchCropTypes(authUser.user_municipality, authUser.user_province);
  }, [locationReady, cropTypes, fetchCropTypes]);

  return {
    overallAverage,
    soilTypes,
    cropTypes,
    plotPerformance,
    userPlots,
  };
};

export default useMainPageHook;
