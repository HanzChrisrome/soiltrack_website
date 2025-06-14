import { create } from "zustand";
import { Metrics } from "../../models/SuperAdminModels";
import {
  fetchLatestMetrics,
  fetchLatestServerMetrics,
  subscribeToMetrics,
} from "../../service/SuperAdminStore/useDashboardService";

type DashboardState = {
  databaseMetrics: Metrics[];
  realTimeMetrics: Metrics[];
  fetchLatestMetrics: (limit?: number) => Promise<void>;
  subscribeToMetrics: () => ReturnType<typeof subscribeToMetrics>;
  fetchLiveMetric: () => Promise<void>;

  lastFetchedAt: Date | null;
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  databaseMetrics: [],
  realTimeMetrics: [],
  lastFetchedAt: null,

  fetchLatestMetrics: async (limit = 10) => {
    const data = await fetchLatestMetrics(limit);
    if (data) {
      set({ databaseMetrics: data, lastFetchedAt: new Date() });
    } else {
      console.error("❌ Failed to fetch latest metrics");
    }
  },

  subscribeToMetrics: () => {
    const channel = subscribeToMetrics((newMetric) => {
      const currentMetrics = get().databaseMetrics;
      set({
        databaseMetrics: [newMetric, ...currentMetrics.slice(0, 9)],
        lastFetchedAt: new Date(),
      });
    });

    return channel;
  },

  fetchLiveMetric: async () => {
    const newMetric = await fetchLatestServerMetrics();
    if (!newMetric) {
      console.error("❌ Failed to fetch live metric");
      return;
    }
    const currentMetrics = get().realTimeMetrics;
    set({ realTimeMetrics: [newMetric, ...currentMetrics.slice(0, 9)] });
  },
}));
