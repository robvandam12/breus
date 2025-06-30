
import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Users, Settings, Trash2, Filter } from "lucide-react";
import type { Inmersion } from '@/hooks/useInmersiones';
import { useCentros } from '@/hooks/useCentros';
import { useDebounce } from '@/hooks/useDebounce';

interface InmersionesMapViewProps {
  inmersiones: Inmersion[];
  onSelect: (inmersion: Inmersion) => void;
  onViewDetail: (inmersion: Inmersion) => void;
  onEdit: (inmersion: Inmersion) => void;
  onDelete: (inmersion: Inmersion) => void;
}

export const InmersionesMapView = React.memo(({ 
  inmersiones, 
  onSelect, 
  onViewDetail, 
  onEdit, 
  onDelete 
}: InmersionesMapViewProps) => {
  const { centros, isLoading: centrosLoading } = useCentros();
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Usar debounce para filtros
  const debouncedRegionFilter = useDebounce(selectedRegion, 300);
  const debouncedStatusFilter = useDebounce(selectedStatus, 300);

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

  // Memoizar centros con coordenadas
  const centrosWithCoords = useMemo(() => {
    return centros.filter(centro => 
      centro.coordenadas_lat && 
      centro.coordenadas_lng &&
      centro.estado === 'activo'
    );
  }, [centros]);

  // Memoizar inmersiones filtradas
  const filteredInmersiones = useMemo(() => {
    return inmersiones.filter(inmersion => {
      // Filtrar por región si está seleccionada
      if (debouncedRegionFilter !== 'all') {
        const inmersionCentro = centros.find(centro => 
          inmersion.centro?.toString() === centro.id || 
          inmersion.centro === centro.nombre
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

  // Memoizar inmersiones agrupadas por centro
  const inmersionesPorCentro = useMemo(() => {
    const grupos = new Map<string, Inmersion[]>();
    
    filteredInmersiones.forEach(inmersion => {
      const centroId = inmersion.centro?.toString() || 'sin_centro';
      if (!grupos.has(centroId)) {
        grupos.set(centroId, []);
      }
      grupos.get(centroId)!.push(inmersion);
    });
    
    return grupos;
  }, [filteredInmersiones]);

  const getStatusBadge = useCallback((estado: string) => {
    const colors = {
      'planificada': 'bg-blue-100 text-blue-800 border-blue-200',
      'en_progreso': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'completada': 'bg-green-100 text-green-800 border-green-200',
      'cancelada': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[estado as keyof typeof colors] || 'bg-muted text-muted-foreground';
  }, []);

  const getCentroInfo = useCallback((inmersion: Inmersion) => {
    const centro = centros.find(c => 
      inmersion.centro?.toString() === c.id || 
      inmersion.centro === c.nombre
    );
    return centro;
  }, [centros]);

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
      {/* Controles de filtro */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">Filtros:</span>
        </div>
        
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por región" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las regiones</SelectItem>
            {availableRegions.map(region => (
              <SelectItem key={region} value={region}>{region}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="planificada">Planificada</SelectItem>
            <SelectItem value="en_progreso">En Progreso</SelectItem>
            <SelectItem value="completada">Completada</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mapa placeholder con información de centros */}
      <Card className="h-96">
        <CardContent className="h-full p-4">
          <div className="h-full flex flex-col">
            <h3 className="text-lg font-medium mb-4">Mapa de Inmersiones por Centro</h3>
            
            {centrosWithCoords.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No hay centros con coordenadas disponibles
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Vista de Mapa Interactivo</h3>
                  <p className="text-gray-500 mb-4">
                    {centrosWithCoords.length} centros con coordenadas disponibles
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-left">
                      <p className="font-medium">Regiones activas:</p>
                      <ul className="text-gray-600">
                        {availableRegions.slice(0, 3).map(region => (
                          <li key={region}>• {region}</li>
                        ))}
                        {availableRegions.length > 3 && (
                          <li>• +{availableRegions.length - 3} más</li>
                        )}
                      </ul>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Inmersiones:</p>
                      <ul className="text-gray-600">
                        <li>• Total: {filteredInmersiones.length}</li>
                        <li>• Centros activos: {inmersionesPorCentro.size}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de inmersiones agrupadas por centro */}
      <div className="space-y-6">
        {Array.from(inmersionesPorCentro.entries()).map(([centroId, inmersionesCentro]) => {
          const centro = centros.find(c => c.id === centroId);
          
          return (
            <div key={centroId} className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h4 className="text-lg font-semibold">
                  {centro ? centro.nombre : 'Centro sin especificar'}
                </h4>
                {centro && (
                  <Badge variant="outline" className="text-xs">
                    {centro.region}
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {inmersionesCentro.length} inmersión{inmersionesCentro.length !== 1 ? 'es' : ''}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inmersionesCentro.map((inmersion) => (
                  <Card key={inmersion.inmersion_id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h5 className="font-semibold text-foreground">{inmersion.codigo}</h5>
                          <p className="text-sm text-muted-foreground line-clamp-2">{inmersion.objetivo}</p>
                        </div>
                        <Badge className={getStatusBadge(inmersion.estado)}>
                          {inmersion.estado.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{inmersion.buzo_principal || 'No asignado'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>Prof: {inmersion.profundidad_max}m</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => onViewDetail(inmersion)}
                        >
                          Ver Detalles
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onEdit(inmersion)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => onDelete(inmersion)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
        
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
    </div>
  );
});

InmersionesMapView.displayName = 'InmersionesMapView';
