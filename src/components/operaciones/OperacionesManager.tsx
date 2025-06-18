
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Trash2, Play, Settings, Bug } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { EditOperacionForm } from "./EditOperacionForm";
import { OperacionFlowTester } from "./OperacionFlowTester";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface OperacionesManagerProps {
  onStartWizard?: (operacionId?: string) => void;
}

export const OperacionesManager = ({ onStartWizard }: OperacionesManagerProps) => {
  const [editingOperacion, setEditingOperacion] = useState<any>(null);
  const [showTester, setShowTester] = useState(false);
  const [deletingOperacion, setDeletingOperacion] = useState<string | null>(null);
  
  const { 
    operaciones, 
    isLoading, 
    deleteOperacion, 
    updateOperacion,
    checkCanDelete,
    isDeleting 
  } = useOperaciones();

  const handleEdit = (operacion: any) => {
    console.log('Editing operation:', operacion);
    setEditingOperacion(operacion);
  };

  const handleEditSubmit = async (data: any) => {
    if (!editingOperacion) return;
    
    try {
      console.log('Submitting edit with data:', data);
      await updateOperacion({ id: editingOperacion.id, data });
      setEditingOperacion(null);
      toast({
        title: "Operación actualizada",
        description: "Los cambios han sido guardados exitosamente.",
      });
    } catch (error) {
      console.error('Error updating operation:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la operación.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (operacionId: string) => {
    try {
      console.log('Checking if operation can be deleted:', operacionId);
      const deleteCheck = await checkCanDelete(operacionId);
      
      if (!deleteCheck.canDelete) {
        toast({
          title: "No se puede eliminar",
          description: `Esta operación no se puede eliminar porque ${deleteCheck.reason}`,
          variant: "destructive",
        });
        return;
      }

      setDeletingOperacion(operacionId);
    } catch (error) {
      console.error('Error checking delete permission:', error);
      toast({
        title: "Error",
        description: "No se pudo verificar si la operación se puede eliminar.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = async () => {
    if (!deletingOperacion) return;
    
    try {
      console.log('Deleting operation:', deletingOperacion);
      await deleteOperacion(deletingOperacion);
      setDeletingOperacion(null);
      toast({
        title: "Operación eliminada",
        description: "La operación ha sido eliminada exitosamente.",
      });
    } catch (error) {
      console.error('Error deleting operation:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la operación.",
        variant: "destructive",
      });
    }
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'activa':
        return 'bg-green-100 text-green-800';
      case 'pausada':
        return 'bg-yellow-100 text-yellow-800';
      case 'completada':
        return 'bg-blue-100 text-blue-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAprobacionBadgeColor = (estado: string) => {
    switch (estado) {
      case 'aprobada':
        return 'bg-green-100 text-green-800';
      case 'rechazada':
        return 'bg-red-100 text-red-800';
      case 'pendiente':
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Cargando operaciones...</div>
        </CardContent>
      </Card>
    );
  }

  if (showTester) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setShowTester(false)}
          className="mb-4"
        >
          ← Volver al Manager
        </Button>
        <OperacionFlowTester />
      </div>
    );
  }

  if (editingOperacion) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setEditingOperacion(null)}
          className="mb-4"
        >
          ← Volver al Listado
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Editar Operación: {editingOperacion.codigo}</CardTitle>
          </CardHeader>
          <CardContent>
            <EditOperacionForm
              operacion={editingOperacion}
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingOperacion(null)}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botones de acción */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Operaciones</h2>
          <p className="text-gray-600">
            Total: {operaciones.length} operaciones
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowTester(true)}
          className="flex items-center gap-2"
        >
          <Bug className="w-4 h-4" />
          Testing
        </Button>
      </div>

      {/* Lista de operaciones */}
      <div className="grid gap-4">
        {operaciones.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 mb-4">No hay operaciones registradas</p>
              <Button onClick={() => onStartWizard && onStartWizard()}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Operación
              </Button>
            </CardContent>
          </Card>
        ) : (
          operaciones.map((operacion) => (
            <Card key={operacion.id} className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{operacion.codigo}</h3>
                      <Badge className={getEstadoBadgeColor(operacion.estado)}>
                        {operacion.estado}
                      </Badge>
                      <Badge className={getAprobacionBadgeColor(operacion.estado_aprobacion || 'pendiente')}>
                        {operacion.estado_aprobacion || 'pendiente'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{operacion.nombre}</p>
                    <div className="text-sm text-gray-500 space-y-1">
                      <div>Fecha inicio: {operacion.fecha_inicio}</div>
                      {operacion.sitios && (
                        <div>Sitio: {operacion.sitios.nombre} ({operacion.sitios.codigo})</div>
                      )}
                      {operacion.equipos_buceo && (
                        <div>Equipo: {operacion.equipos_buceo.nombre}</div>
                      )}
                      {operacion.usuario_supervisor && (
                        <div>Supervisor: {operacion.usuario_supervisor.nombre} {operacion.usuario_supervisor.apellido}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(operacion)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Editar
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStartWizard && onStartWizard(operacion.id)}
                      className="flex items-center gap-1"
                    >
                      <Settings className="w-3 h-3" />
                      Wizard
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(operacion.id)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                          Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar operación?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Solo se pueden eliminar operaciones que no tengan documentos firmados o inmersiones asociadas.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting}
                          >
                            {isDeleting ? 'Eliminando...' : 'Eliminar'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
