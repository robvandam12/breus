
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { HPTWizardData } from '@/hooks/useHPTWizard';

interface HPTStep3Props {
  data: HPTWizardData;
  onUpdate: (updates: Partial<HPTWizardData>) => void;
}

export const HPTStep3: React.FC<HPTStep3Props> = ({ data, onUpdate }) => {
  const handleERCChange = (item: string, checked: boolean) => {
    updateData({
      hpt_erc: {
        ...data.hpt_erc,
        [item]: checked
      }
    });
  };

  const updateData = (updates: Partial<HPTWizardData>) => {
    onUpdate(updates);
  };

  const ercItems = [
    { key: 'izaje', label: 'Izaje y Grúas' },
    { key: 'buceo', label: 'Buceo y Trabajo Subacuático' },
    { key: 'navegacion', label: 'Navegación Marítima' },
    { key: 'trabajo_altura', label: 'Trabajo en Altura' },
    { key: 'espacios_confinados', label: 'Espacios Confinados' },
    { key: 'energia_peligrosa', label: 'Energía Peligrosa' },
    { key: 'materiales_peligrosos', label: 'Materiales Peligrosos' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Estándares de Riesgos Críticos</h2>
        <p className="mt-2 text-gray-600">
          Identificación de estándares aplicables y riesgos críticos para la operación
        </p>
      </div>

      {/* ERC */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Estándares de Riesgos Críticos (ERC)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ercItems.map((item) => (
              <div key={item.key} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={`erc_${item.key}`}
                  checked={data.hpt_erc[item.key] || false}
                  onCheckedChange={(checked) => handleERCChange(item.key, checked as boolean)}
                />
                <Label htmlFor={`erc_${item.key}`} className="text-sm font-medium cursor-pointer flex-1">
                  {item.label}
                </Label>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Label htmlFor="erc_otros">Otros ERC</Label>
            <Input
              id="erc_otros"
              value={data.hpt_erc.otros || ''}
              onChange={(e) => updateData({
                hpt_erc: { ...data.hpt_erc, otros: e.target.value }
              })}
              placeholder="Especifique otros estándares de riesgos críticos..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-sm text-amber-800">
            <strong>Importante:</strong> Identifique todos los estándares de riesgos críticos aplicables a esta operación. 
            Los estándares seleccionados determinarán las medidas de control necesarias para la operación.
          </div>
        </div>
      </div>
    </div>
  );
};
