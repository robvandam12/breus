
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shield } from 'lucide-react';
import { HPTWizardData } from '@/hooks/useHPTWizard';

interface HPTStep4Props {
  data: HPTWizardData;
  onUpdate: (updates: Partial<HPTWizardData>) => void;
}

export const HPTStep4: React.FC<HPTStep4Props> = ({ data, onUpdate }) => {
  const medidas = [
    { 
      id: 'listas_chequeo_erc_disponibles', 
      label: 'Listas de chequeo de ERC disponibles y revisadas'
    },
    { 
      id: 'personal_competente_disponible', 
      label: 'Personal competente y disponible para la operación'
    },
    { 
      id: 'equipos_proteccion_disponibles', 
      label: 'Equipos de protección específicos disponibles y en buen estado'
    },
    { 
      id: 'procedimientos_emergencia_conocidos', 
      label: 'Procedimientos de emergencia conocidos por el equipo'
    },
    { 
      id: 'comunicacion_establecida', 
      label: 'Sistema de comunicación establecido con todas las partes'
    },
    { 
      id: 'autorizaciones_vigentes', 
      label: 'Autorizaciones y/o permisos vigentes'
    }
  ];

  const handleMedidasChange = (id: string, value: 'si' | 'no' | 'na') => {
    onUpdate({
      hpt_medidas: {
        ...data.hpt_medidas,
        [id]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Medidas Clave de Control</h2>
        <p className="mt-2 text-gray-600">
          Verifique las medidas de control establecidas para mitigar riesgos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Medidas de Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {medidas.map((medida) => (
              <div key={medida.id} className="space-y-2">
                <Label className="text-base">{medida.label}</Label>
                <RadioGroup
                  value={data.hpt_medidas[medida.id] || 'na'}
                  onValueChange={(value) => handleMedidasChange(medida.id, value as 'si' | 'no' | 'na')}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="si" id={`${medida.id}-si`} className="text-green-500" />
                    <Label htmlFor={`${medida.id}-si`} className="cursor-pointer text-green-600">Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id={`${medida.id}-no`} className="text-red-500" />
                    <Label htmlFor={`${medida.id}-no`} className="cursor-pointer text-red-600">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="na" id={`${medida.id}-na`} className="text-gray-500" />
                    <Label htmlFor={`${medida.id}-na`} className="cursor-pointer text-gray-500">N/A</Label>
                  </div>
                </RadioGroup>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800">
            <strong>Medidas de Control:</strong> Las medidas seleccionadas como "No" requieren implementación 
            antes de iniciar la operación. Si alguna medida crítica no puede ser implementada, 
            la operación no debe iniciarse.
          </div>
        </div>
      </div>
    </div>
  );
};
