
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BitacoraBuzoData } from '@/types/auth';

interface BitacoraBuzoContactosProps {
  formData: Partial<BitacoraBuzoData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<BitacoraBuzoData>>>;
}

export const BitacoraBuzoContactos: React.FC<BitacoraBuzoContactosProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2 text-green-700">🟩 5. Otros Contactos</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="jefe_centro_correo">Correo del Jefe de Centro</Label>
          <Input
            id="jefe_centro_correo"
            type="email"
            value={formData.jefe_centro_correo}
            onChange={(e) => setFormData({...formData, jefe_centro_correo: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="contratista_nombre">Nombre del Contratista de Buceo</Label>
          <Input
            id="contratista_nombre"
            value={formData.contratista_nombre}
            onChange={(e) => setFormData({...formData, contratista_nombre: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="contratista_rut">RUT del Contratista</Label>
          <Input
            id="contratista_rut"
            value={formData.contratista_rut}
            onChange={(e) => setFormData({...formData, contratista_rut: e.target.value})}
          />
        </div>
      </div>
    </div>
  );
};
