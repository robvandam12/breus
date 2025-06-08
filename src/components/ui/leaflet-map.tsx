
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Search } from 'lucide-react';
import { SimpleMap } from '@/components/ui/simple-map';

interface LeafletMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
  height?: string;
  showAddressSearch?: boolean;
  markers?: Array<{
    lat: number;
    lng: number;
    title: string;
    description?: string;
  }>;
}

export const LeafletMap = (props: LeafletMapProps) => {
  const {
    onLocationSelect,
    initialLat = -41.4693,
    initialLng = -72.9424,
    height = "400px",
    showAddressSearch = true,
    markers = []
  } = props;

  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const searchAddress = async () => {
    if (!address.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=cl`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
      } else {
        alert('No se encontró la dirección. Intenta con una dirección más específica.');
      }
    } catch (error) {
      console.error('Error searching address:', error);
      alert('Error al buscar la dirección');
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  };

  // Ensure markers is always an array
  const safeMarkers = Array.isArray(markers) ? markers : [];

  return (
    <div className="w-full space-y-4" style={{ height }}>
      {showAddressSearch && (
        <div className="space-y-2">
          <Label htmlFor="address-search">Buscar por dirección</Label>
          <div className="flex gap-2">
            <Input
              id="address-search"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ej: Puerto Montt, Región de Los Lagos"
              onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
            />
            <Button 
              onClick={searchAddress} 
              disabled={isSearching}
              size="sm"
            >
              <Search className="w-4 h-4" />
              {isSearching ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>
        </div>
      )}
      
      <SimpleMap
        onLocationSelect={handleLocationSelect}
        initialLat={position[0]}
        initialLng={position[1]}
        height={showAddressSearch ? 'calc(100% - 80px)' : '100%'}
        markers={safeMarkers}
      />
      
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span>
            <strong>Coordenadas:</strong> {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </span>
        </div>
        <p className="mt-1 text-xs">
          Haz clic en el mapa para seleccionar una ubicación o busca por dirección
        </p>
      </div>
    </div>
  );
};
