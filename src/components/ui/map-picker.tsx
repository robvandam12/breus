
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MapPin, Locate, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MapPickerProps {
  value?: { lat: number; lng: number };
  onChange?: (coordinates: { lat: number; lng: number }) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

export const MapPicker = ({ 
  value, 
  onChange, 
  center = { lat: -41.4693, lng: -72.9424 }, // Puerto Montt, Chile
  zoom = 10,
  className 
}: MapPickerProps) => {
  const [coordinates, setCoordinates] = useState(value || center);
  const [showCoordinateInput, setShowCoordinateInput] = useState(false);
  const [inputLat, setInputLat] = useState(coordinates.lat.toString());
  const [inputLng, setInputLng] = useState(coordinates.lng.toString());
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Simulated map for now - in real implementation this would use Mapbox
  const handleMapClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    
    // Convert to approximate coordinates (this is simplified)
    const lat = center.lat + (0.5 - y) * 0.1;
    const lng = center.lng + (x - 0.5) * 0.1;
    
    const newCoordinates = { lat, lng };
    setCoordinates(newCoordinates);
    setInputLat(lat.toFixed(6));
    setInputLng(lng.toFixed(6));
    onChange?.(newCoordinates);
  }, [center, onChange]);

  const handleCoordinateSubmit = () => {
    const lat = parseFloat(inputLat);
    const lng = parseFloat(inputLng);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      const newCoordinates = { lat, lng };
      setCoordinates(newCoordinates);
      onChange?.(newCoordinates);
      setShowCoordinateInput(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCoordinates(newCoordinates);
          setInputLat(newCoordinates.lat.toString());
          setInputLng(newCoordinates.lng.toString());
          onChange?.(newCoordinates);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <Card className={`ios-card ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="w-5 h-5 text-blue-600" />
          Seleccionar Ubicación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map Area */}
        <div 
          ref={mapRef}
          onClick={handleMapClick}
          className="relative w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl border-2 border-dashed border-zinc-300 cursor-crosshair transition-all hover:border-blue-400 dark:from-blue-900/20 dark:to-green-900/20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          {/* Map Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <Crosshair className="w-8 h-8 text-blue-600 mx-auto" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Haz clic para seleccionar ubicación
              </p>
            </div>
          </div>
          
          {/* Selected Location Marker */}
          {coordinates && (
            <div 
              className="absolute w-6 h-6 -ml-3 -mt-3 bg-red-500 rounded-full border-2 border-white shadow-lg animate-bounce"
              style={{
                left: '50%',
                top: '50%',
              }}
            >
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={getCurrentLocation}
            className="flex-1"
          >
            <Locate className="w-4 h-4 mr-2" />
            Mi Ubicación
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowCoordinateInput(!showCoordinateInput)}
            className="flex-1"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Coordenadas
          </Button>
        </div>

        {/* Coordinate Input */}
        {showCoordinateInput && (
          <div className="space-y-3 p-4 bg-zinc-50 rounded-xl dark:bg-zinc-900/50">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="lat" className="text-sm font-medium">Latitud</Label>
                <Input
                  id="lat"
                  value={inputLat}
                  onChange={(e) => setInputLat(e.target.value)}
                  placeholder="-41.4693"
                  className="h-10"
                />
              </div>
              <div>
                <Label htmlFor="lng" className="text-sm font-medium">Longitud</Label>
                <Input
                  id="lng"
                  value={inputLng}
                  onChange={(e) => setInputLng(e.target.value)}
                  placeholder="-72.9424"
                  className="h-10"
                />
              </div>
            </div>
            <Button onClick={handleCoordinateSubmit} className="w-full">
              Aplicar Coordenadas
            </Button>
          </div>
        )}

        {/* Current Coordinates Display */}
        <div className="text-sm text-zinc-600 dark:text-zinc-400 text-center p-3 bg-zinc-50 rounded-xl dark:bg-zinc-900/50">
          <strong>Coordenadas seleccionadas:</strong><br />
          Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
        </div>
      </CardContent>
    </Card>
  );
};
