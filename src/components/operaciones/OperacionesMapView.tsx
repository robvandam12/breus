
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";

export const OperacionesMapView = () => {
  const { operaciones, isLoading } = useOperaciones();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Mapa de Operaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl border-2 border-dashed border-zinc-300 dark:from-blue-900/20 dark:to-green-900/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2">
                <MapPin className="w-12 h-12 text-blue-600 mx-auto" />
                <h3 className="text-lg font-medium text-zinc-900 mb-2">Vista de Mapa</h3>
                <p className="text-zinc-500">
                  Aquí se mostrará un mapa interactivo con las ubicaciones de todas las operaciones activas
                </p>
                <p className="text-sm text-zinc-400">
                  Funcionalidad en desarrollo - Se integrará con Mapbox
                </p>
              </div>
            </div>
            
            {/* Simulated markers for active operations */}
            {operaciones.slice(0, 3).map((operacion, index) => (
              <div
                key={operacion.id}
                className={`absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg animate-bounce cursor-pointer`}
                style={{
                  left: `${30 + index * 20}%`,
                  top: `${40 + index * 10}%`,
                  animationDelay: `${index * 0.2}s`
                }}
                title={operacion.nombre}
              >
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {operaciones.map((operacion) => (
          <Card key={operacion.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-sm">{operacion.nombre}</h3>
                <Badge variant={operacion.estado === 'activa' ? 'default' : 'secondary'}>
                  {operacion.estado}
                </Badge>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{operacion.sitio_nombre || 'Sitio no asignado'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{operacion.contratista_nombre || 'Contratista no asignado'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
