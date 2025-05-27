
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Building, Clock, Eye, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface OperacionCardProps {
  operacion: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export const OperacionCard: React.FC<OperacionCardProps> = ({
  operacion,
  onEdit,
  onDelete,
  onView
}) => {
  const getEstadoBadge = (estado: string) => {
    const colors = {
      'activa': 'bg-green-100 text-green-700 border-green-200',
      'completada': 'bg-blue-100 text-blue-700 border-blue-200',
      'pausada': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'cancelada': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-zinc-900 mb-1">
              {operacion.nombre}
            </h3>
            <p className="text-sm text-zinc-500 font-mono">
              {operacion.codigo}
            </p>
          </div>
          <Badge className={getEstadoBadge(operacion.estado)}>
            {operacion.estado}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Calendar className="w-4 h-4" />
            <span>
              {format(new Date(operacion.fecha_inicio), "dd/MM/yyyy", { locale: es })}
              {operacion.fecha_fin && ` - ${format(new Date(operacion.fecha_fin), "dd/MM/yyyy", { locale: es })}`}
            </span>
          </div>
          
          {operacion.sitios && (
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <MapPin className="w-4 h-4" />
              <span>{operacion.sitios.nombre}</span>
            </div>
          )}
          
          {(operacion.salmoneras || operacion.contratistas) && (
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <Building className="w-4 h-4" />
              <span>{operacion.salmoneras?.nombre || operacion.contratistas?.nombre}</span>
            </div>
          )}
          
          {operacion.equipo_buceo_id && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Clock className="w-4 h-4" />
              <span>Equipo asignado</span>
            </div>
          )}
        </div>

        {operacion.tareas && (
          <p className="text-sm text-zinc-600 line-clamp-2">
            {operacion.tareas}
          </p>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(operacion.id)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            Ver
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(operacion.id)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(operacion.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
