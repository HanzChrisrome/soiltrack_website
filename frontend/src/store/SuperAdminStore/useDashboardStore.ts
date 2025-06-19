import { create } from "zustand";
import { Metrics, UsersData } from "../../models/SuperAdminModels";
import {
  fetchLatestMetrics,
  fetchLatestServerMetrics,
  fetchUsersData,
  subscribeToMetrics,
} from "../../service/SuperAdminStore/useDashboardService";

type DashboardState = {
  //SERVER METRICS
  databaseMetrics: Metrics[];
  realTimeMetrics: Metrics[];
  fetchLatestMetrics: (limit?: number) => Promise<void>;
  subscribeToMetrics: () => ReturnType<typeof subscribeToMetrics>;
  fetchLiveMetric: () => Promise<void>;
  lastFetchedAt: Date | null;

  //USER MANAGEMENT DATA
  usersData: UsersData[];
  fetchUsersData: (currentUserId: string) => Promise<void>;
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  //SERVER MANAGEMENT DATA
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

  //USER MANAGEMENT DATA
  usersData: [],
  fetchUsersData: async (currentUserId) => {
    const data = await fetchUsersData(currentUserId);
    if (data) {
      set({ usersData: data });
    } else {
      console.error("❌ Failed to fetch users data");
    }
  },
}));
