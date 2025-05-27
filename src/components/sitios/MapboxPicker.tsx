
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MapboxPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
  height?: string;
}

export const MapboxPicker = ({ 
  onLocationSelect, 
  initialLat = -33.4489, 
  initialLng = -70.6693,
  height = "400px" 
}: MapboxPickerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const marker = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadMapbox = () => {
      if (window.mapboxgl) {
        setIsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);

      const link = document.createElement('link');
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    };

    loadMapbox();
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapContainer.current || map.current) return;

    // Usar el token desde las variables de entorno
    window.mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

    map.current = new window.mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [initialLng, initialLat],
      zoom: 10
    });

    marker.current = new window.mapboxgl.Marker({
      draggable: true
    })
      .setLngLat([initialLng, initialLat])
      .addTo(map.current);

    marker.current.on('dragend', () => {
      const lngLat = marker.current.getLngLat();
      onLocationSelect(lngLat.lat, lngLat.lng);
    });

    map.current.on('click', (e: any) => {
      const { lng, lat } = e.lngLat;
      marker.current.setLngLat([lng, lat]);
      onLocationSelect(lat, lng);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isLoaded, initialLat, initialLng, onLocationSelect]);

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center" style={{ height }}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando mapa...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div
          ref={mapContainer}
          style={{ height }}
          className="w-full rounded-lg overflow-hidden"
        />
        <p className="text-sm text-gray-600 mt-2">
          Haz clic en el mapa o arrastra el marcador para seleccionar una ubicación
        </p>
      </CardContent>
    </Card>
  );
};
