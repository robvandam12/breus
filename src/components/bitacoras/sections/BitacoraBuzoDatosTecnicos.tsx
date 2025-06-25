
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BitacoraBuzoData } from '@/types/auth';

interface BitacoraBuzoDatosTecnicosProps {
  formData: Partial<BitacoraBuzoData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<BitacoraBuzoData>>>;
}

export const BitacoraBuzoDatosTecnicos: React.FC<BitacoraBuzoDatosTecnicosProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2 text-green-700">🟩 7. Datos Técnicos del Buceo</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="equipo_usado">Equipo Usado</Label>
          <Input
            id="equipo_usado"
            value={formData.datostec_equipo_usado}
            onChange={(e) => setFormData({...formData, datostec_equipo_usado: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="traje">Traje</Label>
          <Input
            id="traje"
            value={formData.datostec_traje}
            onChange={(e) => setFormData({...formData, datostec_traje: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="profundidad_max">Profundidad Máxima</Label>
          <Input
            id="profundidad_max"
            type="number"
            step="0.1"
            value={formData.profundidad_maxima}
            onChange={(e) => setFormData({...formData, profundidad_maxima: parseFloat(e.target.value) || 0})}
          />
        </div>
        <div>
          <Label htmlFor="hora_dejo_superficie">Hora en que dejó superficie</Label>
          <Input
            id="hora_dejo_superficie"
            type="time"
            value={formData.datostec_hora_dejo_superficie}
            onChange={(e) => setFormData({...formData, datostec_hora_dejo_superficie: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="hora_llegada_fondo">Hora de llegada al fondo</Label>
          <Input
            id="hora_llegada_fondo"
            type="time"
            value={formData.datostec_hora_llegada_fondo}
            onChange={(e) => setFormData({...formData, datostec_hora_llegada_fondo: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="hora_salida_fondo">Hora de salida del fondo</Label>
          <Input
            id="hora_salida_fondo"
            type="time"
            value={formData.datostec_hora_salida_fondo}
            onChange={(e) => setFormData({...formData, datostec_hora_salida_fondo: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="hora_llegada_superficie">Hora de llegada a superficie</Label>
          <Input
            id="hora_llegada_superficie"
            type="time"
            value={formData.datostec_hora_llegada_superficie}
            onChange={(e) => setFormData({...formData, datostec_hora_llegada_superficie: e.target.value})}
          />
        </div>
      </div>
    </div>
  );
};
