/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { useRef } from "react";
import DrawControls from "./DrawControl";
import { FeatureGroup as LeafletFeatureGroup } from "leaflet";
import CustomControls from "./CustomControls";

interface PolygonMapProps {
  onPolygonDrawn: () => void;
  firstName: string;
  plotCount: number;
}

const PolygonMap = ({ onPolygonDrawn, firstName }: PolygonMapProps) => {
  const featureGroupRef = useRef<LeafletFeatureGroup | null>(null);
  const mapRef = useRef<any>(null);

  return (
    <>
      <MapContainer
        center={[14.8627, 120.8194]}
        zoom={13}
        style={{ height: 400, width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FeatureGroup ref={featureGroupRef}>
          <DrawControls
            featureGroupRef={featureGroupRef}
            onPolygonDrawn={onPolygonDrawn}
          />
        </FeatureGroup>
      </MapContainer>

      {/* Render controls outside the map */}
      <CustomControls map={mapRef.current} firstName={firstName} />
    </>
  );
};

export default PolygonMap;
