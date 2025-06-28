
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Building, User, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { OperacionConRelaciones } from "@/hooks/useOperacionesQuery";

interface OperacionCardProps {
  operacion: OperacionConRelaciones;
  onEdit?: (operacion: OperacionConRelaciones) => void;
  onDelete?: (id: string) => void;
}

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case 'activa':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pausada':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'completada':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'cancelada':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const OperacionCard = ({ operacion, onEdit, onDelete }: OperacionCardProps) => {
  const fechaInicio = format(new Date(operacion.fecha_inicio), 'dd MMM yyyy', { locale: es });
  const fechaFin = operacion.fecha_fin ? format(new Date(operacion.fecha_fin), 'dd MMM yyyy', { locale: es }) : null;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{operacion.nombre}</CardTitle>
            <p className="text-sm text-gray-500 font-mono">{operacion.codigo}</p>
          </div>
          <Badge variant="outline" className={getEstadoColor(operacion.estado)}>
            {operacion.estado}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Información básica */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="w-4 h-4 text-gray-500" />
            <span>
              {fechaInicio} {fechaFin && `- ${fechaFin}`}
            </span>
          </div>

          {operacion.salmoneras && (
            <div className="flex items-center gap-2 text-sm">
              <Building className="w-4 h-4 text-blue-500" />
              <span>{operacion.salmoneras.nombre}</span>
            </div>
          )}

          {operacion.centros && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-green-500" />
              <span>{operacion.centros.nombre}</span>
            </div>
          )}

          {operacion.contratistas && (
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-purple-500" />
              <span>{operacion.contratistas.nombre}</span>
            </div>
          )}
        </div>

        {/* Tareas */}
        {operacion.tareas && (
          <div className="pt-2 border-t">
            <p className="text-sm text-gray-600 line-clamp-2">
              {operacion.tareas}
            </p>
          </div>
        )}

        {/* Acciones */}
        {(onEdit || onDelete) && (
          <div className="flex gap-2 pt-2 border-t">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(operacion)}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(operacion.id)}
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Eliminar
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
