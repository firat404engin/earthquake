import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

export default function TurkeyHeatLayer({ data }) {
  const map = useMap();
  const heatRef = useRef(null);

  useEffect(() => {
    if (!map || !window.L || !window.L.heatLayer || !Array.isArray(data) || data.length === 0) return;

    if (heatRef.current) {
      heatRef.current.remove();
      heatRef.current = null;
    }

    heatRef.current = window.L.heatLayer(data, {
      radius: 28,
      blur: 22,
      maxZoom: 8,
      gradient: { 0.2: "#b5e3ff", 0.4: "#5cc6ff", 0.6: "#3e9ed6", 0.8: "#ffb347", 1.0: "#ff3b3b" }
    }).addTo(map);

    return () => {
      if (heatRef.current) {
        heatRef.current.remove();
        heatRef.current = null;
      }
    };
  }, [data, map]);

  return null;
}
