import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3500",
  withCredentials: true,
});
