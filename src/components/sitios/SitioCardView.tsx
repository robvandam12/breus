
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SitioDetails } from "./SitioDetails";
import { EditSitioForm } from "./EditSitioForm";
import { MapPin, Anchor, Grid3X3, Eye, Edit, Trash2 } from "lucide-react";
import type { Centro } from "@/hooks/useCentros";

interface SitioCardViewProps {
  sitios: Centro[];
  onEdit: (id: string, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const SitioCardView = ({ sitios, onEdit, onDelete }: SitioCardViewProps) => {
  const [selectedSitio, setSelectedSitio] = useState<Centro | null>(null);
  const [editingSitio, setEditingSitio] = useState<Centro | null>(null);
  const [deletingSitio, setDeletingSitio] = useState<Centro | null>(null);

  const getEstadoBadge = (estado: string) => {
    const colors = {
      'activo': 'bg-green-100 text-green-700',
      'inactivo': 'bg-gray-100 text-gray-700',
      'mantenimiento': 'bg-yellow-100 text-yellow-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const handleEdit = async (data: any) => {
    if (editingSitio) {
      await onEdit(editingSitio.id, data);
      setEditingSitio(null);
    }
  };

  const handleDelete = async () => {
    if (deletingSitio) {
      await onDelete(deletingSitio.id);
      setDeletingSitio(null);
    }
  };

  const handleEditFromDetails = () => {
    if (selectedSitio) {
      setEditingSitio(selectedSitio);
      setSelectedSitio(null);
    }
  };

  const handleDeleteFromDetails = () => {
    if (selectedSitio) {
      setDeletingSitio(selectedSitio);
      setSelectedSitio(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sitios.map((sitio) => (
          <Card key={sitio.id} className="ios-card hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{sitio.nombre}</CardTitle>
                  <p className="text-sm text-gray-500">Código: {sitio.codigo}</p>
                  <p className="text-sm text-gray-600">{sitio.salmoneras?.nombre || 'Sin asignar'}</p>
                </div>
                <Badge className={getEstadoBadge(sitio.estado)}>
                  {sitio.estado}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{sitio.ubicacion}</span>
              </div>
              
              {sitio.profundidad_maxima && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Anchor className="w-4 h-4" />
                  <span>Profundidad máxima: {sitio.profundidad_maxima}m</span>
                </div>
              )}
              
              {sitio.capacidad_jaulas && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Grid3X3 className="w-4 h-4" />
                  <span>Capacidad: {sitio.capacidad_jaulas} jaulas</span>
                </div>
              )}

              {sitio.coordenadas_lat && sitio.coordenadas_lng && (
                <div className="text-xs text-gray-500">
                  Lat: {sitio.coordenadas_lat.toFixed(6)}, Lng: {sitio.coordenadas_lng.toFixed(6)}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSitio(sitio)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingSitio(sitio)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletingSitio(sitio)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Dialog */}
      <Dialog open={!!selectedSitio} onOpenChange={() => setSelectedSitio(null)}>
        <DialogContent className="max-w-4xl">
          {selectedSitio && (
            <SitioDetails
              sitio={selectedSitio}
              onClose={() => setSelectedSitio(null)}
              onEdit={handleEditFromDetails}
              onDelete={handleDeleteFromDetails}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingSitio} onOpenChange={() => setEditingSitio(null)}>
        <DialogContent className="max-w-2xl">
          {editingSitio && (
            <EditSitioForm
              sitio={editingSitio}
              onSubmit={handleEdit}
              onCancel={() => setEditingSitio(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deletingSitio}
        onOpenChange={() => setDeletingSitio(null)}
        title="Eliminar Centro"
        description={`¿Está seguro de que desea eliminar el centro "${deletingSitio?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  );
};
