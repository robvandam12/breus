import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Users, Settings, Trash2, Filter, Eye } from "lucide-react";
import type { Inmersion } from '@/hooks/useInmersiones';
import { useCentros } from '@/hooks/useCentros';
import { useDebounce } from '@/hooks/useDebounce';
import { LeafletMap } from "@/components/ui/leaflet-map";

interface InmersionesMapViewEnhancedProps {
  inmersiones: Inmersion[];
  onSelect: (inmersion: Inmersion) => void;
  onViewDetail: (inmersion: Inmersion) => void;
  onEdit: (inmersion: Inmersion) => void;
  onDelete: (inmersion: Inmersion) => void;
}

export const InmersionesMapViewEnhanced = React.memo(({ 
  inmersiones, 
  onSelect, 
  onViewDetail, 
  onEdit, 
  onDelete 
}: InmersionesMapViewEnhancedProps) => {
  const { centros, isLoading: centrosLoading } = useCentros();
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Usar debounce para filtros
  const debouncedRegionFilter = useDebounce(selectedRegion, 300);
  const debouncedStatusFilter = useDebounce(selectedStatus, 300);

  // Función para obtener color según estado de inmersión
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'planificada':
        return '#3B82F6'; // blue
      case 'en_progreso':
        return '#F59E0B'; // amber
      case 'completada':
        return '#10B981'; // green
      case 'cancelada':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  };

  // Memoizar regiones disponibles
  const availableRegions = useMemo(() => {
    const regions = new Set<string>();
    centros.forEach(centro => {
      if (centro.region && centro.region.trim()) {
        regions.add(centro.region);
      }
    });
    return Array.from(regions).sort();
  }, [centros]);

  // Memoizar inmersiones filtradas
  const filteredInmersiones = useMemo(() => {
    return inmersiones.filter(inmersion => {
      // Filtrar por región si está seleccionada
      if (debouncedRegionFilter !== 'all') {
        const inmersionCentro = centros.find(centro => 
          centro.id === inmersion.centro_id
        );
        if (!inmersionCentro || inmersionCentro.region !== debouncedRegionFilter) {
          return false;
        }
      }
      
      // Filtrar por estado si está seleccionado
      if (debouncedStatusFilter !== 'all' && inmersion.estado !== debouncedStatusFilter) {
        return false;
      }
      
      return true;
    });
  }, [inmersiones, centros, debouncedRegionFilter, debouncedStatusFilter]);

  // Crear marcadores para las inmersiones con colores según estado
  const inmersionMarkers = useMemo(() => {
    return filteredInmersiones.map((inmersion) => {
      if (!inmersion || !inmersion.centro_id) return null;
      
      const centro = centros.find(c => c?.id === inmersion.centro_id);
      if (!centro || typeof centro.coordenadas_lat !== 'number' || typeof centro.coordenadas_lng !== 'number') return null;
      
      return {
        lat: centro.coordenadas_lat,
        lng: centro.coordenadas_lng,
        title: inmersion.codigo || 'Inmersión sin código',
        description: `${inmersion.objetivo || 'Sin objetivo'} - ${inmersion.estado || 'Sin estado'}\nCentro: ${centro.nombre || 'Sin nombre'}\nFecha: ${new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')}`,
        color: getEstadoColor(inmersion.estado),
        inmersion: inmersion
      };
    }).filter(Boolean);
  }, [filteredInmersiones, centros]);

  // Filtrar marcadores por región si es necesario
  const filteredMarkers = debouncedRegionFilter === 'all' 
    ? inmersionMarkers 
    : inmersionMarkers.filter(marker => {
        const centro = centros.find(c => c?.id === marker.inmersion?.centro_id);
        return centro?.region === debouncedRegionFilter;
      });

  // Calcular centro del mapa basado en las inmersiones filtradas
  const getMapCenter = () => {
    if (filteredMarkers.length === 0) return { lat: -41.4693, lng: -72.9424 };
    
    const avgLat = filteredMarkers.reduce((sum, marker) => sum + marker.lat, 0) / filteredMarkers.length;
    const avgLng = filteredMarkers.reduce((sum, marker) => sum + marker.lng, 0) / filteredMarkers.length;
    
    return { lat: avgLat, lng: avgLng };
  };

  const mapCenter = getMapCenter();

  const getStatusBadge = useCallback((estado: string) => {
    const colors = {
      'planificada': 'bg-blue-100 text-blue-800 border-blue-200',
      'en_progreso': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'completada': 'bg-green-100 text-green-800 border-green-200',
      'cancelada': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[estado as keyof typeof colors] || 'bg-muted text-muted-foreground';
  }, []);

  if (centrosLoading) {
    return (
      <div className="space-y-6">
        <Card className="h-96">
          <CardContent className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Mapa de Inmersiones
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por región" />
                </SelectTrigger>
                <SelectContent style={{ zIndex: 9999 }}>
                  <SelectItem value="all">Todas las regiones</SelectItem>
                  {availableRegions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent style={{ zIndex: 9999 }}>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="planificada">Planificada</SelectItem>
                  <SelectItem value="en_progreso">En Progreso</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
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
                onClick: () => onViewDetail(marker.inmersion)
              }))}
              showLocationSelector={false}
              initialZoom={8}
            />
          </div>
          
          {/* Leyenda de estados */}
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Planificada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-sm text-gray-600">En Progreso</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Completada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">Cancelada</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de inmersiones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInmersiones
          .filter(inmersion => {
            if (debouncedRegionFilter === 'all') return true;
            const centro = centros.find(c => c?.id === inmersion.centro_id);
            return centro?.region === debouncedRegionFilter;
          })
          .map((inmersion) => {
            if (!inmersion) return null;
            
            const centro = centros.find(c => c?.id === inmersion.centro_id);
            return (
              <Card key={inmersion.inmersion_id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm">{inmersion.codigo || 'Sin código'}</h3>
                    <Badge className={getStatusBadge(inmersion.estado)}>
                      {inmersion.estado?.replace('_', ' ') || 'Sin estado'}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')}</span>
                    </div>
                    {centro && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{centro.nombre || 'Sin nombre'}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{inmersion.buzo_principal || 'No asignado'}</span>
                    </div>
                  </div>
                  
                  {/* Acciones */}
                  <div className="flex gap-1 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetail(inmersion)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(inmersion)}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(inmersion)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          }).filter(Boolean)}
      </div>

      {filteredInmersiones.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No hay inmersiones para mostrar</h3>
          <p className="text-sm">
            {inmersiones.length === 0 
              ? 'No hay inmersiones registradas'
              : 'Prueba ajustando los filtros para ver más resultados'
            }
          </p>
        </div>
      )}
    </div>
  );
});

InmersionesMapViewEnhanced.displayName = 'InmersionesMapViewEnhanced';