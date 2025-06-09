
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, MapPin } from 'lucide-react';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

export const LeafletMap = ({
  onLocationSelect,
  initialLat = -41.4693,
  initialLng = -72.9424,
  height = "400px",
  showAddressSearch = true,
  markers = []
}: LeafletMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentMarkerRef = useRef<L.Marker | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current).setView([initialLat, initialLng], 10);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current);

    // Add initial marker
    currentMarkerRef.current = L.marker([initialLat, initialLng])
      .addTo(mapInstanceRef.current)
      .bindPopup('Ubicación seleccionada');

    // Handle map clicks
    mapInstanceRef.current.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      // Update current marker
      if (currentMarkerRef.current) {
        currentMarkerRef.current.setLatLng([lat, lng]);
      } else {
        currentMarkerRef.current = L.marker([lat, lng])
          .addTo(mapInstanceRef.current!)
          .bindPopup('Ubicación seleccionada');
      }

      onLocationSelect(lat, lng);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initialLat, initialLng, onLocationSelect]);

  // Update markers when props change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing additional markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current!.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    markers.forEach(markerData => {
      const marker = L.marker([markerData.lat, markerData.lng])
        .addTo(mapInstanceRef.current!)
        .bindPopup(`<strong>${markerData.title}</strong><br/>${markerData.description || ''}`);
      
      markersRef.current.push(marker);
    });
  }, [markers]);

  const searchAddress = async () => {
    if (!address.trim() || !mapInstanceRef.current) return;
    
    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', Chile')}&limit=1&countrycodes=cl`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        
        // Move map to location
        mapInstanceRef.current.setView([lat, lng], 13);
        
        // Update marker
        if (currentMarkerRef.current) {
          currentMarkerRef.current.setLatLng([lat, lng]);
        } else {
          currentMarkerRef.current = L.marker([lat, lng])
            .addTo(mapInstanceRef.current)
            .bindPopup('Ubicación encontrada');
        }
        
        onLocationSelect(lat, lng);
      } else {
        console.log('No se encontró la dirección');
      }
    } catch (error) {
      console.error('Error searching address:', error);
    } finally {
      setIsSearching(false);
    }
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
      
      <div 
        ref={mapRef}
        className="w-full border border-gray-300 rounded-lg"
        style={{ height: showAddressSearch ? 'calc(100% - 80px)' : '100%' }}
      />
      
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="font-medium">
            Haz clic en el mapa para seleccionar una ubicación
          </span>
        </div>
      </div>
    </div>
  );
};
