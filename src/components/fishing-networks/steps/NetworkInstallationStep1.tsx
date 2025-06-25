
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Network } from "lucide-react";
import type { NetworkInstallationData } from '@/types/fishing-networks';

interface NetworkInstallationStep1Props {
  formData: NetworkInstallationData;
  updateFormData: (updates: Partial<NetworkInstallationData>) => void;
  readOnly?: boolean;
}

export const NetworkInstallationStep1 = ({ 
  formData, 
  updateFormData, 
  readOnly = false 
}: NetworkInstallationStep1Props) => {
  const handleRedChange = (type: 'red_lober' | 'red_pecera', checked: boolean) => {
    updateFormData({
      seleccion_inicial: {
        ...formData.seleccion_inicial,
        [type]: checked
      }
    });
  };

  const handleFaenaChange = (type: 'faena_instalacion' | 'faena_cambio' | 'faena_retiro', checked: boolean) => {
    updateFormData({
      seleccion_inicial: {
        ...formData.seleccion_inicial,
        [type]: checked
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="w-5 h-5" />
          Selección Inicial
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tipo de Red */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Tipo de Red</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="red_lober"
                  checked={formData.seleccion_inicial.red_lober}
                  onCheckedChange={(checked) => handleRedChange('red_lober', checked as boolean)}
                  disabled={readOnly}
                />
                <Label htmlFor="red_lober" className="text-sm font-medium">
                  Lober
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="red_pecera"
                  checked={formData.seleccion_inicial.red_pecera}
                  onCheckedChange={(checked) => handleRedChange('red_pecera', checked as boolean)}
                  disabled={readOnly}
                />
                <Label htmlFor="red_pecera" className="text-sm font-medium">
                  Pecera
                </Label>
              </div>
            </div>
          </div>

          {/* Tipo de Faena */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Tipo de Faena</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="faena_instalacion"
                  checked={formData.seleccion_inicial.faena_instalacion}
                  onCheckedChange={(checked) => handleFaenaChange('faena_instalacion', checked as boolean)}
                  disabled={readOnly}
                />
                <Label htmlFor="faena_instalacion" className="text-sm font-medium">
                  Instalación
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="faena_cambio"
                  checked={formData.seleccion_inicial.faena_cambio}
                  onCheckedChange={(checked) => handleFaenaChange('faena_cambio', checked as boolean)}
                  disabled={readOnly}
                />
                <Label htmlFor="faena_cambio" className="text-sm font-medium">
                  Cambio
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="faena_retiro"
                  checked={formData.seleccion_inicial.faena_retiro}
                  onCheckedChange={(checked) => handleFaenaChange('faena_retiro', checked as boolean)}
                  disabled={readOnly}
                />
                <Label htmlFor="faena_retiro" className="text-sm font-medium">
                  Retiro
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Validación visual */}
        <div className="space-y-2">
          {(!formData.seleccion_inicial.red_lober && !formData.seleccion_inicial.red_pecera) && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              ⚠️ Debe seleccionar al menos un tipo de red
            </div>
          )}
          {(!formData.seleccion_inicial.faena_instalacion && !formData.seleccion_inicial.faena_cambio && !formData.seleccion_inicial.faena_retiro) && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              ⚠️ Debe seleccionar al menos un tipo de faena
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
