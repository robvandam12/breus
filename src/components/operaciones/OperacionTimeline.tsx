
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, AlertCircle, Calendar, FileText, Users, Activity, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface OperacionTimelineProps {
  operacionId: string;
}

interface TimelineEvent {
  id: string;
  tipo: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  usuario: string;
  estado: 'completado' | 'pendiente' | 'error';
  metadata?: any;
}

export const OperacionTimeline = ({ operacionId }: OperacionTimelineProps) => {
  const [eventos, setEventos] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('todos');

  useEffect(() => {
    fetchTimelineEvents();
  }, [operacionId]);

  const fetchTimelineEvents = async () => {
    try {
      setIsLoading(true);
      
      // Obtener eventos de dominio relacionados con la operación
      const { data: domainEvents, error: domainError } = await supabase
        .from('domain_event')
        .select('*')
        .or(`aggregate_id.eq.${operacionId},event_data->>operacion_id.eq.${operacionId}`)
        .order('created_at', { ascending: false });

      if (domainError) throw domainError;

      // Obtener actividades de usuario relacionadas
      const { data: userActivities, error: activityError } = await supabase
        .from('usuario_actividad')
        .select(`
          *,
          usuario:usuario_id (nombre, apellido)
        `)
        .eq('entidad_id', operacionId)
        .order('created_at', { ascending: false });

      if (activityError) throw activityError;

      // Combinar y formatear eventos
      const formattedEvents: TimelineEvent[] = [];

      // Agregar eventos de dominio
      domainEvents?.forEach(event => {
        formattedEvents.push({
          id: event.id,
          tipo: event.event_type,
          titulo: getEventTitle(event.event_type),
          descripcion: getEventDescription(event.event_type, event.event_data),
          fecha: event.created_at,
          usuario: 'Sistema',
          estado: 'completado',
          metadata: event.event_data
        });
      });

      // Agregar actividades de usuario
      userActivities?.forEach(activity => {
        formattedEvents.push({
          id: activity.id,
          tipo: 'user_activity',
          titulo: `Actividad: ${activity.accion}`,
          descripcion: activity.detalle || `${activity.accion} realizada`,
          fecha: activity.created_at,
          usuario: activity.usuario ? `${activity.usuario.nombre} ${activity.usuario.apellido}` : 'Usuario desconocido',
          estado: 'completado'
        });
      });

      // Ordenar por fecha descendente
      formattedEvents.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

      setEventos(formattedEvents);
    } catch (error) {
      console.error('Error fetching timeline events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEventTitle = (eventType: string): string => {
    const titles: Record<string, string> = {
      'HPT_DONE': 'HPT Firmado',
      'ANEXO_DONE': 'Anexo Bravo Firmado',
      'IMM_CREATED': 'Inmersión Creada',
      'OPERACION_CREATED': 'Operación Creada',
      'TEAM_ASSIGNED': 'Equipo Asignado',
      'DOCUMENT_SIGNED': 'Documento Firmado'
    };
    return titles[eventType] || eventType.replace('_', ' ');
  };

  const getEventDescription = (eventType: string, eventData: any): string => {
    switch (eventType) {
      case 'HPT_DONE':
        return `HPT ${eventData?.codigo || ''} ha sido firmado por ${eventData?.supervisor || 'supervisor'}`;
      case 'ANEXO_DONE':
        return `Anexo Bravo ${eventData?.codigo || ''} ha sido firmado por ${eventData?.supervisor || 'supervisor'}`;
      case 'IMM_CREATED':
        return `Nueva inmersión ${eventData?.codigo || ''} creada con buzo principal ${eventData?.buzo_principal || ''}`;
      default:
        return 'Evento del sistema';
    }
  };

  const getEventIcon = (tipo: string, estado: string) => {
    if (estado === 'completado') {
      switch (tipo) {
        case 'HPT_DONE':
        case 'ANEXO_DONE':
          return <FileText className="w-5 h-5 text-green-600" />;
        case 'IMM_CREATED':
          return <Activity className="w-5 h-5 text-blue-600" />;
        case 'TEAM_ASSIGNED':
          return <Users className="w-5 h-5 text-purple-600" />;
        default:
          return <CheckCircle className="w-5 h-5 text-green-600" />;
      }
    } else if (estado === 'pendiente') {
      return <Clock className="w-5 h-5 text-yellow-600" />;
    } else {
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getEventColor = (estado: string) => {
    switch (estado) {
      case 'completado':
        return 'border-green-200 bg-green-50';
      case 'pendiente':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-red-200 bg-red-50';
    }
  };

  const filteredEventos = eventos.filter(evento => {
    if (filter === 'todos') return true;
    if (filter === 'documentos') return evento.tipo.includes('HPT') || evento.tipo.includes('ANEXO');
    if (filter === 'inmersiones') return evento.tipo.includes('IMM');
    if (filter === 'equipo') return evento.tipo.includes('TEAM');
    return true;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Timeline de la Operación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 ml-4">Cargando historial...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Timeline de la Operación
            <Badge variant="outline">{filteredEventos.length} eventos</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="todos">Todos</option>
              <option value="documentos">Documentos</option>
              <option value="inmersiones">Inmersiones</option>
              <option value="equipo">Equipo</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredEventos.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500 mb-2">No hay eventos en el historial</p>
            <p className="text-sm text-zinc-400">Los eventos aparecerán aquí conforme se realicen actividades</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEventos.map((evento, index) => (
              <div key={evento.id} className="relative">
                {index !== filteredEventos.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-px bg-zinc-200" />
                )}
                <div className={`flex gap-4 p-4 rounded-lg border-2 ${getEventColor(evento.estado)}`}>
                  <div className="flex-shrink-0">
                    {getEventIcon(evento.tipo, evento.estado)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-zinc-900">{evento.titulo}</h4>
                      <Badge variant="outline" className="text-xs">
                        {evento.estado}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-600 mb-2">{evento.descripcion}</p>
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span>{new Date(evento.fecha).toLocaleString('es-CL')}</span>
                      <span>Por: {evento.usuario}</span>
                    </div>
                    {evento.metadata && Object.keys(evento.metadata).length > 0 && (
                      <div className="mt-2 p-2 bg-white rounded border text-xs">
                        <details>
                          <summary className="cursor-pointer text-zinc-600 hover:text-zinc-800">
                            Ver detalles
                          </summary>
                          <pre className="mt-1 text-zinc-500 overflow-auto">
                            {JSON.stringify(evento.metadata, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 flex justify-center">
          <Button 
            variant="outline" 
            onClick={fetchTimelineEvents}
            className="text-sm"
          >
            Actualizar Historial
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
