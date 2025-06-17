
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface OperacionMapaProps {
  operacion: {
    sitio?: {
      coordenadas_lat?: number;
      coordenadas_lng?: number;
      nombre?: string;
    };
  };
}

export const OperacionMapa = ({ operacion }: OperacionMapaProps) => {
  const sitio = operacion.sitio;
  
  if (!sitio?.coordenadas_lat || !sitio?.coordenadas_lng) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Ubicación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Coordenadas no disponibles</p>
              <p className="text-sm text-gray-400 mt-1">
                {sitio?.nombre || 'Sitio sin nombre'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Usar un zoom mucho más alejado (±0.25) para mostrar mucho más contexto geográfico
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${sitio.coordenadas_lng - 0.25},${sitio.coordenadas_lat - 0.25},${sitio.coordenadas_lng + 0.25},${sitio.coordenadas_lat + 0.25}&layer=mapnik&marker=${sitio.coordenadas_lat},${sitio.coordenadas_lng}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Ubicación - {sitio.nombre}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-64 bg-gray-50 rounded-lg overflow-hidden">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            title={`Mapa de ${sitio.nombre}`}
            className="border-0"
          />
          <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded shadow text-xs">
            {sitio.coordenadas_lat.toFixed(6)}, {sitio.coordenadas_lng.toFixed(6)}
          </div>
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded shadow text-xs font-medium">
            Vista Regional Amplia
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
