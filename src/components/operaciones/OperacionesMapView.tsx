
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

  // Crear marcadores para las operaciones basados en sus sitios con verificaciones de seguridad
  const operacionMarkers = Array.isArray(operaciones) ? operaciones.map((operacion) => {
    if (!operacion || !operacion.sitio_id) return null;
    
    const sitio = Array.isArray(sitios) ? sitios.find(s => s?.id === operacion.sitio_id) : null;
    if (!sitio || typeof sitio.coordenadas_lat !== 'number' || typeof sitio.coordenadas_lng !== 'number') return null;
    
    return {
      lat: sitio.coordenadas_lat,
      lng: sitio.coordenadas_lng,
      title: operacion.nombre || 'Operación sin nombre',
      description: `${operacion.codigo || 'Sin código'} - ${operacion.estado || 'Sin estado'}\nSitio: ${sitio.nombre || 'Sin nombre'}`
    };
  }).filter(Boolean) : [];

  // Filtrar elementos null y asegurar que tenemos el tipo correcto
  const validMarkers = operacionMarkers.filter((marker): marker is {
    lat: number;
    lng: number;
    title: string;
    description: string;
  } => marker !== null);

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
            markers={validMarkers}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(operaciones) ? operaciones.map((operacion) => {
          if (!operacion) return null;
          
          const sitio = Array.isArray(sitios) ? sitios.find(s => s?.id === operacion.sitio_id) : null;
          return (
            <Card key={operacion.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm">{operacion.nombre || 'Sin nombre'}</h3>
                  <Badge variant={operacion.estado === 'activa' ? 'default' : 'secondary'}>
                    {operacion.estado || 'Sin estado'}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{operacion.fecha_inicio ? new Date(operacion.fecha_inicio).toLocaleDateString('es-CL') : 'Sin fecha'}</span>
                  </div>
                  {sitio && (
                    <div className="flex items-center gap-1">
                      <Building className="w-3 h-3" />
                      <span>{sitio.nombre || 'Sin nombre'}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>
                      {sitio && typeof sitio.coordenadas_lat === 'number' && typeof sitio.coordenadas_lng === 'number'
                        ? `${sitio.coordenadas_lat.toFixed(4)}, ${sitio.coordenadas_lng.toFixed(4)}`
                        : 'Sin coordenadas'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }).filter(Boolean) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No hay operaciones disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
};
