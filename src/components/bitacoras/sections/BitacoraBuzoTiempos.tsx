
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BitacoraBuzoData } from '@/types/auth';

interface BitacoraBuzoTiemposProps {
  formData: Partial<BitacoraBuzoData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<BitacoraBuzoData>>>;
}

export const BitacoraBuzoTiempos: React.FC<BitacoraBuzoTiemposProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2 text-green-700">🟩 8. Tiempos y Tabulación</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tiempo_fondo">Tiempo total en el fondo</Label>
          <Input
            id="tiempo_fondo"
            value={formData.tiempos_total_fondo}
            onChange={(e) => setFormData({...formData, tiempos_total_fondo: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="tiempo_descompresion">Tiempo total de descompresión</Label>
          <Input
            id="tiempo_descompresion"
            value={formData.tiempos_total_descompresion}
            onChange={(e) => setFormData({...formData, tiempos_total_descompresion: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="tiempo_buceo">Tiempo total de buceo</Label>
          <Input
            id="tiempo_buceo"
            value={formData.tiempos_total_buceo}
            onChange={(e) => setFormData({...formData, tiempos_total_buceo: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="tabulacion">Tabulación usada</Label>
          <Input
            id="tabulacion"
            value={formData.tiempos_tabulacion_usada}
            onChange={(e) => setFormData({...formData, tiempos_tabulacion_usada: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="intervalo">Intervalo en superficie</Label>
          <Input
            id="intervalo"
            value={formData.tiempos_intervalo_superficie}
            onChange={(e) => setFormData({...formData, tiempos_intervalo_superficie: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="nitrogeno">Nitrógeno residual</Label>
          <Input
            id="nitrogeno"
            value={formData.tiempos_nitrogeno_residual}
            onChange={(e) => setFormData({...formData, tiempos_nitrogeno_residual: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="grupo_anterior">Grupo repetitivo anterior</Label>
          <Input
            id="grupo_anterior"
            value={formData.tiempos_grupo_repetitivo_anterior}
            onChange={(e) => setFormData({...formData, tiempos_grupo_repetitivo_anterior: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="nuevo_grupo">Nuevo grupo repetitivo</Label>
          <Input
            id="nuevo_grupo"
            value={formData.tiempos_nuevo_grupo_repetitivo}
            onChange={(e) => setFormData({...formData, tiempos_nuevo_grupo_repetitivo: e.target.value})}
          />
        </div>
      </div>
    </div>
  );
};
