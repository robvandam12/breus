import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LeafletMap } from '@/components/ui/leaflet-map';
import { MapPin, Search, Navigation } from 'lucide-react';

interface EnhancedLocationSelectorProps {
  initialLat?: number;
  initialLng?: number;
  onLocationChange: (lat: number, lng: number) => void;
  onAddressChange?: (address: string) => void;
  address?: string;
}

export const EnhancedLocationSelector = ({
  initialLat = -41.4693,
  initialLng = -72.9424,
  onLocationChange,
  onAddressChange,
  address = ''
}: EnhancedLocationSelectorProps) => {
  const [searchAddress, setSearchAddress] = useState(address);
  const [manualLat, setManualLat] = useState(initialLat.toString());
  const [manualLng, setManualLng] = useState(initialLng.toString());
  const [currentLat, setCurrentLat] = useState(initialLat);
  const [currentLng, setCurrentLng] = useState(initialLng);
  const [isSearching, setIsSearching] = useState(false);

  const handleLocationSelect = (lat: number, lng: number) => {
    setCurrentLat(lat);
    setCurrentLng(lng);
    setManualLat(lat.toString());
    setManualLng(lng.toString());
    onLocationChange(lat, lng);
  };

  const handleAddressSearch = async () => {
    if (!searchAddress.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&limit=1&countrycodes=cl`
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
    } finally {
      setIsSearching(false);
    }
  };

  const handleManualCoordinates = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      handleLocationSelect(lat, lng);
    }
  };

  const markers = (currentLat && currentLng && 
    (currentLat !== -41.4693 || currentLng !== -72.9424)) ? [{
    lat: currentLat,
    lng: currentLng,
    title: 'Ubicación seleccionada',
    description: searchAddress || `${currentLat.toFixed(6)}, ${currentLng.toFixed(6)}`
  }] : [];

  return (
    <div className="space-y-4">
      <Tabs defaultValue="address" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="address" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Por Dirección
          </TabsTrigger>
          <TabsTrigger value="coordinates" className="flex items-center gap-2">
            <Navigation className="w-4 h-4" />
            Por Coordenadas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="address" className="space-y-4">
          <div className="space-y-2">
            <Label>Buscar por Dirección</Label>
            <div className="flex gap-2">
              <Input
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                placeholder="Ej: Vicente Pérez Rosales 1001, Puerto Varas"
                onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddressSearch}
                disabled={isSearching}
                className="px-3"
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Presione Enter o haga clic en la lupa para buscar
            </p>
          </div>
        </TabsContent>

        <TabsContent value="coordinates" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Latitud</Label>
              <Input
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                placeholder="-41.4693"
                type="number"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label>Longitud</Label>
              <Input
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                placeholder="-72.9424"
                type="number"
                step="any"
              />
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleManualCoordinates}
            className="w-full"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Aplicar Coordenadas
          </Button>
        </TabsContent>
      </Tabs>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Mapa Interactivo
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
        <p className="text-sm text-muted-foreground">
          Haga clic en el mapa para seleccionar la ubicación exacta.
        </p>
      </div>

      {currentLat && currentLng && (
        <div className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
          <strong>Ubicación seleccionada:</strong><br />
          Latitud: {currentLat.toFixed(6)}<br />
          Longitud: {currentLng.toFixed(6)}
          {searchAddress && (
            <>
              <br />
              <strong>Dirección:</strong> {searchAddress}
            </>
          )}
        </div>
      )}
    </div>
  );
};