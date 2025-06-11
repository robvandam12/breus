
import { useState, useEffect } from 'react';
import { LeafletMap } from '@/components/ui/leaflet-map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SitioMapSelectorProps {
  initialLat?: number;
  initialLng?: number;
  ubicacion?: string;
  onLocationSelect: (lat: number, lng: number) => void;
  onUbicacionChange?: (ubicacion: string) => void;
  height?: string;
}

export const SitioMapSelector = ({
  initialLat = -41.4693,
  initialLng = -72.9424,
  ubicacion = '',
  onLocationSelect,
  onUbicacionChange,
  height = "400px"
}: SitioMapSelectorProps) => {
  const [coordinates, setCoordinates] = useState({ lat: initialLat, lng: initialLng });
  const [searchLocation, setSearchLocation] = useState(ubicacion);

  const handleLocationFromMap = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    onLocationSelect(lat, lng);
  };

  const handleSearchLocation = async () => {
    if (!searchLocation.trim()) return;
    
    try {
      // Usar Nominatim de OpenStreetMap para geocodificación
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchLocation)}&limit=1&countrycodes=cl`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setCoordinates({ lat, lng });
        onLocationSelect(lat, lng);
        if (onUbicacionChange) {
          onUbicacionChange(data[0].display_name);
        }
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  useEffect(() => {
    setSearchLocation(ubicacion);
  }, [ubicacion]);

  useEffect(() => {
    setCoordinates({ lat: initialLat, lng: initialLng });
  }, [initialLat, initialLng]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Ubicación del Sitio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Buscar ubicación... ej: Puerto Montt, Los Lagos"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchLocation()}
          />
          <Button onClick={handleSearchLocation} size="sm">
            <Search className="w-4 h-4" />
          </Button>
        </div>
        
        <LeafletMap
          onLocationSelect={handleLocationFromMap}
          initialLat={coordinates.lat}
          initialLng={coordinates.lng}
          height={height}
          showAddressSearch={false}
          markers={[{
            lat: coordinates.lat,
            lng: coordinates.lng,
            title: 'Ubicación seleccionada',
            color: '#3B82F6'
          }]}
        />
        
        <div className="text-sm text-gray-600">
          <p><strong>Coordenadas:</strong> {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}</p>
          <p className="text-xs text-gray-500 mt-1">
            Haz clic en el mapa para seleccionar una ubicación o busca por nombre
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
