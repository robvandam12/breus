
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Edit, Trash2, Building, Waves } from "lucide-react";
import { Centro, CentroFormData } from '@/hooks/useCentros';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CreateCentroFormAnimated } from './CreateCentroFormAnimated';

interface CentroCardViewProps {
  centros: Centro[];
  onEdit: (id: string, data: CentroFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const CentroCardView = ({ centros, onEdit, onDelete }: CentroCardViewProps) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {centros.map((centro) => (
          <Card key={centro.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">{centro.nombre}</CardTitle>
                </div>
                <Badge variant={getEstadoBadgeVariant(centro.estado)}>
                  {centro.estado}
                </Badge>
              </div>
              <div className="text-sm text-gray-500">
                Código: {centro.codigo}
              </div>
            </CardContent>
            
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Salmonera</div>
                <div className="text-sm text-gray-600">
                  {centro.salmoneras?.nombre || 'Sin asignar'}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Ubicación
                </div>
                <div className="text-sm text-gray-600">
                  <div>{centro.ubicacion}</div>
                  <div className="text-xs text-gray-500">{centro.region}</div>
                  {centro.coordenadas_lat && centro.coordenadas_lng && (
                    <div className="text-xs text-blue-600 mt-1">
                      {centro.coordenadas_lat.toFixed(4)}, {centro.coordenadas_lng.toFixed(4)}
                    </div>
                  )}
                </div>
              </div>

              {(centro.profundidad_maxima || centro.capacidad_jaulas) && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Waves className="w-4 h-4" />
                    Características
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    {centro.profundidad_maxima && (
                      <div>Profundidad máxima: {centro.profundidad_maxima}m</div>
                    )}
                    {centro.capacidad_jaulas && (
                      <div>Capacidad: {centro.capacidad_jaulas} jaulas</div>
                    )}
                  </div>
                </div>
              )}

              {centro.observaciones && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Observaciones</div>
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {centro.observaciones}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(centro)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(centro)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
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
