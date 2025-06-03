
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";

interface OperacionesActionsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const OperacionesActions = ({ onView, onEdit, onDelete }: OperacionesActionsProps) => {
  return (
    <div className="flex justify-end gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={onView}
        className="ios-button-sm"
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="ios-button-sm"
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        className="ios-button-sm text-red-600 hover:text-red-700"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};
