
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";

interface InmersionesActionsProps {
  canCreateDirect: boolean;
  canCreatePlanned: boolean;
  onCreateDirect: () => void;
  onCreatePlanned: () => void;
}

export const InmersionesActions: React.FC<InmersionesActionsProps> = ({
  canCreateDirect,
  canCreatePlanned,
  onCreateDirect,
  onCreatePlanned
}) => {
  return (
    <div className="flex gap-2">
      {canCreateDirect && (
        <Button 
          className="flex items-center gap-2"
          onClick={onCreateDirect}
        >
          <Plus className="w-4 h-4" />
          Nueva Inmersión
        </Button>
      )}
      {canCreatePlanned && (
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onCreatePlanned}
        >
          <Calendar className="w-4 h-4" />
          Desde Operación
        </Button>
      )}
    </div>
  );
};
