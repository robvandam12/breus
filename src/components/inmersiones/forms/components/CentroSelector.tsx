
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Centro, Operacion } from '@/types/inmersionForms';

interface CentroSelectorProps {
  centros: Centro[];
  value: string;
  onValueChange: (value: string) => void;
  isPlanned: boolean;
  operacionId: string;
  operaciones: Operacion[];
}

export const CentroSelector = ({ 
  centros, 
  value, 
  onValueChange, 
  isPlanned, 
  operacionId, 
  operaciones 
}: CentroSelectorProps) => {
  const selectedOperacion = operaciones.find(op => op.id === operacionId);
  const isDisabled = isPlanned && operacionId && selectedOperacion?.centro_id;

  return (
    <div>
      <Label htmlFor="centro">Centro *</Label>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={isDisabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar centro" />
        </SelectTrigger>
        <SelectContent>
          {centros.map(centro => (
            <SelectItem key={centro.id} value={centro.id}>
              {centro.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isDisabled && (
        <p className="text-sm text-gray-600 mt-1">
          Centro heredado de la operación seleccionada
        </p>
      )}
    </div>
  );
};
