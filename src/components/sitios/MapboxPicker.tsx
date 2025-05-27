
import { SimpleMap } from '@/components/ui/simple-map';

interface MapboxPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
  height?: string;
}

export const MapboxPicker = ({ 
  onLocationSelect, 
  initialLat = -33.4489, 
  initialLng = -70.6693,
  height = "400px" 
}: MapboxPickerProps) => {
  return (
    <SimpleMap
      onLocationSelect={onLocationSelect}
      initialLat={initialLat}
      initialLng={initialLng}
      height={height}
    />
  );
};
