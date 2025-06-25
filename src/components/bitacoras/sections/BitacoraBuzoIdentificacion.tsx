
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BitacoraBuzoData } from '@/types/auth';

interface BitacoraBuzoIdentificacionProps {
  formData: Partial<BitacoraBuzoData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<BitacoraBuzoData>>>;
}

export const BitacoraBuzoIdentificacion: React.FC<BitacoraBuzoIdentificacionProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2 text-green-700">🟩 1. Identificación del Registro</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="folio">Folio</Label>
          <Input
            id="folio"
            value={formData.folio}
            onChange={(e) => setFormData({...formData, folio: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="codigo_verificacion">Código de Verificación</Label>
          <Input
            id="codigo_verificacion"
            value={formData.codigo_verificacion}
            onChange={(e) => setFormData({...formData, codigo_verificacion: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="validador_nombre">Firma del Supervisor</Label>
          <Input
            id="validador_nombre"
            value={formData.validador_nombre}
            onChange={(e) => setFormData({...formData, validador_nombre: e.target.value})}
            placeholder="Nombre del supervisor validador"
          />
        </div>
      </div>
    </div>
  );
};
