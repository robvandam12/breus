
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BitacoraBuzoData } from '@/types/auth';

interface BitacoraBuzoDatosGeneralesProps {
  formData: Partial<BitacoraBuzoData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<BitacoraBuzoData>>>;
}

export const BitacoraBuzoDatosGenerales: React.FC<BitacoraBuzoDatosGeneralesProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2 text-green-700">🟩 2. Datos Generales</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="empresa_nombre">Empresa</Label>
          <Input
            id="empresa_nombre"
            value={formData.empresa_nombre}
            onChange={(e) => setFormData({...formData, empresa_nombre: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="centro_nombre">Nombre del Centro</Label>
          <Input
            id="centro_nombre"
            value={formData.centro_nombre}
            onChange={(e) => setFormData({...formData, centro_nombre: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="fecha">Fecha</Label>
          <Input
            id="fecha"
            type="date"
            value={formData.fecha}
            onChange={(e) => setFormData({...formData, fecha: e.target.value})}
            required
          />
        </div>
      </div>
    </div>
  );
};
