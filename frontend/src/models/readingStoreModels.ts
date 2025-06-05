export interface UserPlots {
  plot_id: number;
  user_id: string;
  plot_name: string;
  soil_type: string;
  polygons: [number, number][];
  plot_address: string;
  isValveOn: boolean;
  crop_name: string;
  user_fname: string;
  user_lname: string;
  user_email: string;
  user_barangay: string;
  user_municipality: string;
  user_province: string;
}

export interface UserSummary {
  user_id: string;
  user_name: string;
  user_barangay: string;
  plot_count: number;
  mac_address: string;
}

export interface PlotReadingsTrend {
  reading_date: string;
  moisture: number | null;
  nitrogen: number | null;
  phosphorus: number | null;
  potassium: number | null;
}

export interface DailyReading {
  reading_date: string;
  moisture: number | null;
  nitrogen: number | null;
  phosphorus: number | null;
  potassium: number | null;
}

export interface ImprovementPlot {
  plot_id: number;
  user_name: string;
  location: string;
  user_barangay: string;
  user_municipality: string;
  user_province: string;
  improvement_score: number;
  daily_averages: {
    date: string;
    avg_moisture: number | null;
    avg_nutrients: number | null;
    avg_nitrogen: number | null;
    avg_phosphorus: number | null;
    avg_potassium: number | null;
    total_avg: number;
  }[];
}

export interface ImprovementSummary {
  date_range: {
    start_time: string;
    end_time: string;
  };
  most_improved: ImprovementPlot;
  least_improved: ImprovementPlot;
}

export interface OverallAverage {
  moisture: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

export interface SoilTypeStat {
  soil_type: string;
  count: number;
  percentage: number;
}

export interface CropStat {
  crop_name: string;
  count: number;
  percentage: number;
}
