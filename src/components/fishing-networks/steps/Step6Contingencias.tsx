
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import type { FishingNetworkMaintenanceData } from '@/types/fishing-networks';

interface Step6ContingenciasProps {
  formData: FishingNetworkMaintenanceData;
  updateFormData: (updates: Partial<FishingNetworkMaintenanceData>) => void;
  readOnly?: boolean;
}

export const Step6Contingencias = ({ formData, updateFormData, readOnly = false }: Step6ContingenciasProps) => {
  const handleChange = (field: string, value: boolean | string) => {
    updateFormData({
      contingencias: {
        ...formData.contingencias,
        [field]: value
      }
    });
  };

  const contingenciasData = formData.contingencias || {
    bloom_algas: false,
    enfermedad_peces: false,
    marea_roja: false,
    manejo_cambio_redes: false,
    otro: ''
  };

  const contingenciasItems = [
    { key: 'bloom_algas', label: 'BLOOM algas' },
    { key: 'enfermedad_peces', label: 'Enfermedad de peces' },
    { key: 'marea_roja', label: 'Marea roja' },
    { key: 'manejo_cambio_redes', label: 'Manejo / cambio de redes' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          Contingencias de Mortalidad
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contingenciasItems.map((item) => (
            <div key={item.key} className="flex items-center space-x-3">
              <Checkbox
                id={item.key}
                checked={contingenciasData[item.key as keyof typeof contingenciasData] as boolean}
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

        <div className="space-y-2">
          <Label htmlFor="otro_contingencia">Otro (especifique)</Label>
          <Textarea
            id="otro_contingencia"
            value={contingenciasData.otro}
            onChange={(e) => handleChange('otro', e.target.value)}
            placeholder="Describa otras contingencias de mortalidad que se hayan presentado..."
            className="min-h-[100px]"
            disabled={readOnly}
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Importante</p>
              <p className="text-sm text-yellow-700">
                Las contingencias de mortalidad son eventos que pueden afectar la salud de los peces 
                y requieren acciones específicas durante las faenas de mantención de redes.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
