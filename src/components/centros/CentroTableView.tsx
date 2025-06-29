
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MapPin, Eye } from "lucide-react";
import { Centro, CentroFormData } from '@/hooks/useCentros';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CreateCentroFormAnimated } from './CreateCentroFormAnimated';

interface CentroTableViewProps {
  centros: Centro[];
  onEdit: (id: string, data: CentroFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const CentroTableView = ({ centros, onEdit, onDelete }: CentroTableViewProps) => {
  const [editingCentro, setEditingCentro] = useState<Centro | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEdit = (centro: Centro) => {
    setEditingCentro(centro);
    setShowEditDialog(true);
  };

  const handleEditSubmit = async (data: CentroFormData) => {
    if (editingCentro) {
      await onEdit(editingCentro.id, data);
      setShowEditDialog(false);
      setEditingCentro(null);
    }
  };

  const handleDelete = async (centro: Centro) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el centro "${centro.nombre}"?`)) {
      await onDelete(centro.id);
    }
  };

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activo':
        return 'default';
      case 'inactivo':
        return 'secondary';
      case 'mantenimiento':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-200/50 overflow-hidden bg-white/80 backdrop-blur-sm">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow className="hover:bg-gray-50/50">
              <TableHead className="font-semibold text-gray-700">Centro</TableHead>
              <TableHead className="font-semibold text-gray-700">Salmonera</TableHead>
              <TableHead className="font-semibold text-gray-700">Ubicación</TableHead>
              <TableHead className="font-semibold text-gray-700">Estado</TableHead>
              <TableHead className="font-semibold text-gray-700">Características</TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {centros.map((centro) => (
              <TableRow key={centro.id} className="hover:bg-blue-50/30 transition-colors">
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{centro.nombre}</div>
                    <div className="text-sm text-gray-500">Código: {centro.codigo}</div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700">
                  {centro.salmoneras?.nombre || 'Sin asignar'}
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-1">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm">{centro.ubicacion}</div>
                      <div className="text-xs text-gray-500">{centro.region}</div>
                      {centro.coordenadas_lat && centro.coordenadas_lng && (
                        <div className="text-xs text-blue-600">
                          {centro.coordenadas_lat.toFixed(4)}, {centro.coordenadas_lng.toFixed(4)}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getEstadoBadgeVariant(centro.estado)}>
                    {centro.estado.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm space-y-1">
                    {centro.profundidad_maxima && (
                      <div>Prof. máx: {centro.profundidad_maxima}m</div>
                    )}
                    {centro.capacidad_jaulas && (
                      <div>Jaulas: {centro.capacidad_jaulas}</div>
                    )}
                    {!centro.profundidad_maxima && !centro.capacidad_jaulas && (
                      <div className="text-gray-400">Sin especificar</div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(centro)}
                      className="h-8 w-8 p-0 hover:bg-orange-100"
                    >
                      <Edit className="h-4 w-4 text-orange-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(centro)}
                      className="h-8 w-8 p-0 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de edición */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {editingCentro && (
            <CreateCentroFormAnimated
              onSubmit={handleEditSubmit}
              onCancel={() => setShowEditDialog(false)}
              initialData={editingCentro}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
