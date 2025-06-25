
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Edit, FileText } from "lucide-react";

interface Inmersion {
  inmersion_id: string;
  objetivo?: string;
  codigo?: string;
  estado: string;
  observaciones?: string;
  operacion_id?: string;
  is_independent?: boolean;
  fecha_inmersion?: string;
  operacion?: {
    nombre: string;
  };
}

interface InmersionesListProps {
  inmersiones: Inmersion[];
  getStatusBadge: (estado: string) => JSX.Element;
}

export const InmersionesList: React.FC<InmersionesListProps> = ({
  inmersiones,
  getStatusBadge
}) => {
  if (inmersiones.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay inmersiones registradas
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {inmersiones.map((inmersion) => (
        <div key={inmersion.inmersion_id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold">
                {inmersion.objetivo || inmersion.codigo || `Inmersión ${inmersion.inmersion_id?.slice(0, 8)}`}
              </h3>
              {getStatusBadge(inmersion.estado)}
              
              {/* Indicadores de tipo */}
              {inmersion.operacion_id && !inmersion.is_independent && (
                <Badge variant="outline" className="text-blue-600 border-blue-300">
                  <Calendar className="w-3 h-3 mr-1" />
                  Planificada
                </Badge>
              )}
              
              {(!inmersion.operacion_id || inmersion.is_independent) && (
                <Badge variant="outline" className="text-purple-600 border-purple-300">
                  Independiente
                </Badge>
              )}
            </div>
            
            <div className="text-sm text-gray-600 space-y-1">
              {inmersion.observaciones && (
                <p>{inmersion.observaciones}</p>
              )}
              
              {inmersion.operacion && (
                <p className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Operación: {inmersion.operacion.nombre}
                </p>
              )}
              
              <p>Fecha: {inmersion.fecha_inmersion ? new Date(inmersion.fecha_inmersion).toLocaleDateString() : 'No programada'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <FileText className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
