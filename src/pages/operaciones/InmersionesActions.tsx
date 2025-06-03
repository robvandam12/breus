
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";

interface InmersionesActionsProps {
  inmersionId: string;
  onView: (id: string) => void;
  onCreateBitacoraBuzo: (id: string) => void;
  onCreateBitacoraSupervisor: (id: string) => void;
}

export const InmersionesActions = ({ 
  inmersionId, 
  onView, 
  onCreateBitacoraBuzo, 
  onCreateBitacoraSupervisor 
}: InmersionesActionsProps) => {
  return (
    <div className="pt-3 border-t border-gray-200">
      <div className="flex gap-2 mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onView(inmersionId)}
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-1" />
          Ver
        </Button>
      </div>
      <div className="flex gap-1">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onCreateBitacoraBuzo(inmersionId)}
          className="flex-1 text-xs"
        >
          <FileText className="w-3 h-3 mr-1" />
          Bit. Buzo
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onCreateBitacoraSupervisor(inmersionId)}
          className="flex-1 text-xs"
        >
          <FileText className="w-3 h-3 mr-1" />
          Bit. Sup.
        </Button>
      </div>
    </div>
  );
};
