
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, Workflow, Play } from "lucide-react";

interface OperacionesActionsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStartWizard?: () => void;
  onCreateInmersion?: () => void;
}

export const OperacionesActions = ({ 
  onView, 
  onEdit, 
  onDelete, 
  onStartWizard,
  onCreateInmersion 
}: OperacionesActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onView}>
          <Eye className="mr-2 h-4 w-4" />
          Ver detalles
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        {onStartWizard && (
          <DropdownMenuItem onClick={onStartWizard}>
            <Workflow className="mr-2 h-4 w-4" />
            Wizard
          </DropdownMenuItem>
        )}
        {onCreateInmersion && (
          <DropdownMenuItem onClick={onCreateInmersion}>
            <Play className="mr-2 h-4 w-4" />
            Crear Inmersión
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onDelete} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
