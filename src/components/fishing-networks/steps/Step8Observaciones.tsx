
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";
import type { FishingNetworkMaintenanceData } from '@/types/fishing-networks';

interface Step8ObservacionesProps {
  formData: FishingNetworkMaintenanceData;
  updateFormData: (updates: Partial<FishingNetworkMaintenanceData>) => void;
  readOnly?: boolean;
}

export const Step8Observaciones = ({ formData, updateFormData, readOnly = false }: Step8ObservacionesProps) => {
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
            Observaciones generales de la jornada
          </Label>
          <Textarea
            id="observaciones_generales"
            value={formData.observaciones_generales || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Describa cualquier observación relevante sobre la jornada de trabajo, incidentes, condiciones especiales, recomendaciones, etc."
            className="min-h-[200px] w-full"
            disabled={readOnly}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Sugerencias para las observaciones:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Condiciones ambientales especiales observadas</li>
            <li>• Estado general de las redes y equipos</li>
            <li>• Incidentes o situaciones relevantes</li>
            <li>• Recomendaciones para futuras faenas</li>
            <li>• Desempeño del equipo de trabajo</li>
            <li>• Necesidades de materiales o equipos adicionales</li>
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
