
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Calendar, Clock, MapPin, FileText, Users } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Operacion {
  id: string;
  codigo: string;
  nombre: string;
  estado: 'activa' | 'pausada' | 'completada' | 'cancelada';
  fecha_inicio: string;
  fecha_fin?: string;
  tareas?: string;
  created_at: string;
  updated_at: string;
}

interface OperacionCardViewProps {
  operaciones: Operacion[];
  onSelect?: (operacion: Operacion) => void;
  onEdit?: (operacion: Operacion) => void;
  onViewDetail?: (operacion: Operacion) => void;
  onDelete?: (operacionId: string) => void;
}

export const OperacionCardView = ({ 
  operaciones, 
  onSelect,
  onEdit,
  onViewDetail,
  onDelete
}: OperacionCardViewProps) => {
  const getStatusConfig = (estado: string) => {
    const configs = {
      activa: { 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: '🟢',
        label: 'Activa'
      },
      pausada: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: '⏸️',
        label: 'Pausada'
      },
      completada: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: '✅',
        label: 'Completada'
      },
      cancelada: { 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: '❌',
        label: 'Cancelada'
      },
    };
    
    return configs[estado as keyof typeof configs] || configs.activa;
  };

  const calculateDuration = (fechaInicio: string, fechaFin?: string) => {
    const inicio = new Date(fechaInicio);
    const fin = fechaFin ? new Date(fechaFin) : new Date();
    const diffTime = Math.abs(fin.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (operaciones.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay operaciones registradas
        </h3>
        <p className="text-gray-600 mb-4">
          Cuando crees operaciones de buceo, aparecerán aquí organizadas en tarjetas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {operaciones.map((operacion) => {
        const statusConfig = getStatusConfig(operacion.estado);
        const duration = calculateDuration(operacion.fecha_inicio, operacion.fecha_fin);
        
        return (
          <Card 
            key={operacion.id} 
            className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => onSelect?.(operacion)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                      {operacion.codigo}
                    </code>
                    <Badge className={`text-xs ${statusConfig.color}`}>
                      {statusConfig.icon} {statusConfig.label}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {operacion.nombre}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Descripción de tareas */}
              {operacion.tareas && (
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {operacion.tareas}
                  </p>
                </div>
              )}

              {/* Fechas */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Inicio:</span>
                  <span className="font-medium">
                    {format(new Date(operacion.fecha_inicio), 'dd MMM yyyy', { locale: es })}
                  </span>
                </div>
                
                {operacion.fecha_fin ? (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Fin:</span>
                    <span className="font-medium">
                      {format(new Date(operacion.fecha_fin), 'dd MMM yyyy', { locale: es })}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Fin:</span>
                    <span className="text-gray-400 italic">Sin definir</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Duración:</span>
                  <span className="font-medium">
                    {duration} {duration === 1 ? 'día' : 'días'}
                  </span>
                </div>
              </div>

              {/* Metadatos adicionales */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Creada: {format(new Date(operacion.created_at), 'dd/MM/yy', { locale: es })}
                  </span>
                  <span>
                    Actualizada: {format(new Date(operacion.updated_at), 'dd/MM/yy', { locale: es })}
                  </span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetail?.(operacion);
                  }}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(operacion);
                  }}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(operacion.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
