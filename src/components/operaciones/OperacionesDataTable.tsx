
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Operacion } from '@/hooks/useOperacionesQuery';

interface OperacionesDataTableProps {
  operaciones: Operacion[];
  isLoading: boolean;
  enterpriseContext?: any;
}

export const OperacionesDataTable = ({ operaciones, isLoading, enterpriseContext }: OperacionesDataTableProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (operaciones.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          📋
        </div>
        <h3 className="text-lg font-medium mb-2">No hay operaciones</h3>
        <p className="text-sm">
          Comience creando su primera operación de buceo
        </p>
      </div>
    );
  }

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'activa': 'default',
      'completada': 'secondary',
      'cancelada': 'destructive',
      'pausada': 'outline'
    } as const;
    
    return (
      <Badge variant={variants[estado as keyof typeof variants] || 'outline'}>
        {estado}
      </Badge>
    );
  };

  const getAprobacionBadge = (estado?: string) => {
    if (!estado) return null;
    
    const variants = {
      'pendiente': 'outline',
      'aprobada': 'default',
      'rechazada': 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[estado as keyof typeof variants] || 'outline'} className="text-xs">
        {estado}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {operaciones.map((operacion) => (
        <Card key={operacion.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="font-medium text-lg">
                  {operacion.codigo} - {operacion.nombre}
                </h3>
                {getEstadoBadge(operacion.estado)}
                {getAprobacionBadge(operacion.estado_aprobacion)}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>📅 {operacion.fecha_inicio}</span>
                {operacion.fecha_fin && <span>🏁 {operacion.fecha_fin}</span>}
                {operacion.centros?.nombre && <span>🏢 {operacion.centros.nombre}</span>}
                {operacion.usuario_supervisor && (
                  <span>👤 {operacion.usuario_supervisor.nombre} {operacion.usuario_supervisor.apellido}</span>
                )}
              </div>
              
              {operacion.tareas && (
                <p className="text-sm text-gray-700 line-clamp-2">
                  {operacion.tareas}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
