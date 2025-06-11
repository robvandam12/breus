
import { useState, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LeafletMap } from '@/components/ui/leaflet-map';

interface SitioMapSelectorProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (lat: number, lng: number) => void;
  onLocationSearch?: (location: string) => void;
  searchValue?: string;
  height?: string;
}

export const SitioMapSelector = ({
  initialLat = -41.4693,
  initialLng = -72.9424,
  onLocationSelect,
  onLocationSearch,
  searchValue = '',
  height = "400px"
}: SitioMapSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState(searchValue);
  const [currentLat, setCurrentLat] = useState(initialLat);
  const [currentLng, setCurrentLng] = useState(initialLng);

  useEffect(() => {
    if (searchValue !== searchTerm) {
      setSearchTerm(searchValue);
    }
  }, [searchValue]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setCurrentLat(lat);
    setCurrentLng(lng);
    onLocationSelect(lat, lng);
  };

  const handleSearch = () => {
    if (onLocationSearch && searchTerm) {
      onLocationSearch(searchTerm);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar ubicación por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} type="button">
          <Search className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="relative border rounded-lg overflow-hidden">
        <LeafletMap
          onLocationSelect={handleLocationSelect}
          height={height}
          initialLat={currentLat}
          initialLng={currentLng}
          showAddressSearch={false}
        />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-gray-600 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          Haz clic en el mapa para seleccionar ubicación
        </div>
      </div>
    </div>
  );
};
