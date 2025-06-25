
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BitacoraBuzoData } from '@/types/auth';

interface BitacoraBuzoDatosSupervisorProps {
  formData: Partial<BitacoraBuzoData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<BitacoraBuzoData>>>;
}

export const BitacoraBuzoDatosSupervisor: React.FC<BitacoraBuzoDatosSupervisorProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2 text-green-700">🟩 4. Datos del Supervisor</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="supervisor_nombre">Nombre del Supervisor</Label>
          <Input
            id="supervisor_nombre"
            value={formData.supervisor_nombre}
            onChange={(e) => setFormData({...formData, supervisor_nombre: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="supervisor_rut">RUT del Supervisor</Label>
          <Input
            id="supervisor_rut"
            value={formData.supervisor_rut}
            onChange={(e) => setFormData({...formData, supervisor_rut: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="supervisor_correo">Correo del Supervisor</Label>
          <Input
            id="supervisor_correo"
            type="email"
            value={formData.supervisor_correo}
            onChange={(e) => setFormData({...formData, supervisor_correo: e.target.value})}
            required
          />
        </div>
      </div>
    </div>
  );
};
