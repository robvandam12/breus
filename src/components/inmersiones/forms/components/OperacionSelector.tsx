
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Operacion } from '@/types/inmersionForms';

interface OperacionSelectorProps {
  operaciones: Operacion[];
  value: string;
  onValueChange: (value: string) => void;
  canShowPlanning: boolean;
  isPlanned: boolean;
}

export const OperacionSelector = ({ 
  operaciones, 
  value, 
  onValueChange, 
  canShowPlanning, 
  isPlanned 
}: OperacionSelectorProps) => {
  if (!canShowPlanning || !isPlanned) {
    return null;
  }

  if (operaciones.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          ⚠️ No hay operaciones disponibles. Para crear una inmersión planificada, primero debe crear una operación.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Label htmlFor="operacion">Operación *</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar operación" />
        </SelectTrigger>
        <SelectContent>
          {operaciones.map(operacion => (
            <SelectItem key={operacion.id} value={operacion.id}>
              <div>
                <div>{operacion.codigo} - {operacion.nombre}</div>
                <div className="text-sm text-gray-500">
                  Centro: {operacion.centros?.nombre || 'No asignado'}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
