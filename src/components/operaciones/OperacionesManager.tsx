
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, Calendar, AlertTriangle } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { EditOperacionForm } from "./EditOperacionForm";
import OperacionDetailModal from "./OperacionDetailModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OperacionesKPIs } from "./OperacionesKPIs";
import { OperacionesTable } from "./OperacionesTable";

export const OperacionesManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOperacion, setSelectedOperacion] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingOperacion, setEditingOperacion] = useState<any>(null);

  const { operaciones, isLoading, updateOperacion, deleteOperacion, markAsDeleted, checkCanDelete } = useOperaciones();

  const filteredOperaciones = operaciones.filter(op =>
    op.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetail = (operacion: any) => {
    setSelectedOperacion(operacion);
    setShowDetail(true);
  };

  const handleEdit = (operacion: any) => {
    setEditingOperacion(operacion);
    setShowEditForm(true);
  };

  const handleEditSubmit = async (data: any) => {
    if (!editingOperacion) return;
    
    try {
      await updateOperacion({ id: editingOperacion.id, data });
      setShowEditForm(false);
      setEditingOperacion(null);
    } catch (error) {
      console.error('Error updating operation:', error);
    }
  };

  const handleDelete = async (operacionId: string) => {
    try {
      const { canDelete, reason } = await checkCanDelete(operacionId);
      
      if (canDelete) {
        if (window.confirm('¿Está seguro de que desea eliminar esta operación? Esta acción no se puede deshacer.')) {
          await deleteOperacion(operacionId);
        }
      } else {
        const confirmMessage = `No se puede eliminar físicamente esta operación porque ${reason}. ¿Desea marcarla como eliminada? Los documentos asociados se mantendrán para trazabilidad.`;
        if (window.confirm(confirmMessage)) {
          await markAsDeleted(operacionId);
        }
      }
    } catch (error) {
      console.error('Error handling operation deletion:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-500">Cargando operaciones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="ios-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Gestión de Operaciones
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <Input
                  placeholder="Buscar operaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 ios-input"
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Info Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-blue-800">
          <strong>Política de eliminación:</strong> Las operaciones sin documentos asociados (HPT, Anexo Bravo, bitácoras) pueden eliminarse completamente. Las operaciones con documentos solo pueden marcarse como eliminadas para mantener la trazabilidad.
        </AlertDescription>
      </Alert>

      {/* KPIs */}
      <OperacionesKPIs operaciones={operaciones} />

      {/* Operations Table */}
      {filteredOperaciones.length === 0 ? (
        <Card className="ios-card text-center py-12">
          <CardContent>
            <Calendar className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">
              {operaciones.length === 0 ? "No hay operaciones registradas" : "No se encontraron operaciones"}
            </h3>
            <p className="text-zinc-500">
              {operaciones.length === 0 
                ? "Comience creando la primera operación"
                : "Intenta ajustar la búsqueda"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="ios-card">
          <OperacionesTable
            operaciones={filteredOperaciones}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Card>
      )}

      {/* Dialogs */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
          {selectedOperacion && (
            <OperacionDetailModal operacion={selectedOperacion} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-2xl">
          {editingOperacion && (
            <EditOperacionForm
              operacion={editingOperacion}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setShowEditForm(false);
                setEditingOperacion(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
