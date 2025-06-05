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
    overAllAverage,
    fetchOverallAverage,
  } = useReadingStore();

  const { authUser } = useAuthStore();

  useEffect(() => {
    if (!authUser?.user_municipality || !authUser?.user_province) return;

    const shouldFetchUserSummary = !userSummary || userSummary.length === 0;
    const shouldFetchPlots = !userPlots || userPlots.length === 0;
    const shouldFetchPlotPerformance =
      !plotPerformance || Object.keys(plotPerformance).length === 0;
    const shouldFetchSoilTypes = !soilTypes || soilTypes.length === 0;
    const shouldFetchCropTypes = !cropTypes || cropTypes.length === 0;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    const endDate = new Date();

    if (shouldFetchUserSummary) {
      fetchUserSummary(authUser.user_municipality, authUser.user_province);
    }

    if (shouldFetchPlots) {
      fetchPlotsByMunicipality(
        authUser.user_municipality,
        authUser.user_province
      );
    }

    if (shouldFetchPlotPerformance) {
      fetchPlotPerformanceSummary(
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0],
        authUser.user_municipality,
        authUser.user_province
      );
    }

    if (shouldFetchSoilTypes) {
      fetchSoilTypes(authUser.user_municipality, authUser.user_province);
    }

    if (shouldFetchCropTypes) {
      fetchCropTypes(authUser.user_municipality, authUser.user_province);
    }
  }, [
    authUser,
    userSummary,
    userPlots,
    soilTypes,
    cropTypes,
    plotPerformance,
    fetchUserSummary,
    fetchPlotsByMunicipality,
    fetchPlotPerformanceSummary,
    fetchSoilTypes,
    fetchCropTypes,
  ]);

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
