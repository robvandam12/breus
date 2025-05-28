
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react";

interface OperacionTimelineProps {
  operacionId: string;
}

export const OperacionTimeline = ({ operacionId }: OperacionTimelineProps) => {
  // Mock data - En producción esto vendría de hooks
  const eventos = [
    {
      id: '1',
      tipo: 'operacion_creada',
      titulo: 'Operación Creada',
      descripcion: 'La operación fue creada exitosamente',
      fecha: '2024-01-10T10:00:00Z',
      usuario: 'Admin Sistema',
      estado: 'completado'
    },
    {
      id: '2',
      tipo: 'hpt_firmado',
      titulo: 'HPT Firmado',
      descripcion: 'El HPT ha sido firmado y aprobado',
      fecha: '2024-01-15T14:30:00Z',
      usuario: 'Carlos López',
      estado: 'completado'
    },
    {
      id: '3',
      tipo: 'anexo_pendiente',
      titulo: 'Anexo Bravo Pendiente',
      descripcion: 'El Anexo Bravo está pendiente de firma',
      fecha: '2024-01-16T09:00:00Z',
      usuario: 'Sistema',
      estado: 'pendiente'
    }
  ];

  const getEventIcon = (tipo: string, estado: string) => {
    if (estado === 'completado') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Timeline de la Operación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {eventos.map((evento, index) => (
            <div key={evento.id} className="relative">
              {index !== eventos.length - 1 && (
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
