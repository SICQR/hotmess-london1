import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "mapbox-gl/dist/mapbox-gl.css";
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(<App />);
  