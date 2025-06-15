import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
  //<StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  //</StrictMode>
);
