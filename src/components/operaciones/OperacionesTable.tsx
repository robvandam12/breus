import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, Edit, Trash2, MoreHorizontal, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditOperacionForm } from "@/components/operaciones/EditOperacionForm";
import { useOperaciones } from "@/hooks/useOperaciones";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface OperacionesTableProps {
  operaciones: any[];
  onViewDetail: (operacion: any) => void;
  onEdit: (operacion: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const OperacionesTable = ({ operaciones, onViewDetail, onEdit, onDelete }: OperacionesTableProps) => {
  const [editingOperacion, setEditingOperacion] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingOperacion, setDeletingOperacion] = useState<string | null>(null);
  const { checkCanDelete, markAsDeleted, isDeleting } = useOperaciones();

  const getStatusColor = (estado: string) => {
    const colors = {
      'activa': 'bg-green-100 text-green-700',
      'pausada': 'bg-yellow-100 text-yellow-700',
      'completada': 'bg-blue-100 text-blue-700',
      'cancelada': 'bg-red-100 text-red-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getApprovalStatusColor = (estadoAprobacion?: string) => {
    if (!estadoAprobacion) return 'bg-gray-100 text-gray-700';
    
    const colors = {
      'pendiente': 'bg-yellow-100 text-yellow-700',
      'aprobada': 'bg-green-100 text-green-700',
      'rechazada': 'bg-red-100 text-red-700',
      'eliminada': 'bg-red-100 text-red-700'
    };
    return colors[estadoAprobacion as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const formatApprovalStatus = (estadoAprobacion?: string) => {
    if (!estadoAprobacion) return 'Sin revisar';
    
    const statuses = {
      'pendiente': 'Pendiente',
      'aprobada': 'Aprobada',
      'rechazada': 'Rechazada',
      'eliminada': 'Eliminada'
    };
    return statuses[estadoAprobacion as keyof typeof statuses] || 'Sin revisar';
  };

  const handleEditClick = (operacion: any) => {
    setEditingOperacion(operacion);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (formData: any) => {
    if (!editingOperacion) return;
    
    try {
      await onEdit({ id: editingOperacion.id, ...formData });
      setIsEditDialogOpen(false);
      setEditingOperacion(null);
    } catch (error) {
      console.error('Error updating operation:', error);
    }
  };

  const handleDeleteClick = async (operacion: any) => {
    setDeletingOperacion(operacion.id);
    
    try {
      const { canDelete, reason } = await checkCanDelete(operacion.id);
      
      if (canDelete) {
        await onDelete(operacion.id);
      } else {
        await markAsDeleted(operacion.id);
      }
    } catch (error) {
      console.error('Error deleting operation:', error);
    } finally {
      setDeletingOperacion(null);
    }
  };

  if (operaciones.length === 0) {
    return (
      <Card className="ios-card text-center py-12">
        <CardContent>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay operaciones registradas</h3>
          <p className="text-zinc-500">Las operaciones aparecerán aquí una vez que sean creadas.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="ios-card">
        <CardHeader>
          <CardTitle>Lista de Operaciones ({operaciones.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="ios-table-container">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Salmonera</TableHead>
                  <TableHead>Contratista</TableHead>
                  <TableHead>Sitio</TableHead>
                  <TableHead>Fechas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Aprobación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operaciones.map((operacion) => (
                  <TableRow key={operacion.id}>
                    <TableCell className="font-medium">{operacion.codigo}</TableCell>
                    <TableCell>{operacion.nombre}</TableCell>
                    <TableCell>
                      {operacion.salmoneras?.nombre || 'Sin asignar'}
                    </TableCell>
                    <TableCell>
                      {operacion.contratistas?.nombre || 'Sin asignar'}
                    </TableCell>
                    <TableCell>
                      {operacion.sitios?.nombre || 'Sin asignar'}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Inicio: {new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}</div>
                        {operacion.fecha_fin && (
                          <div>Fin: {new Date(operacion.fecha_fin).toLocaleDateString('es-CL')}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(operacion.estado)}>
                        {operacion.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getApprovalStatusColor(operacion.estado_aprobacion)}>
                        {formatApprovalStatus(operacion.estado_aprobacion)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewDetail(operacion)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalle
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditClick(operacion)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClick(operacion)}
                            className="text-red-600"
                            disabled={deletingOperacion === operacion.id || isDeleting}
                          >
                            {deletingOperacion === operacion.id ? (
                              <LoadingSpinner className="mr-2 h-4 w-4" />
                            ) : (
                              <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {editingOperacion && (
            <EditOperacionForm
              operacion={editingOperacion}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingOperacion(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
