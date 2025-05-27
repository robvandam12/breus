
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Anchor, Edit, Trash2, Play, CheckCircle } from "lucide-react";
import { Inmersion } from "@/hooks/useInmersiones";

interface InmersionesManagerProps {
  inmersiones: Inmersion[];
}

export const InmersionesManager = ({ inmersiones }: InmersionesManagerProps) => {
  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'completada':
        return 'default';
      case 'en_progreso':
        return 'secondary';
      case 'planificada':
        return 'outline';
      case 'cancelada':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'completada':
        return CheckCircle;
      case 'en_progreso':
        return Play;
      default:
        return Anchor;
    }
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {inmersiones.length}
          </div>
          <div className="text-sm text-gray-500">Total Inmersiones</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {inmersiones.filter(i => i.estado === 'completada').length}
          </div>
          <div className="text-sm text-gray-500">Completadas</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-orange-600">
            {inmersiones.filter(i => i.estado === 'en_progreso').length}
          </div>
          <div className="text-sm text-gray-500">En Progreso</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">
            {inmersiones.filter(i => i.estado === 'planificada').length}
          </div>
          <div className="text-sm text-gray-500">Planificadas</div>
        </Card>
      </div>

      {/* Inmersiones List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inmersiones.map((inmersion) => {
          const EstadoIcon = getEstadoIcon(inmersion.estado);
          
          return (
            <Card key={inmersion.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Anchor className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{inmersion.codigo}</CardTitle>
                      <p className="text-sm text-gray-600">{inmersion.operacion_nombre}</p>
                    </div>
                  </div>
                  <Badge variant={getEstadoBadgeVariant(inmersion.estado)}>
                    <EstadoIcon className="w-3 h-3 mr-1" />
                    {inmersion.estado}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Fecha</span>
                    <span className="font-medium">{new Date(inmersion.fecha_inmersion).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Hora</span>
                    <span className="font-medium">{inmersion.hora_inicio}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profundidad</span>
                    <span className="font-medium">{inmersion.profundidad_maxima}m</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Buzo Principal</span>
                    <span className="font-medium text-xs">{inmersion.buzo_principal}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Supervisor</span>
                    <span className="font-medium text-xs">{inmersion.supervisor}</span>
                  </div>

                  {inmersion.objetivo && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Objetivo:</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{inmersion.objetivo}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {inmersiones.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Anchor className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay inmersiones</h3>
            <p className="text-gray-500">Comience creando la primera inmersión</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
