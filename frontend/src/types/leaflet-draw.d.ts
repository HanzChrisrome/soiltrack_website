/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/leaflet-draw.d.ts
import * as L from "leaflet";

declare module "leaflet" {
  namespace Control {
    class Draw extends L.Control {
      constructor(options?: any);
    }
  }

  namespace Draw {
    class Polygon extends L.Draw.Polygon {
      constructor(map: L.Map, options?: L.DrawOptions.PolygonOptions);
      enable(): void;
    }
  }

  namespace EditToolbar {
    class Edit {
      constructor(map: L.Map, options: { featureGroup: L.FeatureGroup });
      enable(): void;
    }

    class Delete {
      constructor(map: L.Map, options: { featureGroup: L.FeatureGroup });
      enable(): void;
    }
  }
}
