
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Search } from 'lucide-react';
import { SimpleMap } from '@/components/ui/simple-map';

// Componente simplificado que usa lazy loading pero con mejor manejo de errores
const LazyLeafletMap = ({ onLocationSelect, initialLat, initialLng, height, showAddressSearch, markers = [] }: any) => {
  const [leafletComponents, setLeafletComponents] = useState<any>(null);
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        console.log('Loading Leaflet components...');
        const [leafletModule, reactLeafletModule] = await Promise.all([
          import('leaflet'),
          import('react-leaflet')
        ]);
        
        // Import CSS
        await import('leaflet/dist/leaflet.css');
        
        // Fix for default markers
        const L = leafletModule.default;
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        console.log('Leaflet components loaded successfully');
        setLeafletComponents({
          MapContainer: reactLeafletModule.MapContainer,
          TileLayer: reactLeafletModule.TileLayer,
          Marker: reactLeafletModule.Marker,
          Popup: reactLeafletModule.Popup,
        });
        setLoadError(false);
      } catch (error) {
        console.error('Error loading Leaflet:', error);
        setLoadError(true);
      }
    };

    loadLeaflet();
  }, []);

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

  const handleMapClick = (e: any) => {
    console.log('Map clicked:', e.latlng);
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  };

  // Ensure markers is always an array
  const safeMarkers = Array.isArray(markers) ? markers : [];

  // Si hay error o no se han cargado los componentes, usar SimpleMap
  if (loadError || !leafletComponents) {
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
          onLocationSelect={onLocationSelect}
          initialLat={initialLat}
          initialLng={initialLng}
          height={showAddressSearch ? 'calc(100% - 80px)' : '100%'}
          markers={safeMarkers}
        />
        
        {loadError && (
          <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
            Nota: Usando mapa simplificado debido a un problema de carga
          </div>
        )}
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = leafletComponents;

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
      
      <div className="border rounded-lg overflow-hidden" style={{ height: showAddressSearch ? 'calc(100% - 80px)' : '100%' }}>
        <MapContainer
          center={position}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
          eventHandlers={{
            click: handleMapClick,
          }}
          key={`${position[0]}-${position[1]}`} // Force re-render when position changes
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Marcador principal */}
          <Marker position={position}>
            <Popup>
              Ubicación seleccionada<br />
              Lat: {position[0].toFixed(6)}<br />
              Lng: {position[1].toFixed(6)}
            </Popup>
          </Marker>
          
          {/* Marcadores adicionales */}
          {safeMarkers.map((marker: any, index: number) => (
            <Marker key={`marker-${index}`} position={[marker.lat, marker.lng]}>
              <Popup>
                <strong>{marker.title}</strong>
                {marker.description && <><br />{marker.description}</>}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
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

  return (
    <LazyLeafletMap
      onLocationSelect={onLocationSelect}
      initialLat={initialLat}
      initialLng={initialLng}
      height={height}
      showAddressSearch={showAddressSearch}
      markers={markers}
    />
  );
};
