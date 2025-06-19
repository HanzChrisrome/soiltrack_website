export type Metrics = {
  id?: number;
  timestamp: string;
  cpu_usage: number;
  free_memory: number;
  total_memory: number;
  load_average: number;
  system_uptime: number;
};

export type UsersData = {
  user_id: string;
  user_name: string;
  user_email: string;
  user_address: string;
  mac_address: string;
  device_status: string;
};
