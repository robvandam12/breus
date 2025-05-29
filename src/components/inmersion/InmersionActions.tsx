
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, FileText, Eye } from "lucide-react";
import { CreateBitacoraSupervisorForm } from "@/components/bitacoras/CreateBitacoraSupervisorForm";
import { CreateBitacoraBuzoFormEnhanced } from "@/components/bitacoras/CreateBitacoraBuzoFormEnhanced";
import { InmersionWizard } from "./InmersionWizard";
import { useInmersiones } from "@/hooks/useInmersiones";
import { useBitacoras } from "@/hooks/useBitacoras";
import { toast } from "@/hooks/use-toast";

interface InmersionActionsProps {
  inmersionId: string;
  onRefresh?: () => void;
}

export const InmersionActions = ({ inmersionId, onRefresh }: InmersionActionsProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBitacoraSupervisorDialog, setShowBitacoraSupervisorDialog] = useState(false);
  const [showBitacoraBuzoDialog, setShowBitacoraBuzoDialog] = useState(false);

  const { updateInmersion, deleteInmersion, inmersiones } = useInmersiones();
  const { createBitacoraSupervisor, createBitacoraBuzo } = useBitacoras();

  const inmersion = inmersiones.find(i => i.inmersion_id === inmersionId);

  const handleEdit = async (data: any) => {
    try {
      await updateInmersion({ id: inmersionId, data });
      setShowEditDialog(false);
      onRefresh?.();
      toast({
        title: "Inmersión actualizada",
        description: "La inmersión ha sido actualizada exitosamente.",
      });
    } catch (error) {
      console.error('Error updating inmersion:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteInmersion(inmersionId);
      setShowDeleteDialog(false);
      onRefresh?.();
      toast({
        title: "Inmersión eliminada",
        description: "La inmersión ha sido eliminada exitosamente.",
      });
    } catch (error) {
      console.error('Error deleting inmersion:', error);
    }
  };

  const handleCreateBitacoraSupervisor = async (data: any) => {
    try {
      await createBitacoraSupervisor({ ...data, inmersion_id: inmersionId });
      setShowBitacoraSupervisorDialog(false);
      toast({
        title: "Bitácora creada",
        description: "La bitácora de supervisor ha sido creada exitosamente.",
      });
    } catch (error) {
      console.error('Error creating bitácora supervisor:', error);
    }
  };

  const handleCreateBitacoraBuzo = async (data: any) => {
    try {
      await createBitacoraBuzo({ ...data, inmersion_id: inmersionId });
      setShowBitacoraBuzoDialog(false);
      toast({
        title: "Bitácora creada",
        description: "La bitácora de buzo ha sido creada exitosamente.",
      });
    } catch (error) {
      console.error('Error creating bitácora buzo:', error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowBitacoraSupervisorDialog(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Bitácora Supervisor
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowBitacoraBuzoDialog(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Bitácora Buzo
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Inmersión</DialogTitle>
          </DialogHeader>
          {inmersion && (
            <InmersionWizard
              operationId={inmersion.operacion_id}
              onComplete={handleEdit}
              onCancel={() => setShowEditDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>¿Está seguro que desea eliminar esta inmersión?</p>
            <p className="text-sm text-gray-600">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Eliminar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bitácora Supervisor Dialog */}
      <Dialog open={showBitacoraSupervisorDialog} onOpenChange={setShowBitacoraSupervisorDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <CreateBitacoraSupervisorForm
            inmersionId={inmersionId}
            onSubmit={handleCreateBitacoraSupervisor}
            onCancel={() => setShowBitacoraSupervisorDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Bitácora Buzo Dialog */}
      <Dialog open={showBitacoraBuzoDialog} onOpenChange={setShowBitacoraBuzoDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <CreateBitacoraBuzoFormEnhanced
            onSubmit={handleCreateBitacoraBuzo}
            onCancel={() => setShowBitacoraBuzoDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
