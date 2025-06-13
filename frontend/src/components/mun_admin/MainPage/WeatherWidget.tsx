import { CloudSun, Droplets, Wind } from "lucide-react";

const mockWeather = {
  location: "Nairobi",
  temperature: 24,
  condition: "Partly Cloudy",
  humidity: 68,
  windSpeed: 12,
};

const WeatherWidget = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-2 h-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">{mockWeather.location}</h2>
          <p className="text-sm text-gray-500">{mockWeather.condition}</p>
        </div>
        <CloudSun className="text-yellow-500 w-8 h-8" />
      </div>

      <div className="text-4xl font-bold text-blue-600">
        {mockWeather.temperature}°C
      </div>

      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Droplets className="w-4 h-4" />
          <span>{mockWeather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="w-4 h-4" />
          <span>{mockWeather.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
