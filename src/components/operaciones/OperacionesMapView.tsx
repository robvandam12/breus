
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Building, Eye, Settings, Trash2, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSitios } from "@/hooks/useSitios";
import { LeafletMap } from "@/components/ui/leaflet-map";

interface OperacionesMapViewProps {
  operaciones: any[];
  onSelect: (operacion: any) => void;
  onViewDetail: (operacion: any) => void;
  onEdit: (operacion: any) => void;
  onDelete: (operacionId: string) => void;
}

export const OperacionesMapView = ({ 
  operaciones, 
  onSelect, 
  onViewDetail, 
  onEdit, 
  onDelete 
}: OperacionesMapViewProps) => {
  const { sitios } = useSitios();
  const [regionFilter, setRegionFilter] = useState<string>('all');

  // Función para obtener color según estado de operación
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activa':
        return '#10B981'; // green
      case 'pausada':
        return '#F59E0B'; // amber
      case 'completada':
        return '#3B82F6'; // blue
      case 'cancelada':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  };

  // Crear marcadores para las operaciones con colores según estado
  const operacionMarkers = Array.isArray(operaciones) ? operaciones.map((operacion) => {
    if (!operacion || !operacion.sitio_id) return null;
    
    const sitio = Array.isArray(sitios) ? sitios.find(s => s?.id === operacion.sitio_id) : null;
    if (!sitio || typeof sitio.coordenadas_lat !== 'number' || typeof sitio.coordenadas_lng !== 'number') return null;
    
    return {
      lat: sitio.coordenadas_lat,
      lng: sitio.coordenadas_lng,
      title: operacion.nombre || 'Operación sin nombre',
      description: `${operacion.codigo || 'Sin código'} - ${operacion.estado || 'Sin estado'}\nSitio: ${sitio.nombre || 'Sin nombre'}`,
      color: getEstadoColor(operacion.estado),
      operacion: operacion
    };
  }).filter(Boolean) : [];

  // Filtrar por región si es necesario
  const filteredMarkers = regionFilter === 'all' 
    ? operacionMarkers 
    : operacionMarkers.filter(marker => {
        const sitio = sitios.find(s => s?.id === marker.operacion?.sitio_id);
        return sitio?.region === regionFilter;
      });

  // Obtener regiones únicas
  const regiones = Array.from(new Set(sitios.map(s => s?.region).filter(Boolean)));

  // Calcular centro del mapa basado en las operaciones filtradas
  const getMapCenter = () => {
    if (filteredMarkers.length === 0) return { lat: -41.4693, lng: -72.9424 };
    
    const avgLat = filteredMarkers.reduce((sum, marker) => sum + marker.lat, 0) / filteredMarkers.length;
    const avgLng = filteredMarkers.reduce((sum, marker) => sum + marker.lng, 0) / filteredMarkers.length;
    
    return { lat: avgLat, lng: avgLng };
  };

  const mapCenter = getMapCenter();

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Mapa de Operaciones
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por región" />
                </SelectTrigger>
                <SelectContent style={{ zIndex: 9999 }}>
                  <SelectItem value="all">Todas las regiones</SelectItem>
                  {regiones.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ zIndex: 1 }}>
            <LeafletMap
              initialLat={mapCenter.lat}
              initialLng={mapCenter.lng}
              height="500px"
              showAddressSearch={false}
              markers={filteredMarkers.map(marker => ({
                lat: marker.lat,
                lng: marker.lng,
                title: marker.title,
                description: marker.description,
                color: marker.color,
                onClick: () => onViewDetail(marker.operacion)
              }))}
              showLocationSelector={false}
              initialZoom={8}
            />
          </div>
          
          {/* Leyenda de estados */}
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Activa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm text-gray-600">Pausada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Completada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">Cancelada</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de operaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(operaciones) ? operaciones
          .filter(operacion => {
            if (regionFilter === 'all') return true;
            const sitio = sitios.find(s => s?.id === operacion.sitio_id);
            return sitio?.region === regionFilter;
          })
          .map((operacion) => {
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
                <div className="space-y-1 text-xs text-gray-600 mb-3">
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
                
                {/* Acciones */}
                <div className="flex gap-1 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetail(operacion)}
                    className="ios-button-sm"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(operacion)}
                    className="ios-button-sm"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(operacion.id)}
                    className="ios-button-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
