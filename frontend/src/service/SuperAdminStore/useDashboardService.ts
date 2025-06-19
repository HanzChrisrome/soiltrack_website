/* eslint-disable @typescript-eslint/no-unused-vars */
// services/metricsService.ts
import { axiosInstance } from "../../lib/axios";
import supabase from "../../lib/supabase";
import { Metrics, UsersData } from "../../models/SuperAdminModels";

export async function fetchLatestMetrics(
  limit = 10
): Promise<Metrics[] | null> {
  console.log("Fetching latest metrics with limit:", limit);

  const { data, error } = await supabase.rpc("get_latest_server_metrics", {
    limit_count: limit,
  });

  if (error) {
    console.error("❌ Failed to fetch server metrics:", error);
    return null;
  }

  return data as Metrics[];
}

export function subscribeToMetrics(callback: (metric: Metrics) => void) {
  const channel = supabase
    .channel("server-metrics-updates")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "server_metrics",
      },
      (payload) => {
        const newMetric = payload.new as Metrics;
        callback(newMetric);
      }
    )
    .subscribe();

  return channel;
}

export async function fetchLatestServerMetrics(): Promise<Metrics | null> {
  try {
    const { data } = await axiosInstance.get("/server-metrics/server-data");

    return {
      cpu_usage: data.cpuUsagePercent || 0,
      free_memory: data.freeMemory || 0,
      total_memory: data.totalMemory || 0,
      system_uptime: data.systemUptimeSeconds || 0,
      load_average: data.loadAverage || 0,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    // console.error("❌ Failed to fetch latest server metrics:", error);
    return {
      cpu_usage: 0,
      free_memory: 0,
      total_memory: 0,
      system_uptime: 0,
      load_average: 0,
      timestamp: new Date().toISOString(),
    };
  }
}

export async function fetchUsersData(
  currentUserId: string
): Promise<UsersData[] | null> {
  console.log("Fetching users data...");
  const { data, error } = await supabase.rpc("get_users_data", {
    exclude_user_id: currentUserId,
  });

  if (error) {
    console.error("❌ Failed to fetch users data:", error);
    return null;
  }

  console.log("✅ Users data fetched successfully:", data);

  return data as UsersData[];
}
