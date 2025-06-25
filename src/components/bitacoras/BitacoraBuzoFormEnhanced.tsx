
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { BitacoraBuzoData } from '@/types/auth';
import { useBitacoraBuzoForm } from '@/hooks/useBitacoraBuzoForm';

// Import all section components
import { BitacoraBuzoIdentificacion } from './sections/BitacoraBuzoIdentificacion';
import { BitacoraBuzoDatosGenerales } from './sections/BitacoraBuzoDatosGenerales';
import { BitacoraBuzoDatosBuzo } from './sections/BitacoraBuzoDatosBuzo';
import { BitacoraBuzoDatosSupervisor } from './sections/BitacoraBuzoDatosSupervisor';
import { BitacoraBuzoContactos } from './sections/BitacoraBuzoContactos';
import { BitacoraBuzoCondicionesAmbientales } from './sections/BitacoraBuzoCondicionesAmbientales';
import { BitacoraBuzoDatosTecnicos } from './sections/BitacoraBuzoDatosTecnicos';
import { BitacoraBuzoTiempos } from './sections/BitacoraBuzoTiempos';
import { BitacoraBuzoObjetivo } from './sections/BitacoraBuzoObjetivo';
import { BitacoraBuzoCondicionesCert } from './sections/BitacoraBuzoCondicionesCert';

interface BitacoraBuzoFormEnhancedProps {
  initialData?: Partial<BitacoraBuzoData>;
  onSubmit: (data: BitacoraBuzoData) => void;
  onCancel: () => void;
}

export const BitacoraBuzoFormEnhanced: React.FC<BitacoraBuzoFormEnhancedProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const { formData, setFormData } = useBitacoraBuzoForm(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as BitacoraBuzoData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bitácora del Buzo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <BitacoraBuzoIdentificacion formData={formData} setFormData={setFormData} />
            <BitacoraBuzoDatosGenerales formData={formData} setFormData={setFormData} />
            <BitacoraBuzoDatosBuzo formData={formData} setFormData={setFormData} />
            <BitacoraBuzoDatosSupervisor formData={formData} setFormData={setFormData} />
            <BitacoraBuzoContactos formData={formData} setFormData={setFormData} />
            <BitacoraBuzoCondicionesAmbientales formData={formData} setFormData={setFormData} />
            <BitacoraBuzoDatosTecnicos formData={formData} setFormData={setFormData} />
            <BitacoraBuzoTiempos formData={formData} setFormData={setFormData} />
            <BitacoraBuzoObjetivo formData={formData} setFormData={setFormData} />
            <BitacoraBuzoCondicionesCert formData={formData} setFormData={setFormData} />

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                Guardar Bitácora
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
