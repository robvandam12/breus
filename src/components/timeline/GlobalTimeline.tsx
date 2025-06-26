
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarInitials } from '@/components/ui/avatar-initials';
import { Anchor, Calendar, Users, FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TimelineEvent {
  id: string;
  type: 'inmersion_created' | 'inmersion_completed' | 'bitacora_created' | 'operacion_created' | 'hpt_signed' | 'anexo_signed';
  title: string;
  description: string;
  timestamp: string;
  user_name: string;
  user_role: string;
  metadata: any;
  icon: React.ElementType;
  color: string;
}

interface GlobalTimelineProps {
  companyFilter?: string;
  userFilter?: string;
  className?: string;
}

export const GlobalTimeline = ({ companyFilter, userFilter, className = "" }: GlobalTimelineProps) => {
  const { profile } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState<string>(companyFilter || '');
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  // Determinar el alcance de visibilidad según el rol
  const getVisibilityScope = () => {
    if (profile?.role === 'superuser') {
      return {
        canSelectCompany: true,
        scope: 'all_companies',
        description: 'Ver actividad de cualquier empresa'
      };
    }
    
    if (profile?.role === 'admin_salmonera') {
      return {
        canSelectCompany: false,
        scope: 'salmonera_and_contractors',
        description: 'Actividad de tu salmonera y contratistas asociados'
      };
    }
    
    if (profile?.role === 'admin_servicio') {
      return {
        canSelectCompany: false,
        scope: 'contratista_team',
        description: 'Actividad de todo tu equipo de contratista'
      };
    }
    
    if (profile?.role === 'supervisor') {
      return {
        canSelectCompany: false,
        scope: 'supervised_operations',
        description: 'Operaciones e inmersiones que supervisas'
      };
    }
    
    // Buzo
    return {
      canSelectCompany: false,
      scope: 'own_activities',
      description: 'Solo tus inmersiones y bitácoras'
    };
  };

  const visibilityScope = getVisibilityScope();

  // Obtener eventos del timeline según el alcance
  const { data: timelineEvents = [], isLoading } = useQuery({
    queryKey: ['global-timeline', profile?.id, selectedCompany, timeRange, visibilityScope.scope],
    queryFn: async () => {
      if (!profile) return [];

      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case 'day':
          startDate.setDate(endDate.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
      }

      const events: TimelineEvent[] = [];

      // Obtener inmersiones según el alcance
      let inmersionQuery = supabase
        .from('inmersion')
        .select(`
          inmersion_id,
          codigo,
          estado,
          fecha_inmersion,
          supervisor,
          buzo_principal,
          created_at,
          updated_at,
          supervisor_id,
          buzo_principal_id,
          operacion:operacion_id(
            nombre,
            salmonera:salmonera_id(nombre),
            contratista:contratista_id(nombre)
          )
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      // Aplicar filtros según el rol
      switch (visibilityScope.scope) {
        case 'own_activities':
          inmersionQuery = inmersionQuery.or(`supervisor_id.eq.${profile.id},buzo_principal_id.eq.${profile.id}`);
          break;
        case 'supervised_operations':
          inmersionQuery = inmersionQuery.eq('supervisor_id', profile.id);
          break;
        case 'contratista_team':
          if (profile.servicio_id) {
            inmersionQuery = inmersionQuery.eq('empresa_creadora_id', profile.servicio_id);
          }
          break;
        case 'salmonera_and_contractors':
          if (profile.salmonera_id) {
            // TODO: Filtrar por salmonera y sus contratistas asociados
          }
          break;
        case 'all_companies':
          if (selectedCompany) {
            inmersionQuery = inmersionQuery.eq('empresa_creadora_id', selectedCompany);
          }
          break;
      }

      const { data: inmersiones } = await inmersionQuery;

      // Procesar inmersiones para eventos
      inmersiones?.forEach(inmersion => {
        // Evento de creación
        events.push({
          id: `inmersion_created_${inmersion.inmersion_id}`,
          type: 'inmersion_created',
          title: 'Inmersión Creada',
          description: `${inmersion.codigo} - ${inmersion.supervisor}`,
          timestamp: inmersion.created_at,
          user_name: inmersion.supervisor,
          user_role: 'Supervisor',
          metadata: inmersion,
          icon: Anchor,
          color: 'bg-blue-500'
        });

        // Evento de completado si aplica
        if (inmersion.estado === 'completada' && inmersion.updated_at !== inmersion.created_at) {
          events.push({
            id: `inmersion_completed_${inmersion.inmersion_id}`,
            type: 'inmersion_completed',
            title: 'Inmersión Completada',
            description: `${inmersion.codigo} finalizada`,
            timestamp: inmersion.updated_at,
            user_name: inmersion.supervisor,
            user_role: 'Supervisor',
            metadata: inmersion,
            icon: CheckCircle,
            color: 'bg-green-500'
          });
        }
      });

      // Obtener bitácoras según el alcance
      let bitacoraQuery = supabase
        .from('bitacora_supervisor')
        .select(`
          bitacora_id,
          codigo,
          supervisor,
          created_at,
          firmado,
          inmersion:inmersion_id(codigo, operacion:operacion_id(nombre))
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      const { data: bitacoras } = await bitacoraQuery;

      bitacoras?.forEach(bitacora => {
        events.push({
          id: `bitacora_${bitacora.bitacora_id}`,
          type: 'bitacora_created',
          title: bitacora.firmado ? 'Bitácora Firmada' : 'Bitácora Creada',
          description: `${bitacora.codigo} - ${bitacora.supervisor}`,
          timestamp: bitacora.created_at,
          user_name: bitacora.supervisor,
          user_role: 'Supervisor',
          metadata: bitacora,
          icon: FileText,
          color: bitacora.firmado ? 'bg-green-500' : 'bg-yellow-500'
        });
      });

      // Ordenar eventos por timestamp
      return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },
    enabled: !!profile,
  });

  // Obtener empresas disponibles para superuser
  const { data: availableCompanies = [] } = useQuery({
    queryKey: ['available-companies-timeline'],
    queryFn: async () => {
      const companies = [];
      
      const { data: salmoneras } = await supabase
        .from('salmoneras')
        .select('id, nombre')
        .eq('estado', 'activa');
      
      const { data: contratistas } = await supabase
        .from('contratistas')
        .select('id, nombre')
        .eq('estado', 'activo');

      if (salmoneras) {
        companies.push(...salmoneras.map(s => ({ id: s.id, nombre: s.nombre, tipo: 'salmonera' })));
      }
      
      if (contratistas) {
        companies.push(...contratistas.map(c => ({ id: c.id, nombre: c.nombre, tipo: 'contratista' })));
      }

      return companies;
    },
    enabled: visibilityScope.canSelectCompany,
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return format(date, 'HH:mm', { locale: es });
    } else {
      return format(date, 'dd MMM, HH:mm', { locale: es });
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Timeline de Actividad
            </CardTitle>
            <p className="text-sm text-muted-foreground">{visibilityScope.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {visibilityScope.canSelectCompany && (
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Seleccionar empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las empresas</SelectItem>
                  {availableCompanies.map(company => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.nombre} ({company.tipo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={timeRange} onValueChange={(value: 'day' | 'week' | 'month') => setTimeRange(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Último día</SelectItem>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : timelineEvents.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold">Sin actividad</h3>
            <p>No hay actividad en el período seleccionado</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {timelineEvents.map((event) => {
              const IconComponent = event.icon;
              return (
                <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`p-2 rounded-full ${event.color} text-white shrink-0`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm">{event.title}</h4>
                      <span className="text-xs text-muted-foreground">{formatTimestamp(event.timestamp)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          <AvatarInitials name={event.user_name} />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {event.user_name} ({event.user_role})
                      </span>
                    </div>
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
