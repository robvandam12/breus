
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, FileText } from "lucide-react";
import { CreateBitacoraSupervisorFormComplete } from "@/components/bitacoras/CreateBitacoraSupervisorFormComplete";
import { CreateBitacoraBuzoFormCompleteWithInmersion } from "@/components/bitacoras/CreateBitacoraBuzoFormCompleteWithInmersion";
import { useInmersiones } from "@/hooks/useInmersiones";
import { useBitacorasSupervisor, BitacoraSupervisorFormData } from "@/hooks/useBitacorasSupervisor";
import { useBitacorasBuzo, BitacoraBuzoFormData } from "@/hooks/useBitacorasBuzo";
import { toast } from "@/hooks/use-toast";

interface InmersionActionsProps {
  inmersionId: string;
  onRefresh?: () => void;
}

export const InmersionActions = ({ inmersionId, onRefresh }: InmersionActionsProps) => {
  const { deleteInmersion } = useInmersiones();
  const { createBitacoraSupervisor } = useBitacorasSupervisor();
  const { createBitacoraBuzo } = useBitacorasBuzo();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBitacoraSupervisorForm, setShowBitacoraSupervisorForm] = useState(false);
  const [showBitacoraBuzoForm, setShowBitacoraBuzoForm] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteInmersion(inmersionId);
      toast({
        title: "Inmersión eliminada",
        description: "La inmersión ha sido eliminada exitosamente.",
      });
      setShowDeleteDialog(false);
      onRefresh?.();
    } catch (error) {
      console.error('Error deleting inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la inmersión.",
        variant: "destructive",
      });
    }
  };

  const handleCreateBitacoraSupervisor = async (data: BitacoraSupervisorFormData) => {
    try {
      await createBitacoraSupervisor.mutateAsync(data);
      toast({
        title: "Bitácora creada",
        description: "La bitácora de supervisor ha sido creada exitosamente.",
      });
      setShowBitacoraSupervisorForm(false);
      onRefresh?.();
    } catch (error) {
      console.error('Error creating bitacora supervisor:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la bitácora de supervisor.",
        variant: "destructive",
      });
    }
  };

  const handleCreateBitacoraBuzo = async (data: BitacoraBuzoFormData) => {
    try {
      await createBitacoraBuzo.mutateAsync(data);
      toast({
        title: "Bitácora creada",
        description: "La bitácora de buzo ha sido creada exitosamente.",
      });
      setShowBitacoraBuzoForm(false);
      onRefresh?.();
    } catch (error) {
      console.error('Error creating bitacora buzo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la bitácora de buzo.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setShowBitacoraSupervisorForm(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Bitácora Supervisor
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowBitacoraBuzoForm(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Bitácora Buzo
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal de confirmación para eliminar */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Eliminar Inmersión"
        description="¿Estás seguro de que deseas eliminar esta inmersión? Esta acción no se puede deshacer y eliminará también todas las bitácoras asociadas."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
        onConfirm={handleDelete}
      />

      {/* Modal para crear bitácora de supervisor */}
      <Dialog open={showBitacoraSupervisorForm} onOpenChange={setShowBitacoraSupervisorForm}>
        <DialogContent className="max-w-6xl">
          <CreateBitacoraSupervisorFormComplete
            inmersionId={inmersionId}
            onSubmit={handleCreateBitacoraSupervisor}
            onCancel={() => setShowBitacoraSupervisorForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal para crear bitácora de buzo */}
      <Dialog open={showBitacoraBuzoForm} onOpenChange={setShowBitacoraBuzoForm}>
        <DialogContent className="max-w-6xl">
          <CreateBitacoraBuzoFormCompleteWithInmersion
            inmersionId={inmersionId}
            onSubmit={handleCreateBitacoraBuzo}
            onCancel={() => setShowBitacoraBuzoForm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
