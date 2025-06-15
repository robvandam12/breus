
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, Eye } from "lucide-react";
import type { Inmersion } from "@/types/inmersion";

interface OperacionInfo {
  id: string;
  nombre: string;
}

interface InmersionCardProps {
  inmersion: Inmersion;
  operacion?: OperacionInfo;
  getEstadoBadgeColor: (estado: string) => string;
  onView: (inmersion: Inmersion) => void;
}

const InmersionCard: React.FC<InmersionCardProps> = ({ inmersion, operacion, getEstadoBadgeColor, onView }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{inmersion.codigo}</CardTitle>
          <Badge className={getEstadoBadgeColor(inmersion.estado)}>
            {inmersion.estado}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {operacion && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{operacion.nombre}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{new Date(inmersion.fecha_inmersion).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>{inmersion.buzo_principal}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{inmersion.hora_inicio} - {inmersion.hora_fin || 'En curso'}</span>
        </div>
        <div className="text-sm text-gray-600">
          <p><strong>Supervisor:</strong> {inmersion.supervisor}</p>
          <p><strong>Profundidad:</strong> {inmersion.profundidad_max}m</p>
        </div>
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(inmersion)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(InmersionCard);
