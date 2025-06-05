/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-draw";

interface CustomControlsProps {
  map: L.Map | null;
  firstName: string;
}

const CustomControls = ({ map, firstName }: CustomControlsProps) => {
  const featureGroupRef = useRef<L.FeatureGroup>(new L.FeatureGroup());
  const plotCountRef = useRef(0);

  useEffect(() => {
    if (!map) return;

    // Add feature group to map only once
    if (!map.hasLayer(featureGroupRef.current)) {
      featureGroupRef.current.addTo(map);
    }

    // Handler for when a polygon is drawn
    const onDrawCreated = (e: any) => {
      const layer = e.layer;
      plotCountRef.current++;

      const label = `${firstName} Plot ${String.fromCharCode(
        64 + plotCountRef.current
      )}`;

      layer.bindTooltip(label, { permanent: true }).openTooltip();
      featureGroupRef.current.addLayer(layer);

      console.log("Polygon created:", layer.toGeoJSON());
    };

    map.on("draw:created", onDrawCreated);

    // Cleanup on unmount or map change
    return () => {
      map.off("draw:created", onDrawCreated);
      if (map.hasLayer(featureGroupRef.current)) {
        map.removeLayer(featureGroupRef.current);
      }
    };
  }, [map, firstName]);

  const drawPolygon = () => {
    if (!map) return;
    const drawControl = new L.Draw.Polygon(map, {
      showArea: true,
      allowIntersection: false,
      shapeOptions: {
        color: "#1d4ed8",
      },
    });
    drawControl.enable();
  };

  const deletePolygons = () => {
    if (!map) return;
    const deleteControl = new L.EditToolbar.Delete(map, {
      featureGroup: featureGroupRef.current,
    });
    deleteControl.enable();
  };

  const editPolygons = () => {
    if (!map) return;
    const editControl = new L.EditToolbar.Edit(map, {
      featureGroup: featureGroupRef.current,
    });
    editControl.enable();
  };

  return (
    <div
      style={{
        marginTop: 10,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <button className="btn btn-primary" onClick={drawPolygon}>
        Draw Polygon
      </button>
      <button className="btn btn-secondary" onClick={editPolygons}>
        Edit Polygon
      </button>
      <button className="btn btn-error" onClick={deletePolygons}>
        Delete Polygon
      </button>
    </div>
  );
};

export default CustomControls;
