
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, FileText, Users, Anchor, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { ActivityEvent } from '@/hooks/useUserActivity';

interface UserTimelineItemProps {
  event: ActivityEvent;
}

export const UserTimelineItem = ({ event }: UserTimelineItemProps) => {
  const getIcon = () => {
    switch (event.type) {
      case 'inmersion':
        return <Anchor className="w-4 h-4" />;
      case 'bitacora':
        return <FileText className="w-4 h-4" />;
      case 'documento':
        return <FileText className="w-4 h-4" />;
      case 'cuadrilla':
        return <Users className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (event.status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (event.status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'cancelled':
        return <XCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getTypeLabel = () => {
    if (event.type === 'inmersion') {
      switch (event.subtype) {
        case 'supervisor':
          return 'Supervisión';
        case 'buzo_principal':
          return 'Buzo Principal';
        case 'buzo_asistente':
          return 'Buzo Asistente';
        default:
          return 'Inmersión';
      }
    }
    if (event.type === 'bitacora') {
      return event.subtype === 'buzo' ? 'Bitácora Buzo' : 'Bitácora Supervisor';
    }
    if (event.type === 'documento') {
      return event.subtype === 'hpt' ? 'HPT' : 'Anexo Bravo';
    }
    return 'Actividad';
  };

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 truncate">
                  {event.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {event.description}
                </p>
                
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {getTypeLabel()}
                  </Badge>
                  <Badge className={`text-xs ${getStatusColor()}`}>
                    {getStatusIcon()}
                    <span className="ml-1">
                      {event.status === 'completed' ? 'Completado' :
                       event.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                    </span>
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {format(new Date(event.date), 'dd/MM/yyyy', { locale: es })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
