
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit, Trash2, Eye, FileText } from "lucide-react";
import { InmersionWizard } from "@/components/inmersion/InmersionWizard";
import { useInmersiones } from "@/hooks/useInmersiones";
import { toast } from "@/hooks/use-toast";

interface InmersionActionsProps {
  inmersion: any;
  onView?: (id: string) => void;
  onCreateBitacora?: (id: string, type: 'supervisor' | 'buzo') => void;
}

export const InmersionActions = ({ inmersion, onView, onCreateBitacora }: InmersionActionsProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { updateInmersion, deleteInmersion } = useInmersiones();

  const handleEdit = async (data: any) => {
    try {
      await updateInmersion({ id: inmersion.inmersion_id, data });
      setIsEditDialogOpen(false);
      toast({
        title: "Inmersión actualizada",
        description: "La inmersión ha sido actualizada exitosamente.",
      });
    } catch (error) {
      console.error('Error updating inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la inmersión.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteInmersion(inmersion.inmersion_id);
      toast({
        title: "Inmersión eliminada",
        description: "La inmersión ha sido eliminada exitosamente.",
      });
    } catch (error) {
      console.error('Error deleting inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la inmersión.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onView?.(inmersion.inmersion_id)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver detalles
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCreateBitacora?.(inmersion.inmersion_id, 'supervisor')}>
            <FileText className="mr-2 h-4 w-4" />
            Bitácora Supervisor
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCreateBitacora?.(inmersion.inmersion_id, 'buzo')}>
            <FileText className="mr-2 h-4 w-4" />
            Bitácora Buzo
          </DropdownMenuItem>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar inmersión?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará permanentemente la inmersión "{inmersion.codigo}".
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
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Inmersión</DialogTitle>
          </DialogHeader>
          <InmersionWizard
            onComplete={handleEdit}
            onCancel={() => setIsEditDialogOpen(false)}
            operationId={inmersion.operacion_id}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
