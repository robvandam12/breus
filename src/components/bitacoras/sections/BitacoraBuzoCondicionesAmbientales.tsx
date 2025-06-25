
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BitacoraBuzoData } from '@/types/auth';

interface BitacoraBuzoCondicionesAmbientalesProps {
  formData: Partial<BitacoraBuzoData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<BitacoraBuzoData>>>;
}

export const BitacoraBuzoCondicionesAmbientales: React.FC<BitacoraBuzoCondicionesAmbientalesProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2 text-green-700">🟩 6. Condiciones Ambientales</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="estado_puerto">Estado del Puerto</Label>
          <Select value={formData.condamb_estado_puerto} onValueChange={(value: 'abierto' | 'cerrado') => setFormData({...formData, condamb_estado_puerto: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="abierto">Abierto</SelectItem>
              <SelectItem value="cerrado">Cerrado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="estado_mar">Estado del Mar</Label>
          <Input
            id="estado_mar"
            value={formData.condamb_estado_mar}
            onChange={(e) => setFormData({...formData, condamb_estado_mar: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="temp_aire">Temperatura del Aire (°C)</Label>
          <Input
            id="temp_aire"
            type="number"
            step="0.1"
            value={formData.condamb_temp_aire_c}
            onChange={(e) => setFormData({...formData, condamb_temp_aire_c: parseFloat(e.target.value) || 0})}
          />
        </div>
        <div>
          <Label htmlFor="temp_agua">Temperatura del Agua (°C)</Label>
          <Input
            id="temp_agua"
            type="number"
            step="0.1"
            value={formData.condamb_temp_agua_c}
            onChange={(e) => setFormData({...formData, condamb_temp_agua_c: parseFloat(e.target.value) || 0})}
          />
        </div>
        <div>
          <Label htmlFor="visibilidad">Visibilidad del Fondo (mts)</Label>
          <Input
            id="visibilidad"
            type="number"
            step="0.1"
            value={formData.condamb_visibilidad_fondo_mts}
            onChange={(e) => setFormData({...formData, condamb_visibilidad_fondo_mts: parseFloat(e.target.value) || 0})}
          />
        </div>
        <div>
          <Label htmlFor="corriente">Corriente del Fondo (nudos)</Label>
          <Input
            id="corriente"
            type="number"
            step="0.1"
            value={formData.condamb_corriente_fondo_nudos}
            onChange={(e) => setFormData({...formData, condamb_corriente_fondo_nudos: parseFloat(e.target.value) || 0})}
          />
        </div>
      </div>
    </div>
  );
};
