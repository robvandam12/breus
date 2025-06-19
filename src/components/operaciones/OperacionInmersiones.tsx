
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Anchor, Plus, Calendar, User, Clock, Edit, Trash2, FileText, AlertTriangle, MoreVertical } from "lucide-react";
import { useInmersiones } from "@/hooks/useInmersiones";
import { BitacoraWizardFromInmersion } from "@/components/bitacoras/BitacoraWizardFromInmersion";
import { CreateBitacoraBuzoFormCompleteWithInmersion } from "@/components/bitacoras/CreateBitacoraBuzoFormCompleteWithInmersion";
import { useBitacorasSupervisor } from "@/hooks/useBitacorasSupervisor";
import { useBitacorasBuzo } from "@/hooks/useBitacorasBuzo";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from '@tanstack/react-query';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OperacionInmersionesProps {
  operacionId: string;
  canCreateInmersiones?: boolean;
  onNewInmersion?: () => void;
}

export const OperacionInmersiones = ({ operacionId, canCreateInmersiones = true, onNewInmersion }: OperacionInmersionesProps) => {
  const { inmersiones, isLoading, deleteInmersion } = useInmersiones();
  const { createBitacoraSupervisor, bitacorasSupervisor } = useBitacorasSupervisor();
  const { createBitacoraBuzo } = useBitacorasBuzo();
  const queryClient = useQueryClient();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [inmersionToDelete, setInmersionToDelete] = useState<string | null>(null);
  const [showBitacoraSupervisorForm, setShowBitacoraSupervisorForm] = useState(false);
  const [showBitacoraBuzoForm, setShowBitacoraBuzoForm] = useState(false);
  const [selectedInmersionId, setSelectedInmersionId] = useState<string | null>(null);

  const operacionInmersiones = inmersiones.filter(
    inmersion => inmersion.operacion_id === operacionId
  );

  const handleDeleteInmersion = async () => {
    if (!inmersionToDelete) return;
    
    try {
      await deleteInmersion(inmersionToDelete);
      toast({
        title: "Inmersión eliminada",
        description: "La inmersión ha sido eliminada exitosamente.",
      });
      // CORRECCIÓN: Mejorar invalidación de queries para múltiples inmersiones
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      queryClient.invalidateQueries({ queryKey: ['inmersionesCompletas'] });
      queryClient.invalidateQueries({ queryKey: ['operacionDetails', operacionId] });
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      
      // Forzar refetch inmediato
      queryClient.refetchQueries({ queryKey: ['inmersiones'] });
      queryClient.refetchQueries({ queryKey: ['operacionDetails', operacionId] });
      
      setShowDeleteDialog(false);
      setInmersionToDelete(null);
    } catch (error) {
      console.error('Error deleting inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la inmersión.",
        variant: "destructive",
      });
    }
  };

  const handleCreateBitacoraSupervisor = (inmersionId: string) => {
    setSelectedInmersionId(inmersionId);
    setShowBitacoraSupervisorForm(true);
  };

  const handleCreateBitacoraBuzo = (inmersionId: string) => {
    // Verificar si existe bitácora de supervisor para esta inmersión
    const bitacoraSupervisorExiste = (bitacorasSupervisor || []).some(b => b.inmersion_id === inmersionId);
    
    if (!bitacoraSupervisorExiste) {
      toast({
        title: "Bitácora supervisor requerida",
        description: "Debe crear primero la bitácora de supervisor antes de crear la bitácora de buzo.",
        variant: "destructive",
      });
      return;
    }

    setSelectedInmersionId(inmersionId);
    setShowBitacoraBuzoForm(true);
  };

  const handleSubmitBitacoraSupervisor = async (data: any) => {
    try {
      await createBitacoraSupervisor.mutateAsync(data);
      toast({
        title: "Bitácora creada",
        description: "La bitácora de supervisor ha sido creada exitosamente.",
      });
      setShowBitacoraSupervisorForm(false);
      setSelectedInmersionId(null);
      
      // CORRECCIÓN: Invalidar queries relacionadas después de crear bitácora
      queryClient.invalidateQueries({ queryKey: ['bitacorasSupervisor'] });
      queryClient.invalidateQueries({ queryKey: ['operacionDetails', operacionId] });
    } catch (error) {
      console.error('Error creating bitacora supervisor:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la bitácora de supervisor.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitBitacoraBuzo = async (data: any) => {
    try {
      await createBitacoraBuzo.mutateAsync(data);
      toast({
        title: "Bitácora creada",
        description: "La bitácora de buzo ha sido creada exitosamente.",
      });
      setShowBitacoraBuzoForm(false);
      setSelectedInmersionId(null);
      
      // CORRECCIÓN: Invalidar queries relacionadas después de crear bitácora
      queryClient.invalidateQueries({ queryKey: ['bitacorasBuzo'] });
      queryClient.invalidateQueries({ queryKey: ['operacionDetails', operacionId] });
    } catch (error) {
      console.error('Error creating bitacora buzo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la bitácora de buzo.",
        variant: "destructive",
      });
    }
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'planificada':
        return 'bg-blue-100 text-blue-800';
      case 'en_progreso':
        return 'bg-yellow-100 text-yellow-800';
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tieneBitacoraSupervisor = (inmersionId: string) => {
    return (bitacorasSupervisor || []).some(b => b.inmersion_id === inmersionId);
  };

  const handleNewInmersion = () => {
    if (!canCreateInmersiones) {
      toast({
        title: "No se puede crear inmersión",
        description: "Para crear inmersiones necesita: Equipo asignado, HPT firmado y Anexo Bravo firmado.",
        variant: "destructive",
      });
      return;
    }
    
    if (onNewInmersion) {
      onNewInmersion();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando inmersiones...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Anchor className="w-5 h-5" />
              Inmersiones de la Operación ({operacionInmersiones.length})
            </CardTitle>
            {onNewInmersion && (
              <Button
                onClick={handleNewInmersion}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Inmersión
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!canCreateInmersiones && (
            <Alert className="mb-4 border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-yellow-800">
                Para crear inmersiones necesita: Equipo asignado, HPT firmado y Anexo Bravo firmado
              </AlertDescription>
            </Alert>
          )}
          {operacionInmersiones.length === 0 ? (
            <div className="text-center py-8">
              <Anchor className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay inmersiones registradas
              </h3>
              <p className="text-gray-500 mb-4">
                Las inmersiones aparecerán aquí cuando sean creadas para esta operación.
              </p>
              {onNewInmersion && canCreateInmersiones && (
                <Button onClick={handleNewInmersion} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Inmersión
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Buzo Principal</TableHead>
                  <TableHead>Supervisor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Profundidad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operacionInmersiones.map((inmersion) => {
                  const tieneBitSupervisor = tieneBitacoraSupervisor(inmersion.inmersion_id);
                  
                  return (
                    <TableRow key={inmersion.inmersion_id}>
                      <TableCell className="font-medium">{inmersion.codigo}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          {inmersion.buzo_principal}
                        </div>
                      </TableCell>
                      <TableCell>{inmersion.supervisor}</TableCell>
                      <TableCell>
                        <Badge className={getEstadoBadgeColor(inmersion.estado)}>
                          {inmersion.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>{inmersion.profundidad_max}m</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end">
                          {/* CORRECCIÓN: Implementar dropdown de acciones como solicita el usuario */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleCreateBitacoraSupervisor(inmersion.inmersion_id)}
                                className="flex items-center gap-2"
                              >
                                <FileText className="w-4 h-4" />
                                Crear Bitácora Supervisor
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleCreateBitacoraBuzo(inmersion.inmersion_id)}
                                disabled={!tieneBitSupervisor}
                                className="flex items-center gap-2"
                              >
                                <FileText className="w-4 h-4" />
                                Crear Bitácora Buzo
                                {!tieneBitSupervisor && <AlertTriangle className="w-3 h-3 ml-1" />}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setInmersionToDelete(inmersion.inmersion_id);
                                  setShowDeleteDialog(true);
                                }}
                                className="flex items-center gap-2 text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Eliminar Inmersión"
        description="¿Estás seguro de que deseas eliminar esta inmersión? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
        onConfirm={handleDeleteInmersion}
      />

      <Dialog open={showBitacoraSupervisorForm} onOpenChange={setShowBitacoraSupervisorForm}>
        <DialogContent className="max-w-6xl">
          {selectedInmersionId && (
            <BitacoraWizardFromInmersion
              inmersionId={selectedInmersionId}
              onComplete={handleSubmitBitacoraSupervisor}
              onCancel={() => {
                setShowBitacoraSupervisorForm(false);
                setSelectedInmersionId(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showBitacoraBuzoForm} onOpenChange={setShowBitacoraBuzoForm}>
        <DialogContent className="max-w-6xl">
          {selectedInmersionId && (
            <CreateBitacoraBuzoFormCompleteWithInmersion
              inmersionId={selectedInmersionId}
              onSubmit={handleSubmitBitacoraBuzo}
              onCancel={() => {
                setShowBitacoraBuzoForm(false);
                setSelectedInmersionId(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
