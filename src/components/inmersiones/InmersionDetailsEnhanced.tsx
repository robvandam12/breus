
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Anchor, 
  Calendar, 
  Clock, 
  Target, 
  Gauge, 
  Thermometer, 
  Eye, 
  Waves, 
  User, 
  Users,
  ArrowLeft,
  Bell,
  CheckCircle
} from "lucide-react";
import { ValidationStatusCard } from "./ValidationStatusCard";
import { InmersionTeamManagerEnhanced } from "./InmersionTeamManagerEnhanced";
import { useInmersionTeamManager } from "@/hooks/useInmersionTeamManager";

interface InmersionDetailsEnhancedProps {
  inmersion: any;
  onBack: () => void;
  onStatusChange: () => void;
}

export const InmersionDetailsEnhanced: React.FC<InmersionDetailsEnhancedProps> = ({
  inmersion,
  onBack,
  onStatusChange
}) => {
  const { teamMembers } = useInmersionTeamManager(inmersion.inmersion_id);

  const getStatusColor = (estado: string) => {
    const colors = {
      'planificada': 'bg-blue-100 text-blue-700',
      'en_curso': 'bg-green-100 text-green-700',
      'completada': 'bg-gray-100 text-gray-700',
      'cancelada': 'bg-red-100 text-red-700',
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const formatTime = (time: string) => {
    if (!time) return 'No especificado';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: string) => {
    if (!date) return 'No especificado';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEstimatedEndTime = () => {
    if (inmersion.estimated_end_time) {
      return new Date(inmersion.estimated_end_time).toLocaleString('es-ES');
    }
    return 'No calculado';
  };

  const isOverdue = () => {
    if (!inmersion.estimated_end_time || inmersion.estado !== 'en_curso') return false;
    return new Date(inmersion.estimated_end_time) < new Date();
  };

  const getNotificationStatus = () => {
    const status = inmersion.notification_status || {};
    return {
      supervisorNotified: status.supervisor_notified || false,
      teamNotified: status.team_notified || false,
      upcomingEndNotified: status.upcoming_end_notified || false
    };
  };

  const notificationStatus = getNotificationStatus();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Anchor className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{inmersion.codigo}</h1>
            <p className="text-gray-600">
              {inmersion.operacion?.nombre || 'Inmersión Independiente'}
            </p>
          </div>
        </div>
        
        <div className="flex-1" />
        
        <Badge className={getStatusColor(inmersion.estado)}>
          {inmersion.estado?.toUpperCase()}
        </Badge>

        {isOverdue() && (
          <Badge variant="destructive" className="animate-pulse">
            RETRASADA
          </Badge>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Anchor className="w-5 h-5 text-blue-600" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-semibold">{formatDate(inmersion.fecha_inmersion)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Hora Inicio</p>
                    <p className="font-semibold">{formatTime(inmersion.hora_inicio)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Hora Fin</p>
                    <p className="font-semibold">{formatTime(inmersion.hora_fin) || 'No especificado'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Fin Estimado</p>
                    <p className="font-semibold text-sm">{getEstimatedEndTime()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Gauge className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Profundidad Máxima</p>
                    <p className="font-semibold">{inmersion.profundidad_max}m</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Tiempo Planificado</p>
                    <p className="font-semibold">{inmersion.planned_bottom_time || 'No especificado'} min</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Objetivo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Objetivo de la Inmersión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{inmersion.objetivo}</p>
            </CardContent>
          </Card>

          {/* Condiciones Ambientales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="w-5 h-5 text-blue-600" />
                Condiciones Ambientales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Thermometer className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Temperatura</p>
                    <p className="font-semibold">{inmersion.temperatura_agua}°C</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Visibilidad</p>
                    <p className="font-semibold">{inmersion.visibilidad}m</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Waves className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Corriente</p>
                    <p className="font-semibold">{inmersion.corriente}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Gauge className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Profundidad</p>
                    <p className="font-semibold">{inmersion.current_depth || 0}m actual</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipo de Inmersión */}
          <InmersionTeamManagerEnhanced
            inmersionId={inmersion.inmersion_id}
            inmersion={{
              supervisor: inmersion.supervisor,
              buzo_principal: inmersion.buzo_principal,
              buzo_asistente: inmersion.buzo_asistente
            }}
          />

          {/* Observaciones */}
          {inmersion.observaciones && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Observaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{inmersion.observaciones}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {/* Estado de Validaciones */}
          <ValidationStatusCard
            operacionId={inmersion.operacion_id}
            inmersionId={inmersion.inmersion_id}
            currentStatus={inmersion.estado}
            onStatusChange={onStatusChange}
          />

          {/* Estado de Notificaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Estado de Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Supervisor Notificado</span>
                <div className="flex items-center gap-2">
                  {notificationStatus.supervisorNotified ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <div className="w-4 h-4 border border-gray-300 rounded-full" />
                  )}
                  <Badge variant={notificationStatus.supervisorNotified ? "default" : "outline"}>
                    {notificationStatus.supervisorNotified ? "Sí" : "No"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Equipo Notificado</span>
                <div className="flex items-center gap-2">
                  {notificationStatus.teamNotified ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <div className="w-4 h-4 border border-gray-300 rounded-full" />
                  )}
                  <Badge variant={notificationStatus.teamNotified ? "default" : "outline"}>
                    {notificationStatus.teamNotified ? "Sí" : "No"}
                  </Badge>
                </div>
              </div>

              {teamMembers.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    {teamMembers.length} miembros en el equipo
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información del Contexto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Contexto Operativo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Tipo</span>
                <Badge variant="outline">
                  {inmersion.contexto_operativo || 'Planificada'}
                </Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Requiere Validación</span>
                <Badge variant={inmersion.requiere_validacion_previa ? "default" : "outline"}>
                  {inmersion.requiere_validacion_previa ? "Sí" : "No"}
                </Badge>
              </div>
              
              {inmersion.is_independent && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Independiente</span>
                  <Badge variant="outline">Sí</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
