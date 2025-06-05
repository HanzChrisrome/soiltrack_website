import express, { Request, Response } from "express";
import supabase from "../lib/supabase";
import { errorLog, infoLog } from "../utils/logger";

const router = express.Router();

router.get("/user-summary", async (req: Request, res: Response) => {
  const { municipality, province } = req.query;
  infoLog("Received user summary request");

  if (!municipality || !province) {
    res.status(400).json({ message: "Missing municipality or province" });
    return;
  }

  const { data, error } = await supabase.rpc("get_users_summary", {
    target_municipality: municipality,
    target_province: province,
  });

  if (error) {
    errorLog("Error fetching user summary:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  res.json(data);
});

export default router;
