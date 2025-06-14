import express, { Request, Response } from "express";
import supabase from "../lib/supabase";
import { errorLog, infoLog } from "../utils/logger";
import { axiosInstance } from "../lib/axios";

const router = express.Router();

router.get("/server-data", async (req: Request, res: Response) => {
  infoLog("Received data server request");

  const response = await axiosInstance.get("/server-metrics/get-metrics");
  if (response.status !== 200) {
    errorLog("Error fetching server data:", response.statusText);
    res.status(500).json({ message: "Failed to fetch server data" });
    return;
  }

  res.json(response.data);
});

export default router;
