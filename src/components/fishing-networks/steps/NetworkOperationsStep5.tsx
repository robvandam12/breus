
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";
import type { NetworkOperationsData } from '@/types/fishing-networks';

interface NetworkOperationsStep5Props {
  formData: NetworkOperationsData;
  updateFormData: (updates: Partial<NetworkOperationsData>) => void;
  readOnly?: boolean;
}

export const NetworkOperationsStep5 = ({ 
  formData, 
  updateFormData, 
  readOnly = false 
}: NetworkOperationsStep5Props) => {
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
            Observaciones de la faena de redes
          </Label>
          <Textarea
            id="observaciones_generales"
            value={formData.observaciones_generales || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Describa cualquier observación relevante sobre la faena de redes, condiciones encontradas, trabajos realizados, incidentes, etc."
            className="min-h-[200px] w-full"
            disabled={readOnly}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Sugerencias para las observaciones:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Estado general de las redes revisadas</li>
            <li>• Trabajos de mantenimiento realizados</li>
            <li>• Condiciones ambientales durante la faena</li>
            <li>• Funcionamiento del equipo de inmersión</li>
            <li>• Desempeño del equipo de trabajo</li>
            <li>• Recomendaciones para futuras faenas</li>
            <li>• Materiales o equipos necesarios</li>
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

