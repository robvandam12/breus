
import React from 'react';
import { SelectItem } from "@/components/ui/select";
import { Plus } from "lucide-react";

export const CuadrillaCreateButton = () => {
  return (
    <SelectItem value="create-new">
      <div className="flex items-center gap-2">
        <Plus className="w-4 h-4 text-green-600" />
        Crear nueva cuadrilla
      </div>
    </SelectItem>
  );
};
