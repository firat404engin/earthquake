import { useEffect } from "react";
import { useMap } from "react-leaflet";
import "leaflet.heat";

// Fay hattı boyunca heatmap bandı oluşturur
export default function FaultHeatBandLayer() {
  const map = useMap();
  useEffect(() => {
    let heatLayer = null;
    fetch("/turkey_fault_lines.geojson")
      .then(r => r.json())
      .then(geojson => {
        // Her fay segmenti için sık aralıklı noktalar üret
        let points = [];
        geojson.features.forEach(f => {
          const coords = f.geometry.coordinates;
          const sev = f.properties?.severity || 1;
          for (let i = 0; i < coords.length - 1; i++) {
            const [x1, y1] = coords[i];
            const [x2, y2] = coords[i + 1];
            // Her segmenti 40 parçaya böl (daha sık)
            for (let t = 0; t <= 40; t++) {
              const lng = x1 + (x2 - x1) * t / 40;
              const lat = y1 + (y2 - y1) * t / 40;
              points.push([lat, lng, sev * 0.7]); // ağırlık daha düşük ve gerçekçi
            }
          }
        });
        if (window.L && window.L.heatLayer) {
          heatLayer = window.L.heatLayer(points, {
            radius: 18,
            blur: 14,
            maxZoom: 8,
            minOpacity: 0.07,
            gradient: {
              0.2: "#fffbe6",
              0.6: "#ffb347",
              1.0: "#b30000"
            }
          }).addTo(map);
        }
      });
    return () => { if (heatLayer) heatLayer.remove(); };
  }, [map]);
  return null;
}
