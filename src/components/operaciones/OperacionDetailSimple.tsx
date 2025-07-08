import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, FileText, Settings, Eye } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface OperacionDetailSimpleProps {
  operacion: any;
  onClose: () => void;
}

export const OperacionDetailSimple: React.FC<OperacionDetailSimpleProps> = ({
  operacion,
  onClose
}) => {
  const getStatusBadgeColor = (estado: string) => {
    switch (estado) {
      case 'activa': return 'bg-green-100 text-green-800';
      case 'completada': return 'bg-blue-100 text-blue-800';
      case 'pausada': return 'bg-yellow-100 text-yellow-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{operacion.nombre}</h2>
          <p className="text-gray-600 mt-1">Código: {operacion.codigo}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusBadgeColor(operacion.estado)}>
            {operacion.estado}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Cerrar
          </Button>
        </div>
      </div>

      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Fecha de Inicio</label>
              <p className="text-gray-900">
                {format(new Date(operacion.fecha_inicio), 'dd/MM/yyyy', { locale: es })}
              </p>
            </div>
            
            {operacion.fecha_fin && (
              <div>
                <label className="text-sm font-medium text-gray-700">Fecha de Fin</label>
                <p className="text-gray-900">
                  {format(new Date(operacion.fecha_fin), 'dd/MM/yyyy', { locale: es })}
                </p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-gray-700">Estado</label>
              <p className="text-gray-900">{operacion.estado}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Descripción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-900">
              {operacion.tareas || 'Sin descripción disponible'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Documentos requeridos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documentos de Planificación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-medium">HPT (Hoja de Planificación)</h4>
                  <p className="text-sm text-gray-600">Documento de seguridad</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Requerido
                </Badge>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-medium">Anexo Bravo</h4>
                  <p className="text-sm text-gray-600">Checklist operacional</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Requerido
                </Badge>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de tiempo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Cronología
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Creado</span>
              <span className="text-sm font-medium">
                {format(new Date(operacion.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Última actualización</span>
              <span className="text-sm font-medium">
                {format(new Date(operacion.updated_at), 'dd/MM/yyyy HH:mm', { locale: es })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};