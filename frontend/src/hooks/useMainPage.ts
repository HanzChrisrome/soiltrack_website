import { useEffect } from "react";
import { useReadingStore } from "../store/useReadingStore";
import { useAuthStore } from "../store/useAuthStore";

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
    userSummary,
    fetchUserSummary,
  } = useReadingStore();

  const { authUser } = useAuthStore();

  useEffect(() => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    const endDate = new Date();

    if (authUser?.user_municipality && authUser?.user_province) {
      fetchUserSummary(authUser.user_municipality, authUser.user_province);
      fetchPlotsByMunicipality(
        authUser.user_municipality,
        authUser.user_province
      );
      fetchPlotPerformanceSummary(
        startDate.toISOString(),
        endDate.toISOString(),
        authUser.user_municipality,
        authUser.user_province
      );
      fetchSoilTypes(authUser.user_municipality, authUser.user_province);
      fetchCropTypes(authUser.user_municipality, authUser.user_province);
    }
  }, []);

  return {
    overallAverage,
    soilTypes,
    cropTypes,
    plotPerformance,
    userPlots,
    userSummary,
  };
};

export default useMainPageHook;
