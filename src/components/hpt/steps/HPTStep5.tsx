
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';
import { HPTWizardData } from '@/hooks/useHPTWizard';

interface HPTStep5Props {
  data: HPTWizardData;
  onUpdate: (updates: Partial<HPTWizardData>) => void;
}

export const HPTStep5: React.FC<HPTStep5Props> = ({ data, onUpdate }) => {
  const riesgos = [
    { 
      id: 'condiciones_ambientales', 
      label: 'Las condiciones ambientales son favorables para la operación'
    },
    { 
      id: 'estado_equipos', 
      label: 'Los equipos y herramientas están en buen estado'
    },
    { 
      id: 'competencia_personal', 
      label: 'El personal cuenta con la competencia y capacitación requerida'
    },
    { 
      id: 'coordinacion_actividades', 
      label: 'Las actividades han sido coordinadas con todas las áreas involucradas'
    },
    { 
      id: 'comunicacion_riesgos', 
      label: 'Los riesgos han sido comunicados a todo el personal'
    }
  ];

  const handleRiesgoChange = (id: string, value: 'si' | 'no' | 'na') => {
    onUpdate({
      hpt_riesgos_comp: {
        ...data.hpt_riesgos_comp,
        [id]: { 
          ...data.hpt_riesgos_comp[id],
          valor: value 
        }
      }
    });
  };

  const handleAccionesChange = (id: string, acciones: string) => {
    onUpdate({
      hpt_riesgos_comp: {
        ...data.hpt_riesgos_comp,
        [id]: { 
          ...data.hpt_riesgos_comp[id],
          acciones 
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Riesgos Complementarios</h2>
        <p className="mt-2 text-gray-600">
          Identifique riesgos adicionales y defina acciones para abordarlos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Evaluación de Riesgos Complementarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {riesgos.map((riesgo) => {
              const riesgoData = data.hpt_riesgos_comp[riesgo.id] || { valor: 'na', acciones: '' };
              
              return (
                <div key={riesgo.id} className="space-y-3 p-4 border rounded-lg">
                  <div>
                    <Label className="text-base font-medium">{riesgo.label}</Label>
                    <RadioGroup
                      value={riesgoData.valor}
                      onValueChange={(value) => handleRiesgoChange(riesgo.id, value as 'si' | 'no' | 'na')}
                      className="flex space-x-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="si" id={`${riesgo.id}-si`} className="text-green-500" />
                        <Label htmlFor={`${riesgo.id}-si`} className="cursor-pointer text-green-600">Sí</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`${riesgo.id}-no`} className="text-red-500" />
                        <Label htmlFor={`${riesgo.id}-no`} className="cursor-pointer text-red-600">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="na" id={`${riesgo.id}-na`} className="text-gray-500" />
                        <Label htmlFor={`${riesgo.id}-na`} className="cursor-pointer text-gray-500">N/A</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {riesgoData.valor === 'no' && (
                    <div>
                      <Label htmlFor={`${riesgo.id}-acciones`} className="text-sm">
                        Acciones correctivas necesarias
                      </Label>
                      <Textarea
                        id={`${riesgo.id}-acciones`}
                        value={riesgoData.acciones || ''}
                        onChange={(e) => handleAccionesChange(riesgo.id, e.target.value)}
                        placeholder="Describa las acciones a implementar..."
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-sm text-amber-800">
            <strong>Importante:</strong> Para cada riesgo identificado como "No", es obligatorio 
            definir acciones correctivas. Estas acciones deben ser implementadas antes de iniciar 
            la operación para garantizar la seguridad del personal y el éxito de la tarea.
          </div>
        </div>
      </div>
    </div>
  );
};
