
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";
import type { NetworkInstallationData } from '@/types/fishing-networks';

interface NetworkInstallationStep6Props {
  formData: NetworkInstallationData;
  updateFormData: (updates: Partial<NetworkInstallationData>) => void;
  readOnly?: boolean;
}

export const NetworkInstallationStep6 = ({ 
  formData, 
  updateFormData, 
  readOnly = false 
}: NetworkInstallationStep6Props) => {
  const handleChange = (value: string) => {
    updateFormData({
      observaciones_generales: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Observaciones Generales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="observaciones_generales">
            Observaciones de la faena de instalación/cambio de redes
          </Label>
          <Textarea
            id="observaciones_generales"
            value={formData.observaciones_generales || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Describa cualquier observación relevante sobre la instalación/cambio de redes, incidentes, condiciones especiales, materiales utilizados, etc."
            className="min-h-[200px] w-full"
            disabled={readOnly}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Sugerencias para las observaciones:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Estado de las redes instaladas o cambiadas</li>
            <li>• Materiales y herramientas utilizados</li>
            <li>• Dificultades encontradas durante la faena</li>
            <li>• Condiciones ambientales durante el trabajo</li>
            <li>• Recomendaciones para futuras instalaciones</li>
            <li>• Calidad de las uniones y costuras realizadas</li>
          </ul>
        </div>

        <div className="text-sm text-gray-500">
          <p>
            <strong>Caracteres:</strong> {formData.observaciones_generales?.length || 0}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

