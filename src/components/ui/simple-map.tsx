
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Navigation } from 'lucide-react';

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
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);

  const handleSetLocation = () => {
    onLocationSelect(lat, lng);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLat = position.coords.latitude;
          const newLng = position.coords.longitude;
          setLat(newLat);
          setLng(newLng);
          onLocationSelect(newLat, newLng);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Seleccionar Ubicación</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGetCurrentLocation}
          >
            <Navigation className="w-4 h-4 mr-2" />
            Mi Ubicación
          </Button>
        </div>

        <div 
          className="w-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
          style={{ height }}
        >
          <div className="text-center p-8">
            <MapPin className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Vista de Mapa</h3>
            <p className="text-sm text-gray-500 mb-4">
              Use los campos de coordenadas para establecer la ubicación exacta
            </p>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-xs text-gray-600">Coordenadas actuales:</p>
              <p className="font-mono text-sm">
                {lat.toFixed(6)}, {lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitud</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
              placeholder="-33.4489"
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitud</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
              placeholder="-70.6693"
            />
          </div>
        </div>

        <Button 
          type="button"
          onClick={handleSetLocation}
          className="w-full"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Establecer Ubicación
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Ingrese las coordenadas manualmente o use "Mi Ubicación" para obtener su posición actual
        </p>
      </CardContent>
    </Card>
  );
};
