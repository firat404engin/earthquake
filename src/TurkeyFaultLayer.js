import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function TurkeyFaultLayer() {
  const map = useMap();
  useEffect(() => {
    let layer = null;
    let topLayer = null;
    let cancelled = false;
    fetch("/turkey_fault_lines.geojson")
      .then(r => r.json())
      .then(geojson => {
        if (cancelled) return;
        function getBrownBySeverity(severity) {
          const colors = ["#F2E4D5", "#C19A6B", "#A0522D", "#8B4513"];
          return colors[Math.max(0, Math.min(3, (severity || 1) - 1))];
        }
        // Modern ve belirgin çift katmanlı fay çizgisi
        layer = L.geoJSON(geojson, {
          style: function(feature) {
            return {
              color: '#fff', // dış outline beyaz
              weight: 13,
              opacity: 0.7
            };
          }
        }).addTo(map);
        // Üstüne gerçek fay çizgisi (bordo-kahverengi)
        topLayer = L.geoJSON(geojson, {
          style: function(feature) {
            return {
              color: '#a83232', // bordo-kahverengi
              weight: 8,
              opacity: 1
            };
          },
          onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.name) {
              layer.bindPopup(
                `<div style='min-width:180px;padding:8px 10px;border-radius:12px;background:#fff3e6;box-shadow:0 2px 12px #a8323244;'>
                  <strong style='color:#a83232;font-size:1.1em;'>${feature.properties.name}</strong><br/>
                  <span style='color:#333;font-size:0.98em;'>${feature.properties.description || ''}</span>
                </div>`,
                { closeButton: true }
              );
            }
            layer.on('mouseover', function() {
              this._path.style.cursor = 'pointer';
              this.setStyle({weight: 11, color:'#d94a4a'});
            });
            layer.on('mouseout', function() {
              this.setStyle({weight: 8, color:'#a83232'});
            });
          }
        }).addTo(map);

      });
    return () => {
      cancelled = true;
      if (layer && map && map.hasLayer(layer)) {
        layer.remove();
      }
      if (topLayer && map && map.hasLayer(topLayer)) {
        topLayer.remove();
      }
    };
  }, [map]);
  return null;
}
