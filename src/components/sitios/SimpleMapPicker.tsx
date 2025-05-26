
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface SimpleMapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
  height?: string;
}

export const SimpleMapPicker = ({ 
  onLocationSelect, 
  initialLat = -33.4489, 
  initialLng = -70.6693,
  height = "400px" 
}: SimpleMapPickerProps) => {
  const [coordinates, setCoordinates] = useState({ lat: initialLat, lng: initialLng });

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert pixel coordinates to lat/lng (simplified conversion)
    const lat = initialLat + (rect.height / 2 - y) * 0.001;
    const lng = initialLng + (x - rect.width / 2) * 0.001;
    
    setCoordinates({ lat, lng });
    onLocationSelect(lat, lng);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div
          style={{ height }}
          className="w-full rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-green-100 relative cursor-crosshair border-2 border-dashed border-gray-300"
          onClick={handleMapClick}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Haz clic para seleccionar ubicación</p>
              <p className="text-xs mt-1">
                Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
              </p>
            </div>
          </div>
          
          {/* Marker */}
          <div 
            className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: '50%',
              top: '50%'
            }}
          >
            <MapPin className="w-6 h-6 text-red-500" />
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mt-2">
          Haz clic en el área para seleccionar una ubicación aproximada
        </p>
      </CardContent>
    </Card>
  );
};
