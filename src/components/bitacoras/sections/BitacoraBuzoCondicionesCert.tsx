
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { BitacoraBuzoData } from '@/types/auth';

interface BitacoraBuzoCondicionesCertProps {
  formData: Partial<BitacoraBuzoData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<BitacoraBuzoData>>>;
}

export const BitacoraBuzoCondicionesCert: React.FC<BitacoraBuzoCondicionesCertProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2 text-green-700">🟩 10. Condiciones y Certificaciones</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="buceo_altitud"
            checked={formData.condcert_buceo_altitud}
            onCheckedChange={(checked) => setFormData({...formData, condcert_buceo_altitud: !!checked})}
          />
          <Label htmlFor="buceo_altitud">¿Buceo en altitud?</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="certificados_equipos"
            checked={formData.condcert_certificados_equipos_usados}
            onCheckedChange={(checked) => setFormData({...formData, condcert_certificados_equipos_usados: !!checked})}
          />
          <Label htmlFor="certificados_equipos">¿Certificados de los equipos usados?</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="areas_confinadas"
            checked={formData.condcert_buceo_areas_confinadas}
            onCheckedChange={(checked) => setFormData({...formData, condcert_buceo_areas_confinadas: !!checked})}
          />
          <Label htmlFor="areas_confinadas">¿Buceo en áreas confinadas?</Label>
        </div>
        <div>
          <Label htmlFor="observaciones_cert">Observaciones</Label>
          <Textarea
            id="observaciones_cert"
            value={formData.condcert_observaciones}
            onChange={(e) => setFormData({...formData, condcert_observaciones: e.target.value})}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};
