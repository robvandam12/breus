
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Search, Target } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Coordinate validation for Chile region
  const isValidChileCoordinate = (lat: number, lng: number) => {
    return lat >= -56.5 && lat <= -17.5 && lng >= -109.5 && lng <= -66.4;
  };

  const handleCoordinateChange = (lat: number, lng: number) => {
    if (isValidChileCoordinate(lat, lng)) {
      setSelectedLat(lat);
      setSelectedLng(lng);
      onLocationSelect(lat, lng);
    }
  };

  const handleManualInput = () => {
    const lat = selectedLat;
    const lng = selectedLng;
    if (isValidChileCoordinate(lat, lng)) {
      onLocationSelect(lat, lng);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          handleCoordinateChange(lat, lng);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  // Simulate map search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      // Mock search results for Chilean locations
      const mockResults = [
        { name: 'Puerto Montt', lat: -41.4693, lng: -72.9424 },
        { name: 'Valparaíso', lat: -33.0458, lng: -71.6197 },
        { name: 'Punta Arenas', lat: -53.1638, lng: -70.9171 },
        { name: 'Castro', lat: -42.4827, lng: -73.7615 }
      ];
      
      const result = mockResults.find(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (result) {
        handleCoordinateChange(result.lat, result.lng);
      }
      setIsSearching(false);
    }, 1000);
  };

  return (
    <Card className={`ios-card ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="w-5 h-5 text-blue-600" />
          Seleccionar Ubicación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Section */}
        <div className="space-y-3">
          <Label htmlFor="search-location">Buscar Ubicación</Label>
          <div className="flex gap-2">
            <Input
              id="search-location"
              placeholder="Ej: Puerto Montt, Castro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="touch-target"
            />
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="touch-target"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mock Map Display */}
        <div className="space-y-3">
          <Label>Mapa Interactivo</Label>
          <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-dashed border-blue-200 p-8 min-h-[300px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-blue-900">
                  Ubicación Seleccionada
                </p>
                <p className="text-xs text-blue-700">
                  Lat: {selectedLat.toFixed(6)}
                </p>
                <p className="text-xs text-blue-700">
                  Lng: {selectedLng.toFixed(6)}
                </p>
              </div>
              <p className="text-xs text-blue-600">
                Haz clic en el mapa para seleccionar una ubicación
              </p>
            </div>
          </div>
        </div>

        {/* Manual Coordinate Input */}
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

        {/* Action Buttons */}
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
          >
            <MapPin className="w-4 h-4 mr-2" />
            Confirmar Ubicación
          </Button>
        </div>

        {/* Coordinate Validation Warning */}
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
