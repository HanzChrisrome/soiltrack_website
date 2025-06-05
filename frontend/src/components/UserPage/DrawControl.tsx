import { EditControl } from "react-leaflet-draw";
import { MutableRefObject } from "react";
import { FeatureGroup } from "leaflet";

interface DrawControlsProps {
  featureGroupRef: MutableRefObject<FeatureGroup | null>;
  onPolygonDrawn: () => void;
}

const DrawControls = ({
  featureGroupRef,
  onPolygonDrawn,
}: DrawControlsProps) => {
  return (
    <EditControl
      position="topright"
      onCreated={(e) => {
        const layerType = e.layerType;
        if (layerType === "polygon") {
          onPolygonDrawn();
        }
        // Add the created layer to the FeatureGroup
        if (featureGroupRef.current) {
          featureGroupRef.current.addLayer(e.layer);
        }
      }}
      onDeleted={(e) => console.log("Deleted:", e)}
      draw={{
        rectangle: false,
        circle: false,
        circlemarker: false,
        polyline: false,
        marker: false,
        polygon: true, // <-- Enable polygon drawing
      }}
      edit={{
        featureGroup: featureGroupRef.current!,
      }}
    />
  );
};

export default DrawControls;
