
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Anchor, Plus, Calendar, User, Clock, Edit, Trash2, FileText, AlertTriangle } from "lucide-react";
import { useInmersiones } from "@/hooks/useInmersiones";
import { CreateBitacoraSupervisorFormComplete } from "@/components/bitacoras/CreateBitacoraSupervisorFormComplete";
import { CreateBitacoraBuzoFormCompleteWithInmersion } from "@/components/bitacoras/CreateBitacoraBuzoFormCompleteWithInmersion";
import { useBitacoraEnhanced } from "@/hooks/useBitacoraEnhanced";
import { toast } from "@/hooks/use-toast";

interface OperacionInmersionesProps {
  operacionId: string;
}

export const OperacionInmersiones = ({ operacionId }: OperacionInmersionesProps) => {
  const { inmersiones, isLoading, deleteInmersion } = useInmersiones();
  const { createBitacoraSupervisor, createBitacoraBuzo, bitacorasSupervisor } = useBitacoraEnhanced();
  
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
              Inmersiones de la Operación
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {operacionInmersiones.length === 0 ? (
            <div className="text-center py-8">
              <Anchor className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay inmersiones registradas
              </h3>
              <p className="text-gray-500">
                Las inmersiones aparecerán aquí cuando sean creadas para esta operación.
              </p>
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
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCreateBitacoraSupervisor(inmersion.inmersion_id)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            Bit. Supervisor
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCreateBitacoraBuzo(inmersion.inmersion_id)}
                            className={`${
                              tieneBitSupervisor 
                                ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                                : "text-gray-400 cursor-not-allowed"
                            }`}
                            disabled={!tieneBitSupervisor}
                            title={!tieneBitSupervisor ? "Requiere bitácora de supervisor" : ""}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            {!tieneBitSupervisor && <AlertTriangle className="w-3 h-3 ml-1" />}
                            Bit. Buzo
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setInmersionToDelete(inmersion.inmersion_id);
                              setShowDeleteDialog(true);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
            <CreateBitacoraSupervisorFormComplete
              inmersionId={selectedInmersionId}
              onSubmit={handleSubmitBitacoraSupervisor}
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
