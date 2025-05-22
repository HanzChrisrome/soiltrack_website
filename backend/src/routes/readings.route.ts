import express, { Request, Response } from "express";
import supabase from "../lib/supabase";

const router = express.Router();

router.get("/overall-plot-average", async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    res.status(400).json({ message: "Missing startDate or endDate" });
  }

  const { data, error } = await supabase.rpc("get_overall_plot_average", {
    start_time: startDate,
    end_time: endDate,
  });

  if (error) {
    console.error("Error fetching plot summaries:", error);
    res.status(500).json({ message: error.message });
  }

  res.json(data?.[0] || {});
});

router.get("/soil-distribution", async (req, res) => {
  const { data, error } = await supabase.rpc("get_soil_type_distribution");

  if (error) {
    console.error("Error fetching soil distribution:", error);
    res.status(500).json({ message: error.message });
  }

  console.info("Soil distribution data:", data);
  res.json(data);
});

router.get("/crop-distribution", async (req, res) => {
  const { data, error } = await supabase.rpc("get_crop_distribution");

  if (error) {
    console.error("Error fetching crop distribution:", error);
    res.status(500).json({ message: error.message });
  }

  console.info("Crop distribution data:", data);
  res.json(data);
});

router.get("/plot-performance-summary", async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    res.status(400).json({ message: "Missing startDate or endDate" });
  }

  const { data, error } = await supabase.rpc("get_actual_improvement_summary", {
    start_time: startDate,
    end_time: endDate,
  });

  if (error) {
    console.error("Error fetching performance summary:", error);
    res.status(500).json({ message: error.message });
  }

  console.info("Plot performance summary data:", data);
  res.json(data);
});

export default router;
