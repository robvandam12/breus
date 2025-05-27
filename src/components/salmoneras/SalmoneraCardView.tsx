
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EditSalmoneraForm } from "./EditSalmoneraForm";
import { Building, MapPin, Phone, Mail, Eye, Edit, Trash2 } from "lucide-react";
import { Salmonera } from "@/hooks/useSalmoneras";

interface SalmoneraCardViewProps {
  salmoneras: Salmonera[];
  onEdit: (id: string, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSelect: (salmonera: Salmonera) => void;
}

export const SalmoneraCardView = ({ salmoneras, onEdit, onDelete, onSelect }: SalmoneraCardViewProps) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {salmoneras.map((salmonera) => (
          <Card key={salmonera.id} className="ios-card hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{salmonera.nombre}</CardTitle>
                    <p className="text-sm text-gray-500">{salmonera.rut}</p>
                  </div>
                </div>
                <Badge className={getEstadoBadge(salmonera.estado)}>
                  {salmonera.estado}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{salmonera.direccion}</span>
              </div>
              
              {salmonera.telefono && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{salmonera.telefono}</span>
                </div>
              )}
              
              {salmonera.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{salmonera.email}</span>
                </div>
              )}

              <div className="pt-2 border-t">
                <p className="text-sm text-gray-500">
                  {salmonera.sitios_activos} sitios activos
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelect(salmonera)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver
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
            </CardContent>
          </Card>
        ))}
      </div>

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
