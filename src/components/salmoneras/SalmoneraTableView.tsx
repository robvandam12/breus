
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EditSalmoneraForm } from "./EditSalmoneraForm";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Salmonera } from "@/hooks/useSalmoneras";

interface SalmoneraTableViewProps {
  salmoneras: Salmonera[];
  onEdit: (id: string, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSelect: (salmonera: Salmonera) => void;
}

export const SalmoneraTableView = ({ salmoneras, onEdit, onDelete, onSelect }: SalmoneraTableViewProps) => {
  const [editingSalmonera, setEditingSalmonera] = useState<Salmonera | null>(null);
  const [deletingSalmonera, setDeletingSalmonera] = useState<Salmonera | null>(null);

  const getEstadoBadge = (estado: string) => {
    const colors = {
      'activa': 'bg-green-100 text-green-700',
      'inactiva': 'bg-gray-100 text-gray-700',
      'suspendida': 'bg-red-100 text-red-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const handleEdit = async (data: any) => {
    if (editingSalmonera) {
      await onEdit(editingSalmonera.id, data);
      setEditingSalmonera(null);
    }
  };

  const handleDelete = async () => {
    if (deletingSalmonera) {
      await onDelete(deletingSalmonera.id);
      setDeletingSalmonera(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>RUT</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salmoneras.map((salmonera) => (
            <TableRow key={salmonera.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{salmonera.nombre}</div>
                  <div className="text-sm text-gray-500">{salmonera.sitios_activos} sitios activos</div>
                </div>
              </TableCell>
              <TableCell>{salmonera.rut}</TableCell>
              <TableCell className="max-w-xs truncate">{salmonera.direccion}</TableCell>
              <TableCell>
                <div className="text-sm">
                  {salmonera.email && <div>{salmonera.email}</div>}
                  {salmonera.telefono && <div>{salmonera.telefono}</div>}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getEstadoBadge(salmonera.estado)}>
                  {salmonera.estado}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelect(salmonera)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingSalmonera(salmonera)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingSalmonera(salmonera)}
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

      {/* Edit Dialog */}
      <Dialog open={!!editingSalmonera} onOpenChange={() => setEditingSalmonera(null)}>
        <DialogContent className="max-w-2xl">
          {editingSalmonera && (
            <EditSalmoneraForm
              salmonera={editingSalmonera}
              onSubmit={handleEdit}
              onCancel={() => setEditingSalmonera(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deletingSalmonera}
        onOpenChange={() => setDeletingSalmonera(null)}
        title="Eliminar Salmonera"
        description={`¿Está seguro de que desea eliminar la salmonera "${deletingSalmonera?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  );
};
