import { useEffect, useMemo } from "react";
import { useReadingStore } from "../store/AdminStore/useReadingStore";
import { useAuthStore } from "../store/useAuthStore";

export const useMainPageHook = () => {
  const {
    fetchOverallAverage,
    fetchSoilTypes,
    fetchCropTypes,
    fetchPlotsByMunicipality,
    fetchPlotPerformanceSummary,
  } = useReadingStore();
  const { authUser } = useAuthStore();

  const { start, end } = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);
    return {
      start: startDate.toISOString().split("T")[0],
      end: endDate.toISOString().split("T")[0],
    };
  }, []);

  useEffect(() => {
    if (!authUser) return;

    fetchOverallAverage(start, end);
    fetchPlotPerformanceSummary(
      start,
      end,
      authUser.user_municipality || "",
      authUser.user_province || ""
    );
    fetchPlotsByMunicipality(
      authUser.user_municipality || "",
      authUser.user_province || ""
    );
    fetchSoilTypes(
      authUser.user_municipality || "",
      authUser.user_province || ""
    );
    fetchCropTypes(
      authUser.user_municipality || "",
      authUser.user_province || ""
    );
  }, [
    authUser,
    start,
    end,
    fetchOverallAverage,
    fetchPlotPerformanceSummary,
    fetchPlotsByMunicipality,
    fetchSoilTypes,
    fetchCropTypes,
  ]);
};
