
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MapPin, Waves } from "lucide-react";
import type { Centro } from "@/hooks/useCentros";

interface CentroCardViewProps {
  centros: Centro[];
  onEdit: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

export const CentroCardView = ({ centros, onEdit, onDelete }: CentroCardViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {centros.map((centro) => (
        <Card key={centro.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Waves className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">{centro.nombre}</h3>
              </div>
              <Badge 
                variant="outline" 
                className={
                  centro.estado === 'activo' 
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-gray-100 text-gray-700 border-gray-200'
                }
              >
                {centro.estado}
              </Badge>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Código:</span>
                <span className="font-mono">{centro.codigo}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{centro.ubicacion}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Región:</span>
                <span>{centro.region}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="text-lg font-bold text-blue-600">
                  {centro.capacidad_jaulas || 0}
                </div>
                <div className="text-xs text-blue-600">Jaulas</div>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <div className="text-lg font-bold text-purple-600">
                  {centro.profundidad_maxima || 0}m
                </div>
                <div className="text-xs text-purple-600">Prof. Máx</div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(centro.id, centro)}>
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onDelete(centro.id)}
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
