
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
  initialZoom?: number;
  height?: string;
  showAddressSearch?: boolean;
  showLocationSelector?: boolean;
  markers?: Array<{
    lat: number;
    lng: number;
    title: string;
    description?: string;
    color?: string;
    onClick?: () => void;
  }>;
}

export const LeafletMap = ({
  onLocationSelect,
  initialLat = -41.4693,
  initialLng = -72.9424,
  initialZoom = 10,
  height = "400px",
  showAddressSearch = true,
  showLocationSelector = true,
  markers = []
}: LeafletMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map with neutral tile layer
    const map = L.map(mapRef.current).setView([initialLat, initialLng], initialZoom);
    mapInstanceRef.current = map;

    // Use a more neutral map style (CartoDB Positron is lighter and more neutral)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Add click handler only if location selector is enabled
    if (showLocationSelector && onLocationSelect) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      });
    }

    return () => {
      map.remove();
    };
  }, [initialLat, initialLng, initialZoom, showLocationSelector, onLocationSelect]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    markers.forEach(markerData => {
      if (!mapInstanceRef.current) return;

      let icon = L.divIcon({
        html: `<div style="background-color: ${markerData.color || '#3B82F6'}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        className: 'custom-marker'
      });

      const marker = L.marker([markerData.lat, markerData.lng], { icon })
        .addTo(mapInstanceRef.current);

      if (markerData.title || markerData.description) {
        let popupContent = `<div style="min-width: 200px;">`;
        if (markerData.title) {
          popupContent += `<h3 style="margin: 0 0 8px 0; font-weight: bold;">${markerData.title}</h3>`;
        }
        if (markerData.description) {
          popupContent += `<p style="margin: 0; white-space: pre-line;">${markerData.description}</p>`;
        }
        if (markerData.onClick) {
          popupContent += `<button onclick="window.handleMarkerClick && window.handleMarkerClick()" style="margin-top: 8px; padding: 4px 8px; background: #3B82F6; color: white; border: none; border-radius: 4px; cursor: pointer;">Ver Detalle</button>`;
        }
        popupContent += `</div>`;
        
        marker.bindPopup(popupContent);
      }

      if (markerData.onClick) {
        marker.on('click', markerData.onClick);
      }

      markersRef.current.push(marker);
    });

    // Adjust map view to show all markers if there are any
    if (markers.length > 0) {
      const group = new L.FeatureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [markers]);

  return (
    <div 
      ref={mapRef} 
      style={{ height, width: '100%', zIndex: 1 }}
      className="rounded-lg border"
    />
  );
};
