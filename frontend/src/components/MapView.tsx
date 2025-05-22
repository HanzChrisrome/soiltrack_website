import { MapContainer, TileLayer, Popup, Polygon, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import PlotSidebar from "./PlotSidebar";

type LatLng = [number, number];

const defaultCenter: LatLng = [14.9, 120.855];

const polygons = [
  {
    id: 1,
    name: "Field 1",
    color: "#134f14",
    crop: "Rice",
    area: "2 hectares",
    coords: [
      [14.901, 120.85],
      [14.902, 120.855],
      [14.899, 120.857],
      [14.898, 120.852],
    ] as LatLng[],
  },
  {
    id: 2,
    name: "Field 2",
    color: "#2e7d32",
    crop: "Corn",
    area: "1.5 hectares",
    coords: [
      [14.905, 120.86],
      [14.906, 120.865],
      [14.903, 120.867],
      [14.902, 120.862],
    ] as LatLng[],
  },
];

const FitBounds = ({ polygons }: { polygons: LatLng[][] }) => {
  const map = useMap();
  useEffect(() => {
    const allCoords = polygons.flat();
    const bounds = L.latLngBounds(allCoords);
    map.fitBounds(bounds, { padding: [20, 20] });
  }, [polygons, map]);
  return null;
};

export default function MapView() {
  const [selectedPlot, setSelectedPlot] = useState<(typeof polygons)[0] | null>(
    null
  );
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

  return (
    <div className="relative w-full h-full">
      {/* Map */}
      <div className="relative h-full z-0">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={false}
          className="rounded-lg"
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          />
          <FitBounds polygons={polygons.map((p) => p.coords)} />
          {polygons.map((poly) => (
            <Polygon
              key={poly.id}
              positions={poly.coords}
              pathOptions={{
                color: poly.color,
                fillColor: poly.color,
                fillOpacity: 0.4,
              }}
              eventHandlers={{
                click: () => setSelectedPlot(poly),
              }}
            >
              <Popup>{poly.name}</Popup>
            </Polygon>
          ))}
        </MapContainer>
      </div>

      <PlotSidebar
        plot={selectedPlot}
        visible={!!selectedPlot}
        onClose={closeSidebar}
      />
    </div>
  );
}
