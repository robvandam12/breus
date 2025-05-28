
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, MapPin, Building, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";

interface OperacionCardProps {
  operacion: any;
  onView?: (operacion: any) => void;
  onEdit?: (operacion: any) => void;
  onDelete?: (operacion: any) => void;
}

export const OperacionCard = ({ operacion, onView, onEdit, onDelete }: OperacionCardProps) => {
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activa':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'completada':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pausada':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelada':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No definida';
    try {
      return new Date(dateString).toLocaleDateString('es-CL');
    } catch {
      return 'Fecha inválida';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{operacion.nombre}</h3>
                <Badge variant="outline" className="text-xs">
                  {operacion.codigo}
                </Badge>
              </div>
              <Badge className={`${getStatusColor(operacion.estado)} text-xs`}>
                {operacion.estado?.charAt(0).toUpperCase() + operacion.estado?.slice(1)}
              </Badge>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView?.(operacion)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(operacion)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(operacion)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Details */}
          <div className="space-y-2">
            {operacion.salmonera && (
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Building className="w-4 h-4" />
                <span>{operacion.salmonera.nombre}</span>
              </div>
            )}
            
            {operacion.sitio && (
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <MapPin className="w-4 h-4" />
                <span>{operacion.sitio.nombre}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(operacion.fecha_inicio)}
                {operacion.fecha_fin && ` - ${formatDate(operacion.fecha_fin)}`}
              </span>
            </div>

            {operacion.contratista && (
              <div className="text-sm text-zinc-600">
                <span className="font-medium">Contratista: </span>
                <span>{operacion.contratista.nombre}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {operacion.tareas && (
            <p className="text-sm text-zinc-600 line-clamp-2">
              {operacion.tareas}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onView?.(operacion)}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Detalle
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit?.(operacion)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
