import express, { Request, Response } from "express";
import supabase from "../lib/supabase";
import { errorLog, infoLog } from "../utils/logger";
import { axiosInstance } from "../lib/axios";

const router = express.Router();

router.get("/server-data", async (req: Request, res: Response) => {
  infoLog("Received data server request");

  try {
    const response = await axiosInstance.get("/server-metrics/get-metrics");

    if (response.status !== 200) {
      errorLog(`Server responded with status: ${response.status}`);
      res.status(502).json({ message: "Upstream server error" });
    }

    res.json(response.data);
  } catch (error: any) {
    errorLog("Error fetching server metrics", error);
    res
      .status(500)
      .json({ message: "Failed to fetch server data", error: error.message });
  }
});

export default router;
