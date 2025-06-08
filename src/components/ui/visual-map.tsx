
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Search, ZoomIn, ZoomOut, RotateCcw, Navigation } from 'lucide-react';

interface VisualMapProps {
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

export const VisualMap = ({
  onLocationSelect,
  initialLat = -41.4693,
  initialLng = -72.9424,
  height = "400px",
  showAddressSearch = true,
  markers = []
}: VisualMapProps) => {
  const [center, setCenter] = useState({ lat: initialLat, lng: initialLng });
  const [zoom, setZoom] = useState(10);
  const [selectedPosition, setSelectedPosition] = useState({ lat: initialLat, lng: initialLng });
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Simulador de búsqueda de direcciones chilenas
  const searchAddress = async () => {
    if (!address.trim()) return;
    
    setIsSearching(true);
    
    // Simular delay de búsqueda
    setTimeout(() => {
      const locations = [
        { name: 'puerto montt', lat: -41.4693, lng: -72.9424 },
        { name: 'valparaíso', lat: -33.0458, lng: -71.6197 },
        { name: 'santiago', lat: -33.4489, lng: -70.6693 },
        { name: 'concepción', lat: -36.8201, lng: -73.0444 },
        { name: 'temuco', lat: -38.7359, lng: -72.5904 },
        { name: 'antofagasta', lat: -23.6509, lng: -70.3975 },
        { name: 'iquique', lat: -20.2307, lng: -70.1355 },
        { name: 'punta arenas', lat: -53.1638, lng: -70.9171 },
        { name: 'castro', lat: -42.4827, lng: -73.7615 },
        { name: 'chillán', lat: -36.6067, lng: -72.1034 }
      ];
      
      const searchTerm = address.toLowerCase();
      const found = locations.find(loc => 
        loc.name.includes(searchTerm) || searchTerm.includes(loc.name)
      );
      
      if (found) {
        setCenter({ lat: found.lat, lng: found.lng });
        setSelectedPosition({ lat: found.lat, lng: found.lng });
        onLocationSelect(found.lat, found.lng);
      }
      
      setIsSearching(false);
    }, 800);
  };

  // Manejar click en el mapa
  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convertir coordenadas del click a lat/lng (zona de Chile)
    const width = rect.width;
    const height = rect.height;
    
    // Mapear a coordenadas de Chile aproximadamente
    const latRange = 15; // Rango de latitud de Chile (-17 a -56)
    const lngRange = 20; // Rango de longitud de Chile (-66 a -109)
    
    const lat = -17 - (y / height) * latRange;
    const lng = -66 - (x / width) * lngRange;
    
    setSelectedPosition({ lat, lng });
    onLocationSelect(lat, lng);
  };

  // Controles de zoom
  const handleZoomIn = () => setZoom(Math.min(zoom + 2, 20));
  const handleZoomOut = () => setZoom(Math.max(zoom - 2, 1));
  const resetView = () => {
    setCenter({ lat: initialLat, lng: initialLng });
    setSelectedPosition({ lat: initialLat, lng: initialLng });
    setZoom(10);
  };

  // Función para convertir coordenadas a posición en píxeles
  const getMarkerPosition = (lat: number, lng: number) => {
    // Normalizar coordenadas a Chile
    const latNorm = (lat + 17) / -39; // Normalizar latitud (-17 a -56)
    const lngNorm = (lng + 66) / -43; // Normalizar longitud (-66 a -109)
    
    const x = Math.max(0, Math.min(100, lngNorm * 100));
    const y = Math.max(0, Math.min(100, latNorm * 100));
    
    return { x, y };
  };

  return (
    <div className="w-full space-y-4" style={{ height }}>
      {showAddressSearch && (
        <div className="space-y-2">
          <Label htmlFor="address-search">Buscar ubicación en Chile</Label>
          <div className="flex gap-2">
            <Input
              id="address-search"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ej: Puerto Montt, Santiago, Valparaíso"
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
      
      {/* Controles del mapa */}
      <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700 font-medium">
            Mapa de Chile - Zoom: {zoom}x
          </span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 20}
          >
            <ZoomIn className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 1}
          >
            <ZoomOut className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetView}
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      {/* Mapa visual de Chile */}
      <div 
        ref={mapRef}
        className="relative bg-gradient-to-b from-sky-200 via-blue-100 to-green-100 border-2 border-blue-300 rounded-lg cursor-crosshair overflow-hidden shadow-lg"
        style={{ height: showAddressSearch ? 'calc(100% - 140px)' : 'calc(100% - 80px)' }}
        onClick={handleMapClick}
      >
        {/* Silueta de Chile */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {/* Contorno aproximado de Chile */}
          <path
            d="M25 5 L35 8 L40 15 L38 25 L35 35 L32 45 L30 55 L28 65 L25 75 L22 85 L20 95 L18 95 L20 85 L22 75 L24 65 L26 55 L28 45 L30 35 L32 25 L30 15 L25 5 Z"
            fill="rgba(34, 197, 94, 0.3)"
            stroke="rgba(34, 197, 94, 0.6)"
            strokeWidth="0.5"
          />
          {/* Islas */}
          <circle cx="15" cy="90" r="1" fill="rgba(34, 197, 94, 0.4)" />
          <circle cx="12" cy="88" r="0.8" fill="rgba(34, 197, 94, 0.4)" />
        </svg>

        {/* Grid de coordenadas */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="chile-grid" width="25" height="25" patternUnits="userSpaceOnUse">
                <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#3b82f6" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#chile-grid)" />
          </svg>
        </div>

        {/* Marcador de posición seleccionada */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-full z-20 animate-bounce"
          style={{
            left: `${getMarkerPosition(selectedPosition.lat, selectedPosition.lng).x}%`,
            top: `${getMarkerPosition(selectedPosition.lat, selectedPosition.lng).y}%`
          }}
        >
          <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg" fill="currentColor" />
        </div>

        {/* Marcadores adicionales */}
        {markers.map((marker, index) => {
          const position = getMarkerPosition(marker.lat, marker.lng);
          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-full z-10 group"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`
              }}
              title={marker.title}
            >
              <MapPin className="w-6 h-6 text-blue-600 drop-shadow-md" fill="currentColor" />
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 hidden group-hover:block bg-white p-2 rounded shadow-lg border text-xs whitespace-nowrap z-30 max-w-48">
                <div className="font-medium">{marker.title}</div>
                {marker.description && (
                  <div className="text-gray-600 text-xs">{marker.description}</div>
                )}
              </div>
            </div>
          );
        })}

        {/* Etiquetas de referencia */}
        <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-blue-700">
          Norte
        </div>
        <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-blue-700">
          Sur
        </div>
        <div className="absolute top-1/2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-blue-700 transform -translate-y-1/2">
          Océano Pacífico
        </div>

        {/* Coordenadas en tiempo real */}
        <div className="absolute bottom-2 right-2 bg-white/95 px-3 py-2 rounded-lg text-xs shadow-md border">
          <div className="font-medium text-gray-700">Ubicación seleccionada:</div>
          <div className="text-blue-600 font-mono">
            {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
          </div>
        </div>
      </div>

      {/* Información de ubicación */}
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="font-medium">
            Coordenadas: {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
          </span>
        </div>
        <p className="text-xs text-blue-600">
          Haz clic en cualquier parte del mapa para seleccionar una ubicación en Chile
        </p>
      </div>
    </div>
  );
};
