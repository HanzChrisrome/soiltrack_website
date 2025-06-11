/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap,
  Polygon,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-geosearch/dist/geosearch.css";
import { useRef, useEffect, useState } from "react";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useReadingStore } from "../../store/useReadingStore";

type PolygonMapProps = {
  onPolygonDrawn: (coords: { lat: number; lng: number }[][]) => void;
  userPolygons?: { id: string; coords: [number, number][] }[];
};

const SearchControl = () => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider({
      params: {
        countrycodes: "ph",
        viewbox: "116.87,4.59,126.6,21.32",
        bounded: 1,
      },
    });

    const searchControl = GeoSearchControl({
      provider,
      style: "bar",
      showMarker: true,
      showPopup: true,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
    });

    map.addControl(searchControl);

    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
};

const PolygonMap = ({ onPolygonDrawn }: PolygonMapProps) => {
  const { userPlots } = useReadingStore();
  const featureGroupRef = useRef<any>(null);
  const [center, setCenter] = useState<[number, number]>([13.41, 122.56]);

  const formattedUserPlots =
    userPlots?.map((plot: any) => ({
      id: plot.plot_id,
      coords: Array.isArray(plot.polygons)
        ? plot.polygons.map(([lat, lng]: number[]) => [lat, lng])
        : [],
    })) || [];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCenter([latitude, longitude]);
      },
      (error) => {
        console.warn("Geolocation not available or denied:", error);
      }
    );
  }, []);

  const updatePolygonsFromFeatureGroup = () => {
    if (!featureGroupRef.current) return;

    const layers = featureGroupRef.current.getLayers?.() || [];

    const updatedPolygons: { lat: number; lng: number }[][] = layers.map(
      (layer: any) =>
        layer.getLatLngs()[0].map((latlng: any) => ({
          lat: latlng.lat,
          lng: latlng.lng,
        }))
    );

    onPolygonDrawn(updatedPolygons);
  };

  const handleCreated = (_e: any) => {
    updatePolygonsFromFeatureGroup();
  };

  const handleDeleted = (_e: any) => {
    updatePolygonsFromFeatureGroup();
  };

  const handleEdited = (_e: any) => {
    updatePolygonsFromFeatureGroup();
  };

  return (
    <MapContainer
      center={center}
      zoom={15}
      scrollWheelZoom={true}
      className="h-[400px] w-full rounded-lg overflow-hidden z-0"
    >
      {formattedUserPlots.map((plot) => (
        <Polygon
          key={plot.id}
          positions={plot.coords}
          pathOptions={{ color: "green", weight: 2, fillOpacity: 0.3 }}
        />
      ))}
      <SearchControl />
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          onCreated={handleCreated}
          onDeleted={handleDeleted}
          onEdited={handleEdited}
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false,
            polygon: true,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default PolygonMap;
