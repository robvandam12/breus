
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Users, Calendar, CheckCircle, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface OperacionTimelineProps {
  operacionId: string;
}

export const OperacionTimeline = ({ operacionId }: OperacionTimelineProps) => {
  const { data: actividades = [], isLoading } = useQuery({
    queryKey: ['operacion-timeline', operacionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuario_actividad')
        .select(`
          *,
          usuario:usuario_id (
            nombre,
            apellido
          )
        `)
        .eq('entidad_id', operacionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const { data: domainEvents = [] } = useQuery({
    queryKey: ['domain-events', operacionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domain_event')
        .select('*')
        .eq('aggregate_id', operacionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const getEventIcon = (accion: string) => {
    const iconMap: Record<string, any> = {
      'CREAR_OPERACION': Calendar,
      'EDITAR_OPERACION': FileText,
      'ASIGNAR_EQUIPO': Users,
      'REMOVER_EQUIPO': Users,
      'HPT_DONE': CheckCircle,
      'ANEXO_DONE': CheckCircle,
      'IMM_CREATED': FileText,
    };
    return iconMap[accion] || AlertCircle;
  };

  const getEventColor = (accion: string) => {
    const colorMap: Record<string, string> = {
      'CREAR_OPERACION': 'bg-blue-100 text-blue-700',
      'EDITAR_OPERACION': 'bg-yellow-100 text-yellow-700',
      'ASIGNAR_EQUIPO': 'bg-green-100 text-green-700',
      'REMOVER_EQUIPO': 'bg-red-100 text-red-700',
      'HPT_DONE': 'bg-green-100 text-green-700',
      'ANEXO_DONE': 'bg-green-100 text-green-700',
      'IMM_CREATED': 'bg-purple-100 text-purple-700',
    };
    return colorMap[accion] || 'bg-gray-100 text-gray-700';
  };

  const getEventLabel = (accion: string) => {
    const labelMap: Record<string, string> = {
      'CREAR_OPERACION': 'Operación Creada',
      'EDITAR_OPERACION': 'Operación Editada',
      'ASIGNAR_EQUIPO': 'Equipo Asignado',
      'REMOVER_EQUIPO': 'Equipo Removido',
      'HPT_DONE': 'HPT Completado',
      'ANEXO_DONE': 'Anexo Bravo Completado',
      'IMM_CREATED': 'Inmersión Creada',
    };
    return labelMap[accion] || accion;
  };

  // Combinar actividades y eventos del dominio
  const allEvents = [
    ...actividades.map(act => ({
      ...act,
      type: 'activity',
      timestamp: act.created_at,
      titulo: getEventLabel(act.accion),
      descripcion: act.detalle
    })),
    ...domainEvents.map(event => ({
      ...event,
      type: 'domain_event',
      timestamp: event.created_at,
      titulo: getEventLabel(event.event_type),
      descripcion: `Evento del sistema: ${event.event_type}`,
      accion: event.event_type
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Historial de la Operación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center text-gray-500">
              Cargando historial...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Historial de la Operación
          <Badge variant="outline" className="ml-2">
            {allEvents.length} eventos
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {allEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No hay actividad registrada</h3>
            <p className="text-sm">Las actividades aparecerán aquí cuando se realicen cambios</p>
          </div>
        ) : (
          <div className="space-y-4">
            {allEvents.map((event, index) => {
              const IconComponent = getEventIcon(event.accion);
              
              return (
                <div key={`${event.type}-${event.id}-${index}`} className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${getEventColor(event.accion)}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{event.titulo}</h4>
                      <time className="text-sm text-gray-500">
                        {new Date(event.timestamp).toLocaleString('es-CL')}
                      </time>
                    </div>
                    
                    {event.descripcion && (
                      <p className="text-sm text-gray-600 mt-1">{event.descripcion}</p>
                    )}
                    
                    {event.type === 'activity' && event.usuario && (
                      <p className="text-xs text-gray-500 mt-1">
                        Por: {event.usuario.nombre} {event.usuario.apellido}
                      </p>
                    )}
                    
                    <Badge 
                      variant="outline" 
                      className={`mt-2 text-xs ${getEventColor(event.accion)}`}
                    >
                      {event.type === 'activity' ? 'Actividad de Usuario' : 'Evento del Sistema'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
