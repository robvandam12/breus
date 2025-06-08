
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Building } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useSitios } from "@/hooks/useSitios";
import { LeafletMap } from "@/components/ui/leaflet-map";

export const OperacionesMapView = () => {
  const { operaciones, isLoading } = useOperaciones();
  const { sitios } = useSitios();
  const [selectedLocation, setSelectedLocation] = useState({ lat: -41.4693, lng: -72.9424 });

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Crear marcadores para las operaciones basados en sus sitios
  const operacionMarkers = operaciones.map((operacion) => {
    const sitio = sitios.find(s => s.id === operacion.sitio_id);
    if (!sitio || !sitio.coordenadas_lat || !sitio.coordenadas_lng) return null;
    
    return {
      lat: sitio.coordenadas_lat,
      lng: sitio.coordenadas_lng,
      title: operacion.nombre,
      description: `${operacion.codigo} - ${operacion.estado}\nSitio: ${sitio.nombre}`
    };
  }).filter(Boolean) as Array<{
    lat: number;
    lng: number;
    title: string;
    description: string;
  }>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Mapa de Operaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LeafletMap
            onLocationSelect={handleLocationSelect}
            initialLat={selectedLocation.lat}
            initialLng={selectedLocation.lng}
            height="500px"
            showAddressSearch={false}
            markers={operacionMarkers}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {operaciones.map((operacion) => {
          const sitio = sitios.find(s => s.id === operacion.sitio_id);
          return (
            <Card key={operacion.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm">{operacion.nombre}</h3>
                  <Badge variant={operacion.estado === 'activa' ? 'default' : 'secondary'}>
                    {operacion.estado}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}</span>
                  </div>
                  {sitio && (
                    <div className="flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      <span>{sitio.nombre}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>
                      {sitio && sitio.coordenadas_lat && sitio.coordenadas_lng 
                        ? `${sitio.coordenadas_lat.toFixed(4)}, ${sitio.coordenadas_lng.toFixed(4)}`
                        : 'Sin coordenadas'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
