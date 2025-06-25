
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BitacoraBuzoData } from '@/types/auth';

interface BitacoraBuzoDatosBuzoProps {
  formData: Partial<BitacoraBuzoData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<BitacoraBuzoData>>>;
}

export const BitacoraBuzoDatosBuzo: React.FC<BitacoraBuzoDatosBuzoProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2 text-green-700">🟩 3. Datos del Buzo</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="buzo_nombre">Nombre del Buzo</Label>
          <Input
            id="buzo_nombre"
            value={formData.buzo_nombre}
            onChange={(e) => setFormData({...formData, buzo_nombre: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="buzo_rut">RUT del Buzo</Label>
          <Input
            id="buzo_rut"
            value={formData.buzo_rut}
            onChange={(e) => setFormData({...formData, buzo_rut: e.target.value})}
            required
          />
        </div>
      </div>
    </div>
  );
};
