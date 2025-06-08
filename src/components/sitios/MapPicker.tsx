
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Target } from "lucide-react";
import { VisualMap } from '@/components/ui/visual-map';

interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (lat: number, lng: number) => void;
  className?: string;
}

export const MapPicker = ({ 
  initialLat = -41.4693, 
  initialLng = -72.9424, 
  onLocationSelect,
  className = ""
}: MapPickerProps) => {
  const [selectedLat, setSelectedLat] = useState<number>(initialLat);
  const [selectedLng, setSelectedLng] = useState<number>(initialLng);

  // Validación de coordenadas para Chile
  const isValidChileCoordinate = (lat: number, lng: number) => {
    return lat >= -56.5 && lat <= -17.5 && lng >= -109.5 && lng <= -66.4;
  };

  const handleLocationFromMap = (lat: number, lng: number) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
    onLocationSelect(lat, lng);
  };

  const handleManualInput = () => {
    if (isValidChileCoordinate(selectedLat, selectedLng)) {
      onLocationSelect(selectedLat, selectedLng);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          if (isValidChileCoordinate(lat, lng)) {
            setSelectedLat(lat);
            setSelectedLng(lng);
            onLocationSelect(lat, lng);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <Card className={`ios-card ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="w-5 h-5 text-blue-600" />
          Seleccionar Ubicación en Chile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mapa visual */}
        <div className="space-y-3">
          <Label>Mapa Interactivo</Label>
          <VisualMap
            onLocationSelect={handleLocationFromMap}
            initialLat={selectedLat}
            initialLng={selectedLng}
            height="350px"
            showAddressSearch={true}
          />
        </div>

        {/* Entrada manual de coordenadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitud</Label>
            <Input
              id="latitude"
              type="number"
              step="0.000001"
              value={selectedLat}
              onChange={(e) => setSelectedLat(parseFloat(e.target.value) || 0)}
              placeholder="-41.4693"
              className="touch-target"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitud</Label>
            <Input
              id="longitude"
              type="number"
              step="0.000001"
              value={selectedLng}
              onChange={(e) => setSelectedLng(parseFloat(e.target.value) || 0)}
              placeholder="-72.9424"
              className="touch-target"
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleUseCurrentLocation}
            className="touch-target flex-1"
          >
            <Target className="w-4 h-4 mr-2" />
            Usar Mi Ubicación
          </Button>
          <Button 
            onClick={handleManualInput}
            className="touch-target flex-1"
            disabled={!isValidChileCoordinate(selectedLat, selectedLng)}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Confirmar Ubicación
          </Button>
        </div>

        {/* Advertencia de validación */}
        {!isValidChileCoordinate(selectedLat, selectedLng) && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-700">
              ⚠️ Las coordenadas deben estar dentro del territorio chileno
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
