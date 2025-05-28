
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit, Trash2, UserPlus, UserMinus, Users } from "lucide-react";
import { EditEquipoForm } from "./EditEquipoForm";
import { AddMemberForm } from "./AddMemberForm";
import { toast } from "@/hooks/use-toast";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";

interface EquipoBuceoActionsProps {
  equipo: any;
  onEdit: (equipo: any) => void;
  onDelete: (equipoId: string) => void;
  onAddMember: (equipoId: string) => void;
}

export const EquipoBuceoActions = ({ equipo, onEdit, onDelete, onAddMember }: EquipoBuceoActionsProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showRemoveMemberDialog, setShowRemoveMemberDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const { addMiembro, updateEquipo, deleteEquipo } = useEquiposBuceoEnhanced();

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

  const handleAddMember = async (memberData: any) => {
    try {
      await addMiembro({
        equipo_id: equipo.id,
        usuario_id: memberData.usuario_id,
        rol_equipo: memberData.rol_equipo,
        nombre_completo: memberData.nombre_completo,
        email: memberData.email,
        invitado: memberData.invitado || false
      });
      setShowAddMemberDialog(false);
      toast({
        title: "Miembro agregado",
        description: "El miembro ha sido agregado al equipo exitosamente.",
      });
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el miembro al equipo.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedMember) return;
    
    try {
      // Implementar lógica para remover miembro
      // Por ahora solo mostramos confirmación
      setShowRemoveMemberDialog(false);
      setSelectedMember(null);
      toast({
        title: "Miembro removido",
        description: "El miembro ha sido removido del equipo.",
      });
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "No se pudo remover el miembro del equipo.",
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
          <DropdownMenuItem onClick={() => setShowAddMemberDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Agregar miembro
          </DropdownMenuItem>
          {equipo.miembros && equipo.miembros.length > 0 && (
            <DropdownMenuItem onClick={() => setShowRemoveMemberDialog(true)}>
              <UserMinus className="mr-2 h-4 w-4" />
              Remover miembro
            </DropdownMenuItem>
          )}
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

      {/* Dialog para agregar miembro */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Agregar Miembro al Equipo</DialogTitle>
          </DialogHeader>
          <AddMemberForm
            equipoId={equipo.id}
            onSubmit={handleAddMember}
            onCancel={() => setShowAddMemberDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog para remover miembro */}
      <Dialog open={showRemoveMemberDialog} onOpenChange={setShowRemoveMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Miembro del Equipo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Seleccione el miembro que desea remover del equipo:
            </p>
            {equipo.miembros && equipo.miembros.length > 0 ? (
              <div className="space-y-2">
                {equipo.miembros.map((miembro: any, index: number) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                      selectedMember?.id === miembro.id ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedMember(miembro)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{miembro.nombre_completo}</p>
                        <p className="text-sm text-gray-500">{miembro.rol}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No hay miembros en este equipo</p>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRemoveMemberDialog(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleRemoveMember}
                disabled={!selectedMember}
              >
                Remover Miembro
              </Button>
            </div>
          </div>
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
