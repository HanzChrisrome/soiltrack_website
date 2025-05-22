import { useEffect } from "react";
import { useReadingStore } from "../store/useReadingStore";

const useMainPage = () => {
  const {
    overallAverage,
    soilTypes,
    fetchSoilTypes,
    cropTypes,
    fetchCropTypes,
    plotPerformance,
    fetchPlotPerformanceSummary,
  } = useReadingStore();

  useEffect(() => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    const endDate = new Date();

    fetchSoilTypes();
    fetchCropTypes();
    fetchPlotPerformanceSummary(startDate.toISOString(), endDate.toISOString());
  }, []);

  return {
    overallAverage,
    soilTypes,
    cropTypes,
    plotPerformance,
  };
};

export default useMainPage;
