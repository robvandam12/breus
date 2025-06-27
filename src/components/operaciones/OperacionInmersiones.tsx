
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, MapPin, Users, Anchor } from 'lucide-react';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useEquiposBuceoEnhanced } from '@/hooks/useEquiposBuceoEnhanced';

interface OperacionInmersionesProps {
  operacion: any;
  onViewInmersion?: (inmersionId: string) => void;
}

export const OperacionInmersiones: React.FC<OperacionInmersionesProps> = ({
  operacion,
  onViewInmersion
}) => {
  const { inmersiones, isLoading } = useInmersiones();
  const { equipos } = useEquiposBuceoEnhanced();

  const operacionInmersiones = inmersiones.filter(
    inmersion => inmersion.operacion_id === operacion.id
  );

  // Since operations no longer have direct team assignments, we'll show available teams
  const availableTeams = equipos || [];

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'completada': return 'bg-green-100 text-green-800';
      case 'en_progreso': return 'bg-blue-100 text-blue-800';
      case 'planificada': return 'bg-yellow-100 text-yellow-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Cargando inmersiones...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Información del equipo de buceo */}
      {availableTeams.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Equipos de Buceo Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {availableTeams.map((equipo) => (
                <div key={equipo.id} className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{equipo.nombre}</h4>
                      <p className="text-sm text-gray-600">{equipo.descripcion}</p>
                    </div>
                    <Badge variant="outline">
                      disponible
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {equipo.miembros?.map((miembro: any, idx: number) => {
                      const nombreCompleto = miembro.usuario ? 
                        `${miembro.usuario.nombre} ${miembro.usuario.apellido}` : 
                        `Miembro ${idx + 1}`;
                      
                      return (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {nombreCompleto} - {miembro.rol_equipo}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de inmersiones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Anchor className="h-5 w-5" />
            Inmersiones de la Operación ({operacionInmersiones.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {operacionInmersiones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Anchor className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No hay inmersiones registradas para esta operación.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {operacionInmersiones.map((inmersion) => (
                <div
                  key={inmersion.inmersion_id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{inmersion.codigo}</h4>
                        <Badge className={getEstadoBadgeColor(inmersion.estado)}>
                          {inmersion.estado}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(inmersion.fecha_inmersion).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          Profundidad: {inmersion.profundidad_max}m
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <strong>Supervisor:</strong> {inmersion.supervisor}
                      </div>
                      <div className="text-sm">
                        <strong>Buzo Principal:</strong> {inmersion.buzo_principal}
                      </div>
                      {inmersion.buzo_asistente && (
                        <div className="text-sm">
                          <strong>Buzo Asistente:</strong> {inmersion.buzo_asistente}
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-600">
                        <strong>Objetivo:</strong> {inmersion.objetivo}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {onViewInmersion && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewInmersion(inmersion.inmersion_id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
