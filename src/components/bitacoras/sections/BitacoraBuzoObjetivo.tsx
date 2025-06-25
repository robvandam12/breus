
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BitacoraBuzoData } from '@/types/auth';

interface BitacoraBuzoObjetivoProps {
  formData: Partial<BitacoraBuzoData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<BitacoraBuzoData>>>;
}

export const BitacoraBuzoObjetivo: React.FC<BitacoraBuzoObjetivoProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2 text-green-700">🟩 9. Objetivo del Buceo</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="proposito">Propósito del Buceo</Label>
          <Input
            id="proposito"
            value={formData.objetivo_proposito}
            onChange={(e) => setFormData({...formData, objetivo_proposito: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="tipo_area">Tipo de Área</Label>
          <Input
            id="tipo_area"
            value={formData.objetivo_tipo_area}
            onChange={(e) => setFormData({...formData, objetivo_tipo_area: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="caracteristicas">Características y/o Dimensiones</Label>
          <Input
            id="caracteristicas"
            value={formData.objetivo_caracteristicas_dimensiones}
            onChange={(e) => setFormData({...formData, objetivo_caracteristicas_dimensiones: e.target.value})}
          />
        </div>
      </div>
    </div>
  );
};
