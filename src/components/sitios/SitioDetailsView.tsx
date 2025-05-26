
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Building } from "lucide-react";

interface SitioDetailsViewProps {
  sitio: any;
  onBack: () => void;
  onEdit: () => void;
}

export const SitioDetailsView = ({ sitio, onBack, onEdit }: SitioDetailsViewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{sitio.nombre}</h1>
              <p className="text-zinc-500">{sitio.codigo}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={onEdit} variant="outline">
            Editar Sitio
          </Button>
          <Badge variant={sitio.estado === 'activo' ? 'default' : 'secondary'}>
            {sitio.estado}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-600">Ubicación</label>
              <p className="text-zinc-900">{sitio.ubicacion}</p>
            </div>
            
            {sitio.coordenadas_lat && sitio.coordenadas_lng && (
              <div>
                <label className="text-sm font-medium text-zinc-600">Coordenadas</label>
                <p className="text-zinc-900">
                  {sitio.coordenadas_lat.toFixed(6)}, {sitio.coordenadas_lng.toFixed(6)}
                </p>
              </div>
            )}

            {sitio.observaciones && (
              <div>
                <label className="text-sm font-medium text-zinc-600">Observaciones</label>
                <p className="text-zinc-900">{sitio.observaciones}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {sitio.coordenadas_lat && sitio.coordenadas_lng && (
          <Card>
            <CardHeader>
              <CardTitle>Ubicación en Mapa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 bg-zinc-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                  <p className="text-sm text-zinc-600">Mapa del sitio</p>
                  <p className="text-xs text-zinc-500">
                    {sitio.coordenadas_lat.toFixed(4)}, {sitio.coordenadas_lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
