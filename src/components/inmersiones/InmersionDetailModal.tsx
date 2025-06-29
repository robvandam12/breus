
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, FileText, Clock, Waves } from "lucide-react";
import type { Inmersion } from '@/hooks/useInmersiones';

interface InmersionDetailModalProps {
  inmersion: Inmersion;
  isOpen: boolean;
  onClose: () => void;
}

export const InmersionDetailModal = ({ inmersion, isOpen, onClose }: InmersionDetailModalProps) => {
  const getStatusBadge = (estado: string) => {
    const colors = {
      'planificada': 'bg-blue-100 text-blue-800 border-blue-200',
      'en_progreso': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'completada': 'bg-green-100 text-green-800 border-green-200',
      'cancelada': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[estado as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  const formatDateTime = (date?: string, time?: string) => {
    if (!date) return 'No definido';
    const dateStr = new Date(date).toLocaleDateString('es-CL');
    return time ? `${dateStr} ${time}` : dateStr;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{inmersion.codigo}</span>
            <Badge className={getStatusBadge(inmersion.estado)}>
              {inmersion.estado.replace('_', ' ')}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Objetivo</label>
                <p className="text-gray-900">{inmersion.objetivo}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Operación</label>
                <p className="text-gray-900">
                  {inmersion.operacion?.nombre || inmersion.operacion_nombre || 'Inmersión Independiente'}
                </p>
              </div>

              {inmersion.external_operation_code && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Código Operación Externa</label>
                  <p className="text-gray-900">{inmersion.external_operation_code}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600">Tipo</label>
                <p className="text-gray-900">
                  {inmersion.is_independent ? 'Independiente' : 'Planificada'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Detalles de Buceo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="w-5 h-5" />
                Detalles de Buceo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Profundidad Máxima</label>
                <p className="text-gray-900">{inmersion.profundidad_max}m</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Buzo Principal</label>
                <p className="text-gray-900">{inmersion.buzo_principal || 'No asignado'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Supervisor</label>
                <p className="text-gray-900">{inmersion.supervisor || 'No asignado'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Programación */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Programación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha de Inmersión</label>
                <p className="text-gray-900">{formatDateTime(inmersion.fecha_inmersion)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Hora de Inicio</label>
                <p className="text-gray-900">{inmersion.hora_inicio || 'No definida'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Hora de Fin</label>
                <p className="text-gray-900">{inmersion.hora_fin || 'No definida'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Observaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Observaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900">
                {inmersion.observaciones || 'Sin observaciones registradas'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Información Adicional */}
        <Card>
          <CardHeader>
            <CardTitle>Información Adicional</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {inmersion.hpt_validado ? '✓' : '✗'}
              </div>
              <div className="text-sm text-gray-600">HPT Validado</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {inmersion.anexo_bravo_validado ? '✓' : '✗'}
              </div>
              <div className="text-sm text-gray-600">Anexo Bravo</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {inmersion.requiere_validacion_previa ? '⚠' : '✓'}
              </div>
              <div className="text-sm text-gray-600">Validación Previa</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {inmersion.is_independent ? 'I' : 'P'}
              </div>
              <div className="text-sm text-gray-600">
                {inmersion.is_independent ? 'Independiente' : 'Planificada'}
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
