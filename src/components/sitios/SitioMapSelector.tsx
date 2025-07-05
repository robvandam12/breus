
import { useState, useEffect } from 'react';
import { LeafletMap } from '@/components/ui/leaflet-map';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';

interface SitioMapSelectorProps {
  initialLat?: number;
  initialLng?: number;
  onLocationChange: (lat: number, lng: number) => void;
  onAddressChange?: (address: string) => void;
  address?: string;
  showAddressSearch?: boolean;
}

export const SitioMapSelector = ({
  initialLat = -41.4693,
  initialLng = -72.9424,
  onLocationChange,
  onAddressChange,
  address = '',
  showAddressSearch = true
}: SitioMapSelectorProps) => {
  const [searchAddress, setSearchAddress] = useState(address);
  const [currentLat, setCurrentLat] = useState(initialLat);
  const [currentLng, setCurrentLng] = useState(initialLng);

  const handleLocationSelect = (lat: number, lng: number) => {
    setCurrentLat(lat);
    setCurrentLng(lng);
    onLocationChange(lat, lng);
  };

  const handleAddressSearch = async () => {
    if (!searchAddress.trim()) return;
    
    try {
      // Geocoding usando OpenStreetMap Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        handleLocationSelect(lat, lng);
        onAddressChange?.(searchAddress);
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
  };

  useEffect(() => {
    setSearchAddress(address);
  }, [address]);

  // Crear marcador si tenemos coordenadas
  const markers = (currentLat && currentLng && currentLat !== -41.4693 && currentLng !== -72.9424) ? [{
    lat: currentLat,
    lng: currentLng,
    title: 'Ubicación seleccionada',
    description: searchAddress || 'Ubicación marcada en el mapa'
  }] : [];

  return (
    <div className="space-y-4 p-4">
      {showAddressSearch && (
        <div className="space-y-2">
          <Label>Buscar Ubicación</Label>
          <div className="flex gap-2">
            <Input
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Ingrese dirección para buscar en el mapa"
              onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddressSearch}
              className="px-3"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Seleccionar Ubicación en el Mapa
        </Label>
        <div className="h-96 border rounded-lg overflow-hidden">
          <LeafletMap
            onLocationSelect={handleLocationSelect}
            height="100%"
            initialLat={currentLat}
            initialLng={currentLng}
            showAddressSearch={false}
            markers={markers}
            showLocationSelector={true}
          />
        </div>
        <p className="text-sm text-gray-500">
          Haga clic en el mapa para seleccionar la ubicación exacta del sitio.
        </p>
      </div>
    </div>
  );
};
