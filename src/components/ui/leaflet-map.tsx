
import { InteractiveMap } from '@/components/ui/interactive-map';

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
  // Usar el nuevo componente InteractiveMap que funciona correctamente
  return <InteractiveMap {...props} />;
};
