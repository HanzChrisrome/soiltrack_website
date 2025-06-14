import { create } from "zustand";
import { Metrics } from "../../models/SuperAdminModels";
import {
  fetchLatestMetrics,
  fetchLatestServerMetrics,
  subscribeToMetrics,
} from "../../service/SuperAdminStore/useDashboardService";

type DashboardState = {
  metrics: Metrics[];
  fetchLatestMetrics: (limit?: number) => Promise<void>;
  subscribeToMetrics: () => ReturnType<typeof subscribeToMetrics>;
  fetchLiveMetric: () => Promise<void>;
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  metrics: [],
  fetchLatestMetrics: async (limit = 10) => {
    const data = await fetchLatestMetrics(limit);
    if (data) {
      set({ metrics: data });
    } else {
      console.error("❌ Failed to fetch latest metrics");
    }
  },

  subscribeToMetrics: () => {
    const channel = subscribeToMetrics((newMetric) => {
      const currentMetrics = get().metrics;
      set({ metrics: [newMetric, ...currentMetrics.slice(0, 9)] });
    });

    return channel;
  },

  fetchLiveMetric: async () => {
    const newMetric = await fetchLatestServerMetrics();
    if (!newMetric) {
      console.error("❌ Failed to fetch live metric");
      return;
    }
    const currentMetrics = get().metrics;
    set({ metrics: [newMetric, ...currentMetrics.slice(0, 9)] });
  },
}));
