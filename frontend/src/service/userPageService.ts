import { axiosInstance } from "../lib/axios";

//src/service/userPageService.ts
export const getUserSummary = (municipality: string, province: string) => {
  const params = new URLSearchParams();
  params.append("municipality", municipality);
  params.append("province", province);
  return axiosInstance.get(`/user-readings/user-summary?${params.toString()}`);
};
