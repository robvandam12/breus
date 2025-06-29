import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Anchor, Eye, Edit, Trash2 } from "lucide-react";
import type { Centro } from "@/hooks/useCentros";

interface SitioDetailsProps {
  sitio: Centro;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const SitioDetails = ({ sitio, onEdit, onDelete, onClose }: SitioDetailsProps) => {
  const getStatusBadge = (estado: string) => {
    const colors = {
      'activo': 'bg-green-100 text-green-700',
      'inactivo': 'bg-gray-100 text-gray-700',
      'mantenimiento': 'bg-yellow-100 text-yellow-700'
    };
    return colors[estado as keyof typeof colors] || colors.activo;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onClose}>
            ← Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{sitio.nombre}</h1>
            <p className="text-zinc-500">{sitio.codigo}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusBadge(sitio.estado)}>
            {sitio.estado}
          </Badge>
          <Button variant="outline" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" onClick={onDelete} className="text-red-600">
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building className="w-5 h-5 text-blue-600" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-zinc-600">Salmonera</p>
              <p className="text-zinc-900">{sitio.salmoneras?.nombre || 'No asignada'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-600">Código</p>
              <p className="text-zinc-900">{sitio.codigo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-600">Estado</p>
              <Badge className={getStatusBadge(sitio.estado)}>
                {sitio.estado}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5 text-green-600" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-zinc-600">Ubicación</p>
              <p className="text-zinc-900">{sitio.ubicacion}</p>
            </div>
            {sitio.coordenadas_lat && sitio.coordenadas_lng && (
              <div>
                <p className="text-sm font-medium text-zinc-600">Coordenadas</p>
                <p className="text-zinc-900 text-sm">
                  {sitio.coordenadas_lat}, {sitio.coordenadas_lng}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Anchor className="w-5 h-5 text-purple-600" />
              Características
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sitio.profundidad_maxima && (
              <div>
                <p className="text-sm font-medium text-zinc-600">Profundidad Máxima</p>
                <p className="text-zinc-900">{sitio.profundidad_maxima} m</p>
              </div>
            )}
            {sitio.capacidad_jaulas && (
              <div>
                <p className="text-sm font-medium text-zinc-600">Capacidad de Jaulas</p>
                <p className="text-zinc-900">{sitio.capacidad_jaulas}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {sitio.observaciones && (
        <Card>
          <CardHeader>
            <CardTitle>Observaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-700">{sitio.observaciones}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
