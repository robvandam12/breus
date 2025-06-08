
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, ZoomIn, ZoomOut } from 'lucide-react';

interface SimpleMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat: number;
  initialLng: number;
  height?: string;
  markers?: Array<{
    lat: number;
    lng: number;
    title: string;
    description?: string;
  }>;
}

export const SimpleMap = ({ 
  onLocationSelect, 
  initialLat, 
  initialLng, 
  height = "400px",
  markers = []
}: SimpleMapProps) => {
  const [selectedLocation, setSelectedLocation] = useState({ lat: initialLat, lng: initialLng });
  const [zoom, setZoom] = useState(10);

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Simple coordinate calculation (approximate)
    const lat = initialLat + (0.5 - y / rect.height) * 0.1;
    const lng = initialLng + (x / rect.width - 0.5) * 0.1;
    
    setSelectedLocation({ lat, lng });
    onLocationSelect(lat, lng);
  };

  return (
    <div className="w-full space-y-2" style={{ height }}>
      <div className="flex items-center justify-between text-sm text-gray-600 bg-blue-50 p-2 rounded">
        <span>Mapa simplificado - Haz clic para seleccionar ubicación</span>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(zoom + 1, 15))}
          >
            <ZoomIn className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(zoom - 1, 1))}
          >
            <ZoomOut className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      <div 
        className="relative bg-gradient-to-br from-blue-100 to-green-100 border-2 border-dashed border-blue-300 rounded-lg cursor-crosshair overflow-hidden"
        style={{ height: 'calc(100% - 60px)' }}
        onClick={handleMapClick}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border border-blue-200" />
            ))}
          </div>
        </div>

        {/* Selected location marker */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-full z-10"
          style={{
            left: '50%',
            top: '50%'
          }}
        >
          <MapPin className="w-6 h-6 text-red-500 drop-shadow-md" />
        </div>

        {/* Operation markers */}
        {markers.map((marker, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-full z-10 group"
            style={{
              left: `${50 + (marker.lng - initialLng) * 500}%`,
              top: `${50 - (marker.lat - initialLat) * 500}%`
            }}
            title={marker.title}
          >
            <MapPin className="w-5 h-5 text-blue-600 drop-shadow-md" />
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 hidden group-hover:block bg-white p-2 rounded shadow-lg border text-xs whitespace-nowrap z-20">
              <div className="font-medium">{marker.title}</div>
              {marker.description && (
                <div className="text-gray-600">{marker.description}</div>
              )}
            </div>
          </div>
        ))}

        {/* Coordinates display */}
        <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs">
          {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
        </div>
      </div>
    </div>
  );
};
