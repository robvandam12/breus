
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Users, Trash2 } from "lucide-react";
import { EditEquipoForm } from "./EditEquipoForm";
import { TeamMemberManager } from "./TeamMemberManager";

interface EquipoBuceoActionsProps {
  equipo: any;
  onEdit: (equipo: any) => void;
  onDelete: (equipoId: string) => void;
  onAddMember: (equipoId: string) => void;
}

export const EquipoBuceoActions = ({ equipo, onEdit, onDelete }: EquipoBuceoActionsProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);

  const handleEdit = (data: any) => {
    onEdit({ ...equipo, ...data });
    setIsEditDialogOpen(false);
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
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsMembersDialogOpen(true)}>
            <Users className="mr-2 h-4 w-4" />
            Gestionar Miembros
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onDelete(equipo.id)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <EditEquipoForm
            equipo={equipo}
            onSubmit={handleEdit}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Members Management Dialog */}
      <Dialog open={isMembersDialogOpen} onOpenChange={setIsMembersDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <TeamMemberManager
            equipoId={equipo.id}
            miembros={equipo.miembros || []}
            equipoNombre={equipo.nombre}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
