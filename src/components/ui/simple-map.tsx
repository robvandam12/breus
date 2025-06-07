
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, RotateCcw } from 'lucide-react';

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedCoords, setSelectedCoords] = useState({ lat: initialLat, lng: initialLng });
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    
    // Convert click position to approximate coordinates (Chile region)
    const lat = initialLat + (0.5 - y) * 2; // Adjust range as needed
    const lng = initialLng + (x - 0.5) * 2; // Adjust range as needed
    
    const newCoords = { lat, lng };
    setSelectedCoords(newCoords);
    onLocationSelect(lat, lng);
  };

  const resetToDefault = () => {
    setSelectedCoords({ lat: initialLat, lng: initialLng });
    onLocationSelect(initialLat, initialLng);
  };

  return (
    <div className="w-full" style={{ height }}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium">Mapa Interactivo</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={resetToDefault}
          className="flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </Button>
      </div>
      
      <div
        ref={mapContainerRef}
        onClick={handleMapClick}
        className="relative w-full border-2 border-dashed border-blue-300 rounded-lg cursor-crosshair transition-all hover:border-blue-500 bg-gradient-to-br from-blue-50 to-green-50"
        style={{ height: 'calc(100% - 60px)' }}
      >
        {!mapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-gray-600">Cargando mapa...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Map Background Pattern */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
            
            {/* Instructions */}
            <div className="absolute top-4 left-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                <p className="text-xs text-gray-600 text-center">
                  Haz clic en cualquier punto para seleccionar la ubicación
                </p>
              </div>
            </div>
            
            {/* Selected Location Marker */}
            <div 
              className="absolute w-6 h-6 -ml-3 -mt-3 z-10"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse">
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30"></div>
              </div>
            </div>
            
            {/* Coordinates Display */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                <div className="text-xs text-gray-600 text-center">
                  <div className="font-medium">Coordenadas seleccionadas:</div>
                  <div className="mt-1">
                    Lat: {selectedCoords.lat.toFixed(6)}, Lng: {selectedCoords.lng.toFixed(6)}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
