
import { useEffect, useRef } from 'react';

interface SimpleMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
  height?: string;
}

export const SimpleMap = ({ 
  onLocationSelect, 
  initialLat = -33.4489, 
  initialLng = -70.6693,
  height = "400px" 
}: SimpleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create a simple interactive map using OpenStreetMap
    const mapHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { height: 100vh; width: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map').setView([${initialLat}, ${initialLng}], 10);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          let marker = L.marker([${initialLat}, ${initialLng}]).addTo(map);

          map.on('click', function(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            
            if (marker) {
              map.removeLayer(marker);
            }
            
            marker = L.marker([lat, lng]).addTo(map);
            
            // Send coordinates to parent
            window.parent.postMessage({
              type: 'map-click',
              lat: lat,
              lng: lng
            }, '*');
          });
        </script>
      </body>
      </html>
    `;

    if (iframeRef.current) {
      const blob = new Blob([mapHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      iframeRef.current.src = url;

      return () => URL.revokeObjectURL(url);
    }
  }, [initialLat, initialLng]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'map-click') {
        onLocationSelect(event.data.lat, event.data.lng);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onLocationSelect]);

  return (
    <div ref={mapRef} style={{ height, width: '100%' }}>
      <iframe
        ref={iframeRef}
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none',
          borderRadius: '0.5rem'
        }}
        title="Mapa interactivo"
      />
    </div>
  );
};
