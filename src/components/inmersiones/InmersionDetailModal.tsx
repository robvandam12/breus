
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Waves, User, Users, MapPin, Building, Thermometer, Eye, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Inmersion } from '@/types/inmersion';

interface InmersionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  inmersion: Inmersion | null;
  operacion?: any;
  getEstadoBadgeColor: (estado: string) => string;
}

export const InmersionDetailModal = ({
  isOpen,
  onClose,
  inmersion,
  operacion,
  getEstadoBadgeColor
}: InmersionDetailModalProps) => {
  if (!inmersion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              Detalle de Inmersión - {inmersion.codigo}
            </DialogTitle>
            <Badge className={getEstadoBadgeColor(inmersion.estado)}>
              {inmersion.estado.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información de la Operación */}
          {operacion && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building className="w-5 h-5 text-blue-600" />
                  Operación Asociada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Código</p>
                    <p className="text-sm">{operacion.codigo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nombre</p>
                    <p className="text-sm">{operacion.nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Estado</p>
                    <Badge variant="outline" className="text-xs">
                      {operacion.estado}
                    </Badge>
                  </div>
                </div>
                
                {(operacion.salmoneras || operacion.sitios || operacion.contratistas) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                    {operacion.salmoneras && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Salmonera</p>
                        <p className="text-sm">{operacion.salmoneras.nombre}</p>
                      </div>
                    )}
                    {operacion.sitios && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Sitio</p>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <p className="text-sm">{operacion.sitios.nombre}</p>
                        </div>
                      </div>
                    )}
                    {operacion.contratistas && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Contratista</p>
                        <p className="text-sm">{operacion.contratistas.nombre}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información General */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="w-5 h-5 text-blue-600" />
                  Información General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Código</p>
                  <p className="text-sm font-mono">{inmersion.codigo}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Objetivo</p>
                  <p className="text-sm">{inmersion.objetivo}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Fecha
                    </p>
                    <p className="text-sm">
                      {format(new Date(inmersion.fecha_inmersion), 'dd/MM/yyyy', { locale: es })}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Horario
                    </p>
                    <p className="text-sm">
                      {inmersion.hora_inicio}
                      {inmersion.hora_fin && ` - ${inmersion.hora_fin}`}
                    </p>
                  </div>
                </div>

                {inmersion.planned_bottom_time && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      Tiempo Planeado en Fondo
                    </p>
                    <p className="text-sm">{inmersion.planned_bottom_time} minutos</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Personal de Buceo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Personal de Buceo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Supervisor
                  </p>
                  <p className="text-sm">{inmersion.supervisor || 'Sin asignar'}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-gray-600">Buzo Principal</p>
                  <p className="text-sm">{inmersion.buzo_principal || 'Sin asignar'}</p>
                </div>

                {inmersion.buzo_asistente && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Buzo Asistente</p>
                    <p className="text-sm">{inmersion.buzo_asistente}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Condiciones Ambientales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-orange-600" />
                  Condiciones Ambientales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Profundidad Máxima</p>
                    <p className="text-sm font-mono">{inmersion.profundidad_max}m</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Temperatura</p>
                    <p className="text-sm font-mono">{inmersion.temperatura_agua}°C</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Visibilidad
                    </p>
                    <p className="text-sm font-mono">{inmersion.visibilidad}m</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Corriente</p>
                    <p className="text-sm capitalize">{inmersion.corriente}</p>
                  </div>
                </div>

                {inmersion.current_depth !== null && inmersion.current_depth !== undefined && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Profundidad Actual</p>
                    <p className="text-sm font-mono text-blue-600 font-bold">
                      {inmersion.current_depth}m
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Estado y Validaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  Estado y Validaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">HPT Validado</p>
                    <Badge variant={inmersion.hpt_validado ? "default" : "secondary"}>
                      {inmersion.hpt_validado ? 'Sí' : 'No'}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Anexo Bravo Validado</p>
                    <Badge variant={inmersion.anexo_bravo_validado ? "default" : "secondary"}>
                      {inmersion.anexo_bravo_validado ? 'Sí' : 'No'}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-gray-600">Fechas</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Creado: {format(new Date(inmersion.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}</p>
                    <p>Actualizado: {format(new Date(inmersion.updated_at), 'dd/MM/yyyy HH:mm', { locale: es })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Observaciones */}
          {inmersion.observaciones && (
            <Card>
              <CardHeader>
                <CardTitle>Observaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{inmersion.observaciones}</p>
              </CardContent>
            </Card>
          )}

          {/* Historial de Profundidades */}
          {inmersion.depth_history && Array.isArray(inmersion.depth_history) && inmersion.depth_history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Historial de Profundidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {inmersion.depth_history.map((entry: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                      <span className="font-mono">{entry.depth}m</span>
                      <span className="text-gray-500">
                        {format(new Date(entry.timestamp), 'dd/MM HH:mm:ss', { locale: es })}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
