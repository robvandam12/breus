
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { InmersionFormData } from '@/types/inmersionForms';

interface InmersionBasicFieldsProps {
  formData: InmersionFormData;
  onFormDataChange: (data: Partial<InmersionFormData>) => void;
  showExternalCode: boolean;
}

export const InmersionBasicFields = ({ 
  formData, 
  onFormDataChange, 
  showExternalCode 
}: InmersionBasicFieldsProps) => {
  return (
    <>
      {showExternalCode && (
        <div>
          <Label htmlFor="codigo_externo">Código de Operación Externa *</Label>
          <Input
            id="codigo_externo"
            value={formData.external_operation_code}
            onChange={(e) => onFormDataChange({ external_operation_code: e.target.value })}
            placeholder="Ej: EXT-2024-001"
            required
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="objetivo">Objetivo *</Label>
          <Input
            id="objetivo"
            value={formData.objetivo}
            onChange={(e) => onFormDataChange({ objetivo: e.target.value })}
            placeholder="Objetivo de la inmersión"
            required
          />
        </div>
        <div>
          <Label htmlFor="fecha">Fecha de Inmersión *</Label>
          <Input
            id="fecha"
            type="date"
            value={formData.fecha_inmersion}
            onChange={(e) => onFormDataChange({ fecha_inmersion: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="profundidad">Profundidad Máxima (m) *</Label>
          <Input
            id="profundidad"
            type="number"
            step="0.1"
            value={formData.profundidad_max}
            onChange={(e) => onFormDataChange({ profundidad_max: e.target.value })}
            placeholder="Ej: 15.5"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="observaciones">Observaciones</Label>
        <Textarea
          id="observaciones"
          value={formData.observaciones}
          onChange={(e) => onFormDataChange({ observaciones: e.target.value })}
          placeholder="Observaciones adicionales..."
          rows={3}
        />
      </div>
    </>
  );
};
