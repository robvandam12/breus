
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Search, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface InteractiveMapProps {
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

export const InteractiveMap = ({
  onLocationSelect,
  initialLat = -41.4693,
  initialLng = -72.9424,
  height = "400px",
  showAddressSearch = true,
  markers = []
}: InteractiveMapProps) => {
  const [center, setCenter] = useState({ lat: initialLat, lng: initialLng });
  const [zoom, setZoom] = useState(10);
  const [selectedPosition, setSelectedPosition] = useState({ lat: initialLat, lng: initialLng });
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Función para buscar dirección
  const searchAddress = async () => {
    if (!address.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', Chile')}&limit=1&countrycodes=cl`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setCenter({ lat, lng });
        setSelectedPosition({ lat, lng });
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

  // Manejar click en el mapa
  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convertir coordenadas del click a lat/lng
    const width = rect.width;
    const height = rect.height;
    
    // Rango aproximado basado en el zoom y centro
    const latRange = 0.5 / zoom;
    const lngRange = 0.5 / zoom;
    
    const lat = center.lat + (0.5 - y / height) * latRange;
    const lng = center.lng + (x / width - 0.5) * lngRange;
    
    setSelectedPosition({ lat, lng });
    onLocationSelect(lat, lng);
  };

  // Controlar zoom
  const handleZoomIn = () => setZoom(Math.min(zoom + 2, 20));
  const handleZoomOut = () => setZoom(Math.max(zoom - 2, 1));
  const resetView = () => {
    setCenter({ lat: initialLat, lng: initialLng });
    setZoom(10);
  };

  // Función para convertir coordenadas a posición en píxeles
  const getMarkerPosition = (lat: number, lng: number) => {
    const latRange = 0.5 / zoom;
    const lngRange = 0.5 / zoom;
    
    const x = 50 + ((lng - center.lng) / lngRange) * 50;
    const y = 50 - ((lat - center.lat) / latRange) * 50;
    
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

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
      
      {/* Controles del mapa */}
      <div className="flex items-center justify-between bg-blue-50 p-2 rounded-lg">
        <span className="text-sm text-blue-700">
          Zoom: {zoom}x | Centro: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
        </span>
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
      
      {/* Mapa interactivo */}
      <div 
        ref={mapRef}
        className="relative bg-gradient-to-br from-blue-100 via-green-50 to-blue-100 border-2 border-blue-200 rounded-lg cursor-crosshair overflow-hidden shadow-inner"
        style={{ height: showAddressSearch ? 'calc(100% - 120px)' : 'calc(100% - 60px)' }}
        onClick={handleMapClick}
      >
        {/* Grid de fondo */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#3b82f6" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
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

        {/* Indicador de terreno */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Simulación de costa */}
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-yellow-100 to-transparent opacity-30"></div>
          {/* Simulación de agua */}
          <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-b from-blue-200 to-transparent opacity-20"></div>
        </div>

        {/* Coordenadas en tiempo real */}
        <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs shadow">
          Seleccionado: {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
        </div>
      </div>

      {/* Información de ubicación */}
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span>
            <strong>Coordenadas seleccionadas:</strong> {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
          </span>
        </div>
        <p className="mt-1 text-xs">
          Haz clic en el mapa para seleccionar una ubicación o busca por dirección
        </p>
      </div>
    </div>
  );
};
