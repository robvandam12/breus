
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Shield } from "lucide-react";
import { HPTWizardData } from '@/hooks/useHPTWizard';

interface HPTStep3Props {
  data: HPTWizardData;
  onUpdate: (updates: Partial<HPTWizardData>) => void;
}

export const HPTStep3: React.FC<HPTStep3Props> = ({ data, onUpdate }) => {
  const handleERCChange = (field: keyof typeof data.hpt_erc, checked: boolean | string) => {
    onUpdate({
      hpt_erc: {
        ...data.hpt_erc,
        [field]: checked
      }
    });
  };

  const ercOptions = [
    {
      id: 'buceo',
      label: 'Buceo',
      description: 'Actividades de inmersión y trabajo subacuático',
      icon: '🤿'
    },
    {
      id: 'izaje',
      label: 'Izaje y Manejo de Cargas',
      description: 'Levantamiento y manipulación de equipos pesados',
      icon: '🏗️'
    },
    {
      id: 'navegacion',
      label: 'Navegación',
      description: 'Operación de embarcaciones y navegación marítima',
      icon: '⛵'
    },
    {
      id: 'trabajo_altura',
      label: 'Trabajo en Altura',
      description: 'Actividades realizadas sobre el nivel del mar',
      icon: '🧗'
    },
    {
      id: 'espacios_confinados',
      label: 'Espacios Confinados',
      description: 'Trabajo en espacios cerrados o restringidos',
      icon: '🚪'
    },
    {
      id: 'energia_peligrosa',
      label: 'Energía Peligrosa',
      description: 'Manejo de energía eléctrica, mecánica o hidráulica',
      icon: '⚡'
    },
    {
      id: 'materiales_peligrosos',
      label: 'Materiales Peligrosos',
      description: 'Manipulación de sustancias químicas o tóxicas',
      icon: '☢️'
    }
  ];

  const hasSelectedERC = ercOptions.some(option => data.hpt_erc[option.id as keyof typeof data.hpt_erc]) || data.hpt_erc.otros.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white shadow-lg mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Estándares de Riesgos Críticos (ERC)
        </h2>
        <p className="text-gray-600">
          Identifique todos los estándares de riesgos críticos aplicables a esta operación
        </p>
      </div>

      {!hasSelectedERC && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">
                Selección requerida
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                Debe seleccionar al menos un estándar de riesgo crítico para continuar.
              </p>
            </div>
          </div>
        </div>
      )}

      <Card className="ios-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-600" />
            Seleccione los ERC Aplicables
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ercOptions.map((option) => {
            const isChecked = data.hpt_erc[option.id as keyof typeof data.hpt_erc] as boolean;
            
            return (
              <div
                key={option.id}
                className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
                  isChecked
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                }`}
                onClick={() => handleERCChange(option.id as keyof typeof data.hpt_erc, !isChecked)}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => 
                      handleERCChange(option.id as keyof typeof data.hpt_erc, checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{option.icon}</span>
                      <Label className="text-base font-medium text-gray-900 cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="mt-6">
            <Label htmlFor="otros_erc" className="text-base font-medium">
              Otros ERC no listados
            </Label>
            <Textarea
              id="otros_erc"
              value={data.hpt_erc.otros}
              onChange={(e) => handleERCChange('otros', e.target.value)}
              className="mt-2 ios-input"
              placeholder="Especifique otros estándares de riesgos críticos aplicables..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {hasSelectedERC && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <Shield className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-green-800">
                ERC identificados correctamente
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Ha seleccionado los estándares de riesgos críticos aplicables. Puede continuar al siguiente paso.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
