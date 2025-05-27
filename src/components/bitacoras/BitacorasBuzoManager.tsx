
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { BitacoraBuzo } from "@/hooks/useBitacorasBuzo";

interface BitacorasBuzoManagerProps {
  bitacoras: BitacoraBuzo[];
}

export const BitacorasBuzoManager = ({ bitacoras }: BitacorasBuzoManagerProps) => {
  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'aprobada':
        return 'default';
      case 'pendiente':
        return 'secondary';
      case 'rechazada':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'aprobada':
        return CheckCircle;
      case 'pendiente':
        return Clock;
      case 'rechazada':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {bitacoras.length}
          </div>
          <div className="text-sm text-gray-500">Total Bitácoras</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {bitacoras.filter(b => b.estado_aprobacion === 'aprobada').length}
          </div>
          <div className="text-sm text-gray-500">Aprobadas</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-orange-600">
            {bitacoras.filter(b => b.estado_aprobacion === 'pendiente').length}
          </div>
          <div className="text-sm text-gray-500">Pendientes</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">
            {bitacoras.filter(b => b.firmado).length}
          </div>
          <div className="text-sm text-gray-500">Firmadas</div>
        </Card>
      </div>

      {/* Bitacoras List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bitacoras.map((bitacora) => {
          const EstadoIcon = getEstadoIcon(bitacora.estado_aprobacion);
          
          return (
            <Card key={bitacora.bitacora_id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Book className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{bitacora.codigo}</CardTitle>
                      <p className="text-sm text-gray-600">{bitacora.buzo}</p>
                    </div>
                  </div>
                  <Badge variant={getEstadoBadgeVariant(bitacora.estado_aprobacion)}>
                    <EstadoIcon className="w-3 h-3 mr-1" />
                    {bitacora.estado_aprobacion}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Fecha</span>
                    <span className="font-medium">{new Date(bitacora.fecha).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profundidad</span>
                    <span className="font-medium">{bitacora.profundidad_maxima}m</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estado Físico</span>
                    <Badge variant="outline">{bitacora.estado_fisico_post}</Badge>
                  </div>

                  {bitacora.trabajos_realizados && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Trabajos:</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{bitacora.trabajos_realizados}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-600">Firmada</span>
                    <Badge variant={bitacora.firmado ? "default" : "secondary"}>
                      {bitacora.firmado ? "Sí" : "No"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {bitacoras.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Book className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay bitácoras de buzo</h3>
            <p className="text-gray-500">Comience creando la primera bitácora de buzo</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
