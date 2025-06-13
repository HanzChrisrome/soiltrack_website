import express, { Request, Response } from "express";
import supabase from "../lib/supabase";
import { errorLog, infoLog } from "../utils/logger";
import { info } from "console";

const router = express.Router();

router.get("/overall-plot-average", async (req, res) => {
  const { startDate, endDate } = req.query;
  infoLog("Received overall plot average request");

  if (!startDate || !endDate) {
    res.status(400).json({ message: "Missing startDate or endDate" });
    return;
  }

  const { data, error } = await supabase.rpc("get_overall_plot_average", {
    start_time: startDate,
    end_time: endDate,
  });

  if (error) {
    errorLog("Error fetching overall plot average:", error);
    res.status(500).json({ message: error.message });
  }

  res.json(data?.[0] || {});
});

router.get("/soil-distribution", async (req, res) => {
  const { municipality, province } = req.query;

  if (!municipality || !province) {
    res.status(400).json({ message: "Missing municipality or province" });
    return;
  }

  const { data, error } = await supabase.rpc("get_soil_type_distribution", {
    target_municipality: municipality,
    target_province: province,
  });

  infoLog("Received soil distribution request");

  if (error) {
    errorLog("Error fetching soil distribution:", error);
    res.status(500).json({ message: error.message });
  }

  res.json(data);
});

router.get("/crop-distribution", async (req, res) => {
  const { municipality, province } = req.query;

  if (!municipality || !province) {
    res.status(400).json({ message: "Missing municipality or province" });
    return;
  }

  const { data, error } = await supabase.rpc("get_crop_distribution", {
    target_municipality: municipality,
    target_province: province,
  });

  infoLog("Received crop distribution request");

  if (error) {
    errorLog("Error fetching crop distribution:", error);
    res.status(500).json({ message: error.message });
  }

  res.json(data);
});

router.get("/plot-performance-summary", async (req: Request, res: Response) => {
  const { startDate, endDate, municipality, province } = req.query;
  infoLog("Received plot performance summary request");

  if (!startDate || !endDate || !municipality || !province) {
    infoLog("Missing parameters for plot performance summary");
    res.status(400).json({ message: "Missing startDate or endDate" });
    return;
  }

  const { data, error } = await supabase.rpc("get_plot_improvement_summary", {
    start_time: startDate,
    end_time: endDate,
    target_municipality: municipality,
    target_province: province,
  });

  if (error) {
    errorLog("Error fetching plot performance summary:", error);
    res.status(500).json({ message: error.message });
  }

  res.json(data);
});

router.get("/plots-by-municipality", async (req: Request, res: Response) => {
  const { municipality, province } = req.query;
  infoLog("Received plots by municipality request");

  if (!municipality || !province) {
    res.status(400).json({ message: "Missing municipality or province" });
    return;
  }

  const { data, error } = await supabase.rpc("get_user_plots_by_municipality", {
    target_municipality: municipality,
    target_province: province,
  });

  if (error) {
    errorLog("Error fetching plots by municipality:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  console.log("Plots by municipality data:", data);

  const safeData = Array.isArray(data) ? data : [];

  const normalizedData = safeData.map((plot: any) => ({
    ...plot,
    polygons: Array.isArray(plot.polygons)
      ? plot.polygons.map((point: any) => {
          if (typeof point === "object" && "lat" in point && "lng" in point) {
            return [point.lat, point.lng];
          }
          if (Array.isArray(point) && point.length === 2) {
            return point;
          }
          return [0, 0];
        })
      : [],
  }));

  res.json(normalizedData);
});

router.get("/get-nutrients", async (req: Request, res: Response) => {
  const { plotId, startDate, endDate } = req.query;
  infoLog("Received nutrients request");

  if (!plotId || !startDate || !endDate) {
    res.status(400).json({ message: "Missing plotId, startDate or endDate" });
    return;
  }

  const { data, error } = await supabase.rpc(
    "get_plot_readings_by_date_range",
    {
      p_plot_id: parseInt(plotId as string),
      p_start_date: startDate,
      p_end_date: endDate,
    }
  );

  if (error) {
    errorLog("Error fetching nutrients:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  const response = {
    dates: data.map((d: { reading_date: any }) => d.reading_date),
    moisture: data.map((d: { avg_moisture: any }) => d.avg_moisture),
    nitrogen: data.map((d: { avg_nitrogen: any }) => d.avg_nitrogen),
    phosphorus: data.map((d: { avg_phosphorus: any }) => d.avg_phosphorus),
    potassium: data.map((d: { avg_potassium: any }) => d.avg_potassium),
  };

  res.json(response);
});

router.get("/get-raw-nutrients", async (req: Request, res: Response) => {
  const { plotId, startDate, endDate } = req.query;
  infoLog("Received raw nutrients request");

  if (!plotId || !startDate || !endDate) {
    res.status(400).json({ message: "Missing plotId, startDate or endDate" });
    return;
  }

  const { data, error } = await supabase.rpc("get_plot_raw_readings", {
    p_plot_id: parseInt(plotId as string),
    p_start_date: startDate,
    p_end_date: endDate,
  });

  if (error) {
    errorLog("Error fetching raw readings:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  const response = {
    timestamps: data.map((d: any) => d.read_time),
    moisture: data.map((d: any) => d.soil_moisture),
    nitrogen: data.map((d: any) => d.readed_nitrogen),
    phosphorus: data.map((d: any) => d.readed_phosphorus),
    potassium: data.map((d: any) => d.readed_potassium),
  };

  res.json(response);
});

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

router.get("/ai-summary", async (req: Request, res: Response) => {
  const { plotId } = req.query;
  infoLog("Received AI summary request");

  if (!plotId) {
    res.status(400).json({ message: "Missing plotId" });
    return;
  }

  const { data, error } = await supabase.rpc("get_plot_ai_analysis", {
    plot_id_input: plotId,
  });

  if (error) {
    errorLog("Error fetching AI summary:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  res.json(data);
});

router.get("/analysis-generated-count", async (req: Request, res: Response) => {
  const { municipality, province, date } = req.query;
  infoLog("Received analysis generated count request");

  if (!municipality || !province || !date) {
    res.status(400).json({ message: "Missing municipality, province or date" });
    return;
  }

  const { data, error } = await supabase.rpc(
    "get_daily_analysis_user_counts_filtered",
    {
      target_municipality: municipality,
      target_province: province,
      target_date: date,
    }
  );

  if (error) {
    errorLog("Error fetching analysis generated count:", error);
    res.status(500).json({ message: error.message });
    return;
  }

  console.log("Analysis generated count data:", data);
  res.json(data);
});

export default router;
