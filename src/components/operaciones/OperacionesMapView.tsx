import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { LeafletMap } from "@/components/ui/leaflet-map";
import { useCentros } from "@/hooks/useCentros";

interface OperacionesMapViewProps {
  operaciones: any[];
  selectedEnterprise?: any;
}

export const OperacionesMapView = ({ operaciones, selectedEnterprise }: OperacionesMapViewProps) => {
  const { centros } = useCentros();

  // Preparar marcadores del mapa basados en los centros de las operaciones
  const mapMarkers = React.useMemo(() => {
    const markers: any[] = [];
    
    operaciones.forEach(operacion => {
      const centro = centros.find(c => c.id === operacion.centro_id);
      
      if (centro && centro.coordenadas_lat && centro.coordenadas_lng) {
        markers.push({
          lat: centro.coordenadas_lat,
          lng: centro.coordenadas_lng,
          title: operacion.nombre,
          description: `${operacion.codigo} - ${centro.nombre}`,
          popupContent: `
            <div class="p-2">
              <h4 class="font-semibold">${operacion.nombre}</h4>
              <p class="text-sm text-gray-600">${operacion.codigo}</p>
              <p class="text-sm"><strong>Centro:</strong> ${centro.nombre}</p>
              <p class="text-sm"><strong>Estado:</strong> ${operacion.estado}</p>
            </div>
          `
        });
      }
    });
    
    return markers;
  }, [operaciones, centros]);

  // Centro del mapa por defecto (Chile central)
  const mapCenter = mapMarkers.length > 0 
    ? { lat: mapMarkers[0].lat, lng: mapMarkers[0].lng }
    : { lat: -33.4489, lng: -70.6693 };

  return (
    <div className="space-y-4">
      {/* Información del mapa */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <CardTitle className="text-lg">Ubicaciones de Operaciones</CardTitle>
            </div>
            <Badge variant="outline">
              {mapMarkers.length} ubicaciones
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {mapMarkers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Sin Ubicaciones</h3>
              <p className="text-sm">
                No hay operaciones con centros georeferenciados para mostrar en el mapa.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Mapa */}
              <div className="h-96 rounded-lg overflow-hidden border">
                <LeafletMap
                  initialLat={mapCenter.lat}
                  initialLng={mapCenter.lng}
                  initialZoom={8}
                  markers={mapMarkers.map(marker => ({
                    lat: marker.lat,
                    lng: marker.lng,
                    title: marker.title,
                    description: marker.description
                  }))}
                  height="384px"
                />
              </div>
              
              {/* Lista de operaciones con ubicación */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {operaciones
                  .filter(op => {
                    const centro = centros.find(c => c.id === op.centro_id);
                    return centro && centro.coordenadas_lat && centro.coordenadas_lng;
                  })
                  .map(operacion => {
                    const centro = centros.find(c => c.id === operacion.centro_id);
                    return (
                      <Card key={operacion.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{operacion.codigo}</h4>
                              <Badge 
                                variant={
                                  operacion.estado === 'activa' ? 'default' :
                                  operacion.estado === 'completada' ? 'secondary' :
                                  operacion.estado === 'pausada' ? 'outline' : 'destructive'
                                }
                              >
                                {operacion.estado}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{operacion.nombre}</p>
                            {centro && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="w-3 h-3" />
                                <span>{centro.nombre}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OperacionesMapView;