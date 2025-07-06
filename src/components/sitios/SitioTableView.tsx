
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SitioDetails } from "./SitioDetails";
import { EditSitioForm } from "./EditSitioForm";
import { Eye, Edit, Trash2, MapPin } from "lucide-react";
import type { Centro } from "@/hooks/useCentros";

interface SitioTableViewProps {
  sitios: Centro[];
  onEdit: (id: string, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const SitioTableView = ({ sitios, onEdit, onDelete }: SitioTableViewProps) => {
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Centro</TableHead>
            <TableHead>Salmonera</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Características</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sitios.map((sitio) => (
            <TableRow key={sitio.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{sitio.nombre}</div>
                  <div className="text-sm text-gray-500">Código: {sitio.codigo}</div>
                </div>
              </TableCell>
               <TableCell>
                 {sitio.salmoneras?.[0]?.nombre || 'Sin asignar'}
               </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="truncate max-w-32">{sitio.ubicacion}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {sitio.profundidad_maxima && (
                    <div>Prof. máx: {sitio.profundidad_maxima}m</div>
                  )}
                  {sitio.capacidad_jaulas && (
                    <div>Jaulas: {sitio.capacidad_jaulas}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getEstadoBadge(sitio.estado)}>
                  {sitio.estado}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSitio(sitio)}
                  >
                    <Eye className="w-4 h-4" />
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
