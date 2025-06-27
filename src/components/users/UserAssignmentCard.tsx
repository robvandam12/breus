
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin, Anchor } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface UserAssignmentCardProps {
  title: string;
  assignments: any[];
  type: 'inmersion' | 'cuadrilla';
}

export const UserAssignmentCard = ({ title, assignments, type }: UserAssignmentCardProps) => {
  if (!assignments || assignments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Sin asignaciones activas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {type === 'inmersion' ? <Anchor className="w-4 h-4" /> : <Users className="w-4 h-4" />}
          {title}
          <Badge variant="secondary" className="text-xs">
            {assignments.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {assignments.slice(0, 3).map((assignment, index) => (
          <div key={index} className="flex items-start justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex-1">
              {type === 'inmersion' ? (
                <div>
                  <p className="font-medium text-sm">{assignment.codigo}</p>
                  <p className="text-xs text-gray-600 truncate">{assignment.objetivo}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(assignment.fecha_inmersion), 'dd/MM', { locale: es })}
                    </div>
                    <Badge 
                      variant={assignment.estado === 'completada' ? 'default' : 'secondary'} 
                      className="text-xs"
                    >
                      {assignment.estado}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="font-medium text-sm">{assignment.cuadrillas_buceo?.nombre}</p>
                  <p className="text-xs text-gray-600">{assignment.rol_equipo}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    Desde {format(new Date(assignment.created_at), 'dd/MM/yyyy', { locale: es })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {assignments.length > 3 && (
          <p className="text-xs text-gray-500 text-center pt-2">
            +{assignments.length - 3} más
          </p>
        )}
      </CardContent>
    </Card>
  );
};
