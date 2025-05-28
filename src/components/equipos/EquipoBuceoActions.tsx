
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit, Trash2, Users, Settings } from "lucide-react";
import { EditEquipoForm } from "./EditEquipoForm";
import { EquipoBuceoMemberManager } from "./EquipoBuceoMemberManager";
import { toast } from "@/hooks/use-toast";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";

interface EquipoBuceoActionsProps {
  equipo: any;
  onEdit: (equipo: any) => void;
  onDelete: (equipoId: string) => void;
}

export const EquipoBuceoActions = ({ equipo, onEdit, onDelete }: EquipoBuceoActionsProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { updateEquipo, deleteEquipo } = useEquiposBuceoEnhanced();

  const handleEdit = async (data: any) => {
    try {
      await updateEquipo({ id: equipo.id, data });
      setShowEditDialog(false);
      toast({
        title: "Equipo actualizado",
        description: "El equipo ha sido actualizado exitosamente.",
      });
    } catch (error) {
      console.error('Error updating equipo:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el equipo.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEquipo(equipo.id);
      setShowDeleteDialog(false);
      toast({
        title: "Equipo eliminado",
        description: "El equipo ha sido eliminado exitosamente.",
      });
    } catch (error) {
      console.error('Error deleting equipo:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el equipo.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar equipo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowMemberDialog(true)}>
            <Users className="mr-2 h-4 w-4" />
            Gestionar miembros
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar equipo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog para editar equipo */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Equipo</DialogTitle>
          </DialogHeader>
          <EditEquipoForm
            equipo={equipo}
            onSubmit={handleEdit}
            onCancel={() => setShowEditDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog para gestionar miembros */}
      <Dialog open={showMemberDialog} onOpenChange={setShowMemberDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestionar Miembros - {equipo.nombre}</DialogTitle>
          </DialogHeader>
          <EquipoBuceoMemberManager equipoId={equipo.id} equipo={equipo} />
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el equipo
              "{equipo.nombre}" y removerá todos sus miembros.
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
    </>
  );
};
