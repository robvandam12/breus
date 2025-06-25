
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Settings, Network } from "lucide-react";
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
  const handleSelectionChange = (field: keyof typeof formData.seleccion_inicial, value: boolean) => {
    updateFormData({
      seleccion_inicial: {
        ...formData.seleccion_inicial,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Selección de Red */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Network className="w-4 h-4" />
            Tipo de Red
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="red_lober"
                checked={formData.seleccion_inicial.red_lober}
                onCheckedChange={(checked) => handleSelectionChange('red_lober', checked as boolean)}
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
                onCheckedChange={(checked) => handleSelectionChange('red_pecera', checked as boolean)}
                disabled={readOnly}
              />
              <Label htmlFor="red_pecera" className="text-sm font-medium">
                Pecera
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tipo de Faena */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="w-4 h-4" />
            Tipo de Faena
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="faena_instalacion"
                checked={formData.seleccion_inicial.faena_instalacion}
                onCheckedChange={(checked) => handleSelectionChange('faena_instalacion', checked as boolean)}
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
                onCheckedChange={(checked) => handleSelectionChange('faena_cambio', checked as boolean)}
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
                onCheckedChange={(checked) => handleSelectionChange('faena_retiro', checked as boolean)}
                disabled={readOnly}
              />
              <Label htmlFor="faena_retiro" className="text-sm font-medium">
                Retiro
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Instrucciones:</strong> Seleccione el tipo de red y la faena que se realizará. 
          Debe seleccionar al menos una opción de cada categoría para continuar.
        </p>
      </div>
    </div>
  );
};

