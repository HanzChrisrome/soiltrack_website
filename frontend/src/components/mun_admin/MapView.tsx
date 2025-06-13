import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import * as turf from "@turf/turf";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import PlotSidebar from "./AreaPage/PlotSidebar";
import { useReadingStore } from "../../store/mun_admin/useReadingStore";

type LatLng = [number, number];

type Plot = {
  id: number;
  name: string;
  soilType: string;
  cropType: string;
  area: string;
  color: string;
  ownerName: string;
};

const FitBounds = ({ polygons }: { polygons: [number, number][][] }) => {
  const map = useMap();

  useEffect(() => {
    if (polygons.length === 0) return;

    const gridSize = 0.01;
    const gridMap: Record<string, [number, number][][]> = {};

    polygons.forEach((poly) => {
      const [lat, lng] = poly[0];
      const key = `${Math.floor(lat / gridSize)}_${Math.floor(lng / gridSize)}`;
      if (!gridMap[key]) gridMap[key] = [];
      gridMap[key].push(poly);
    });

    let maxCluster: [number, number][][] = [];
    Object.values(gridMap).forEach((cluster) => {
      if (cluster.length > maxCluster.length) {
        maxCluster = cluster;
      }
    });

    const allCoords = maxCluster.flat();
    const bounds = L.latLngBounds(allCoords);
    map.fitBounds(bounds, { padding: [20, 20], maxZoom: 20 });
  }, [map, polygons]);

  return null;
};

const InvalidateSize = () => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map]);

  return null;
};

export default function MapView() {
  const { userPlots } = useReadingStore();
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [selectedSoilType, setSelectedSoilType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [, setSidebarVisible] = useState(false);

  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: icon,
      iconUrl: icon,
      shadowUrl: iconShadow,
    });
  }, []);

  useEffect(() => {
    if (selectedPlot) {
      setSidebarVisible(true);
    } else {
      setSidebarVisible(false);
    }
  }, [selectedPlot]);

  const closeSidebar = () => {
    setSidebarVisible(false);
    setTimeout(() => {
      setSelectedPlot(null);
    }, 300);
  };

  const soilTypeColors: Record<string, string> = {
    "clay soil": "#A0522D",
    "sandy soil": "#F4A460",
    "loam soil": "#C2B280",
    "silty soil": "#D2B48C",
    "peat soil": "#4B3621",
    "chalky soil": "#EEE8AA",
    "gravel soil": "#808080",
    default: "#2e7d32",
  };

  const polygons = (userPlots ?? [])
    .filter((plot) => Array.isArray(plot.polygons) && plot.polygons.length > 0)
    .map((plot) => {
      const coords = plot.polygons;
      const lngLatCoords = coords.map(([lat, lng]) => [lng, lat]);

      if (
        lngLatCoords.length > 2 &&
        (lngLatCoords[0][0] !== lngLatCoords[lngLatCoords.length - 1][0] ||
          lngLatCoords[0][1] !== lngLatCoords[lngLatCoords.length - 1][1])
      ) {
        lngLatCoords.push([...lngLatCoords[0]]);
      }

      const turfPolygon = turf.polygon([lngLatCoords]);
      const area = turf.area(turfPolygon);
      const areaHectares = (area / 10000).toFixed(2);

      const soilType = plot.soil_type?.toLowerCase() || "default";
      const color = soilTypeColors[soilType] || soilTypeColors.default;

      return {
        id: plot.plot_id,
        name: plot.plot_name,
        color,
        soilType: plot.soil_type,
        cropType: plot.crop_name,
        area: `${areaHectares} ha`,
        coords,
        ownerName: `${plot.user_fname} ${plot.user_lname}`,
      };
    });

  const filteredPolygons = polygons.filter((poly) => {
    const matchesSoil =
      !selectedSoilType || poly.soilType?.toLowerCase() === selectedSoilType;
    const matchesSearch =
      !searchQuery ||
      poly.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSoil && matchesSearch;
  });

  const defaultCenter: LatLng = (() => {
    const allCoords = (userPlots ?? []).flatMap((plot) =>
      Array.isArray(plot.polygons) ? plot.polygons : []
    );
    if (allCoords.length === 0) return [14.9, 120.855];
    const bounds = L.latLngBounds(allCoords);
    return [bounds.getCenter().lat, bounds.getCenter().lng];
  })();

  return (
    <div className="relative w-full max-h-full h-[85vh] z-10">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="rounded-lg z-10"
        style={{ height: "100%", width: "100%" }}
      >
        <InvalidateSize />

        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri"
        />
        <TileLayer
          url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          attribution="Labels &copy; Esri"
        />

        <FitBounds polygons={filteredPolygons.map((p) => p.coords)} />

        {filteredPolygons.map((poly) => (
          <Polygon
            key={poly.id}
            positions={poly.coords}
            pathOptions={{
              color: poly.color,
              fillColor: poly.color,
              fillOpacity: 0.4,
            }}
            eventHandlers={{
              click: () => {
                setSelectedPlot({
                  id: poly.id,
                  name: poly.name,
                  soilType: poly.soilType,
                  cropType: poly.cropType,
                  area: poly.area,
                  color: poly.color,
                  ownerName: poly.ownerName,
                });
              },
            }}
          >
            <Tooltip direction="center" permanent>
              {poly.name} — {poly.area}
            </Tooltip>
          </Polygon>
        ))}
      </MapContainer>

      <div className="absolute top-4 right-4 z-20 space-y-4">
        <div className="bg-white p-3 rounded-lg shadow-md">
          <h4 className="font-bold mb-2">Soil Type Legend</h4>
          <ul className="space-y-1 text-sm">
            {[...new Set(polygons.map((poly) => poly.soilType?.toLowerCase()))]
              .filter((type) => type && type !== "default")
              .map((type) => (
                <li
                  key={type}
                  className={`flex items-center space-x-2 cursor-pointer ${
                    selectedSoilType === type ? "font-bold underline" : ""
                  }`}
                  onClick={() =>
                    setSelectedSoilType(type === selectedSoilType ? null : type)
                  }
                >
                  <span
                    className="inline-block w-4 h-4 rounded-full mr-2"
                    style={{
                      backgroundColor:
                        soilTypeColors[type] || soilTypeColors.default,
                    }}
                  ></span>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </li>
              ))}
          </ul>
        </div>

        <div className="bg-white p-2 rounded-lg shadow-md">
          {polygons.length === 0 ? (
            <div className="text-gray-600 text-sm px-2 py-1">
              No plots available in this area.
            </div>
          ) : (
            <input
              type="text"
              placeholder="Search plot name..."
              className="w-full px-2 py-1 border rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}
        </div>
      </div>

      <div className="absolute top-0 right-0 h-full z-40">
        <PlotSidebar
          plot={selectedPlot}
          visible={!!selectedPlot}
          onClose={closeSidebar}
        />
      </div>
    </div>
  );
}
