
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, X, AlertTriangle } from 'lucide-react';
import { HPTFormData } from '@/hooks/useHPTWizard';

interface HPTStep3Props {
  data: HPTFormData;
  onUpdate: (updates: Partial<HPTFormData>) => void;
}

export const HPTStep3: React.FC<HPTStep3Props> = ({ data, onUpdate }) => {
  const handleMedidasChange = (key: string, value: string) => {
    onUpdate({
      hpt_medidas: {
        ...data.hpt_medidas,
        [key]: value as 'si' | 'no' | 'na'
      }
    });
  };

  const handleRiesgosChange = (key: string, field: string, value: string) => {
    const currentItem = data.hpt_riesgos_comp[key] || { valor: 'na', acciones: '' };
    onUpdate({
      hpt_riesgos_comp: {
        ...data.hpt_riesgos_comp,
        [key]: {
          ...currentItem,
          [field]: value
        }
      }
    });
  };

  const medidasItems = [
    { key: 'listas_chequeo_erc_disponibles', label: '¿Están disponibles las listas de chequeo de ERC?' },
    { key: 'personal_competente_disponible', label: '¿El personal competente está disponible?' },
    { key: 'equipos_proteccion_disponibles', label: '¿Los equipos de protección están disponibles?' },
    { key: 'procedimientos_emergencia_conocidos', label: '¿Se conocen los procedimientos de emergencia?' },
    { key: 'comunicacion_establecida', label: '¿Se ha establecido la comunicación?' },
    { key: 'autorizaciones_vigentes', label: '¿Las autorizaciones están vigentes?' }
  ];

  const riesgosItems = [
    { key: 'condiciones_ambientales', label: 'Condiciones Ambientales' },
    { key: 'estado_equipos', label: 'Estado de Equipos' },
    { key: 'competencia_personal', label: 'Competencia del Personal' },
    { key: 'coordinacion_actividades', label: 'Coordinación de Actividades' },
    { key: 'comunicacion_riesgos', label: 'Comunicación de Riesgos' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Medidas Clave y Riesgos Complementarios</h2>
        <p className="mt-2 text-gray-600">
          Verificación de medidas de control y análisis de riesgos adicionales
        </p>
      </div>

      {/* Medidas Clave */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Medidas Clave para Ejecución
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {medidasItems.map((medida) => (
              <div key={medida.key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 border rounded-lg">
                <Label className="text-sm font-medium">
                  {medida.label}
                </Label>
                <div>
                  <Select 
                    value={data.hpt_medidas[medida.key] || ''} 
                    onValueChange={(value) => handleMedidasChange(medida.key, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Sí
                        </div>
                      </SelectItem>
                      <SelectItem value="no">
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-600" />
                          No
                        </div>
                      </SelectItem>
                      <SelectItem value="na">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-gray-600" />
                          N/A
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Riesgos Complementarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Riesgos Complementarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {riesgosItems.map((riesgo) => (
              <div key={riesgo.key} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <Label className="text-sm font-medium">
                    {riesgo.label}
                  </Label>
                  <div>
                    <Select 
                      value={data.hpt_riesgos_comp[riesgo.key]?.valor || ''} 
                      onValueChange={(value) => handleRiesgosChange(riesgo.key, 'valor', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="¿Presente?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="si">Sí</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="na">N/A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {data.hpt_riesgos_comp[riesgo.key]?.valor === 'si' && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium text-gray-700">
                      Acciones de Control
                    </Label>
                    <Textarea
                      value={data.hpt_riesgos_comp[riesgo.key]?.acciones || ''}
                      onChange={(e) => handleRiesgosChange(riesgo.key, 'acciones', e.target.value)}
                      placeholder="Describa las acciones de control implementadas..."
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-sm text-red-800">
            <strong>Crítico:</strong> Para cualquier medida marcada como "No" o riesgo presente, 
            se deben implementar acciones correctivas antes de proceder. Documente todas las acciones en los campos correspondientes.
          </div>
        </div>
      </div>
    </div>
  );
};
