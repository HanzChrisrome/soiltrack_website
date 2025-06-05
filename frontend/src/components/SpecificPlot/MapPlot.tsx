import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet";
import L from "leaflet";

type PlotMapProps = {
  coords: number[][];
};

const FitBounds = ({ coords }: { coords: [number, number][] }) => {
  const map = useMap();
  if (coords.length > 0) {
    const bounds = L.latLngBounds(coords);
    map.fitBounds(bounds, { padding: [10, 10] });
  }
  return null;
};

const PlotMap = ({ coords }: PlotMapProps) => {
  if (!coords || coords.length < 3) return null;

  const latLngCoords = coords.map(([lat, lng]) => [lat, lng]) as [
    number,
    number
  ][];

  const center = latLngCoords[0];

  return (
    <MapContainer
      center={center}
      zoom={18}
      scrollWheelZoom={false}
      style={{ height: "200px", width: "100%", borderRadius: "12px" }}
      dragging={false}
      doubleClickZoom={false}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polygon
        positions={latLngCoords}
        pathOptions={{ color: "yellow", weight: 2, fillOpacity: 0.4 }}
      />
      <FitBounds coords={latLngCoords} />
    </MapContainer>
  );
};

export default PlotMap;
