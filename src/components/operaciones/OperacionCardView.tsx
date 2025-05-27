
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Building, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Operacion } from "@/hooks/useOperaciones";

interface OperacionCardViewProps {
  operaciones: Operacion[];
  onSelect: (operacion: Operacion) => void;
  onEdit: (operacion: Operacion) => void;
}

export const OperacionCardView = ({ operaciones, onSelect, onEdit }: OperacionCardViewProps) => {
  const getStatusBadge = (estado: string) => {
    const colors = {
      'activa': 'bg-green-100 text-green-700',
      'pausada': 'bg-yellow-100 text-yellow-700',
      'completada': 'bg-blue-100 text-blue-700',
      'cancelada': 'bg-red-100 text-red-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  if (operaciones.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay operaciones registradas</h3>
        <p className="text-zinc-500">Las operaciones aparecerán aquí una vez creadas</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {operaciones.map((operacion) => (
        <Card key={operacion.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">{operacion.nombre}</CardTitle>
                <p className="text-sm text-zinc-500">{operacion.codigo}</p>
              </div>
              <Badge variant="outline" className={getStatusBadge(operacion.estado)}>
                {operacion.estado}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <MapPin className="w-4 h-4" />
              <span>{operacion.sitios?.nombre || 'Sin sitio asignado'}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <Building className="w-4 h-4" />
              <span>{operacion.salmoneras?.nombre || 'Sin salmonera asignada'}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <Users className="w-4 h-4" />
              <span>{operacion.contratistas?.nombre || 'Sin contratista asignado'}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <Calendar className="w-4 h-4" />
              <span>{new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}</span>
            </div>

            {operacion.tareas && (
              <p className="text-xs text-zinc-600 line-clamp-2">{operacion.tareas}</p>
            )}

            <div className="flex gap-2 pt-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onSelect(operacion)}
                className="flex-1"
              >
                Ver Detalles
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
