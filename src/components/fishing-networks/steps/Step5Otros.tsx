
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckSquare } from "lucide-react";
import type { FishingNetworkMaintenanceData } from '@/types/fishing-networks';

interface Step5OtrosProps {
  formData: FishingNetworkMaintenanceData;
  updateFormData: (updates: Partial<FishingNetworkMaintenanceData>) => void;
  readOnly?: boolean;
}

export const Step5Otros = ({ formData, updateFormData, readOnly = false }: Step5OtrosProps) => {
  const handleChange = (field: string, value: boolean) => {
    updateFormData({
      otros: {
        ...formData.otros,
        [field]: value
      }
    });
  };

  const otrosData = formData.otros || {
    navegacion_relevo: false,
    cableado_perfilada_buceo: false,
    revision_documental: false,
    relevo: false
  };

  const otrosItems = [
    { key: 'navegacion_relevo', label: 'Navegación por relevo' },
    { key: 'cableado_perfilada_buceo', label: 'Cableado con perfilada de buceo' },
    { key: 'revision_documental', label: 'Revisión documental' },
    { key: 'relevo', label: 'Relevo' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5" />
          Otros - Check-list Global
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otrosItems.map((item) => (
            <div key={item.key} className="flex items-center space-x-3">
              <Checkbox
                id={item.key}
                checked={otrosData[item.key as keyof typeof otrosData]}
                onCheckedChange={(checked) => handleChange(item.key, checked as boolean)}
                disabled={readOnly}
              />
              <Label 
                htmlFor={item.key} 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item.label}
              </Label>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Nota:</strong> Este check-list aplica a toda la jornada de trabajo. 
            Marque las actividades que se realizaron durante la faena.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
