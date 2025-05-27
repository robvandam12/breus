
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Ruler, Layers } from "lucide-react";
import { Sitio } from "@/hooks/useSitios";

interface SitioDetailsModalProps {
  sitio: Sitio | null;
  open: boolean;
  onClose: () => void;
}

export const SitioDetailsModal = ({ sitio, open, onClose }: SitioDetailsModalProps) => {
  if (!sitio) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Detalles del Sitio
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{sitio.nombre}</h2>
              <p className="text-gray-600">Código: {sitio.codigo}</p>
            </div>
            <Badge 
              variant="outline" 
              className={sitio.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
            >
              {sitio.estado}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Salmonera</p>
                  <p className="font-medium">{sitio.salmoneras?.nombre || 'No asignada'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Ubicación</p>
                  <p className="font-medium">{sitio.ubicacion}</p>
                </div>
              </div>

              {sitio.profundidad_maxima && (
                <div className="flex items-center gap-3">
                  <Ruler className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Profundidad Máxima</p>
                    <p className="font-medium">{sitio.profundidad_maxima} m</p>
                  </div>
                </div>
              )}

              {sitio.capacidad_jaulas && (
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Capacidad de Jaulas</p>
                    <p className="font-medium">{sitio.capacidad_jaulas}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {sitio.coordenadas_lat && sitio.coordenadas_lng && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Coordenadas</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm">Latitud: {sitio.coordenadas_lat.toFixed(6)}</p>
                    <p className="text-sm">Longitud: {sitio.coordenadas_lng.toFixed(6)}</p>
                  </div>
                </div>
              )}

              {sitio.observaciones && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Observaciones</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm">{sitio.observaciones}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-xs text-gray-500 border-t pt-4">
            <p>Creado: {new Date(sitio.created_at).toLocaleDateString('es-CL')}</p>
            <p>Actualizado: {new Date(sitio.updated_at).toLocaleDateString('es-CL')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
