
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit, Trash, FileText, Eye } from "lucide-react";
import { useInmersiones } from "@/hooks/useInmersiones";
import { CreateBitacoraBuzoFormEnhanced } from "@/components/bitacoras/CreateBitacoraBuzoFormEnhanced";
import { CreateBitacoraSupervisorForm } from "@/components/bitacoras/CreateBitacoraSupervisorForm";
import { useBitacoras } from "@/hooks/useBitacoras";
import { toast } from "@/hooks/use-toast";

interface InmersionActionsProps {
  inmersion: any;
  onEdit?: (inmersion: any) => void;
  onView?: (inmersion: any) => void;
}

export const InmersionActions = ({ inmersion, onEdit, onView }: InmersionActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBitacoraBuzoForm, setShowBitacoraBuzoForm] = useState(false);
  const [showBitacoraSupervisorForm, setShowBitacoraSupervisorForm] = useState(false);
  
  const { deleteInmersion } = useInmersiones();
  const { createBitacoraBuzo, createBitacoraSupervisor } = useBitacoras();

  const handleDelete = async () => {
    try {
      await deleteInmersion(inmersion.inmersion_id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting inmersion:', error);
    }
  };

  const handleBitacoraBuzoSubmit = async (data: any) => {
    try {
      await createBitacoraBuzo({ ...data, inmersion_id: inmersion.inmersion_id });
      toast({
        title: "Bitácora de buzo creada",
        description: "La bitácora ha sido creada exitosamente.",
      });
      setShowBitacoraBuzoForm(false);
    } catch (error) {
      console.error('Error creating bitacora buzo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la bitácora.",
        variant: "destructive",
      });
    }
  };

  const handleBitacoraSupervisorSubmit = async (data: any) => {
    try {
      await createBitacoraSupervisor({ ...data, inmersion_id: inmersion.inmersion_id });
      toast({
        title: "Bitácora de supervisor creada",
        description: "La bitácora ha sido creada exitosamente.",
      });
      setShowBitacoraSupervisorForm(false);
    } catch (error) {
      console.error('Error creating bitacora supervisor:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la bitácora.",
        variant: "destructive",
      });
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
          <DropdownMenuItem onClick={() => onView?.(inmersion)}>
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalles
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit?.(inmersion)}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowBitacoraBuzoForm(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Bitácora Buzo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowBitacoraSupervisorForm(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Bitácora Supervisor
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash className="w-4 h-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la inmersión
              <strong> {inmersion.codigo}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showBitacoraBuzoForm} onOpenChange={setShowBitacoraBuzoForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <CreateBitacoraBuzoFormEnhanced
            onSubmit={handleBitacoraBuzoSubmit}
            onCancel={() => setShowBitacoraBuzoForm(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showBitacoraSupervisorForm} onOpenChange={setShowBitacoraSupervisorForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <CreateBitacoraSupervisorForm
            inmersionId={inmersion.inmersion_id}
            onSubmit={handleBitacoraSupervisorSubmit}
            onCancel={() => setShowBitacoraSupervisorForm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
