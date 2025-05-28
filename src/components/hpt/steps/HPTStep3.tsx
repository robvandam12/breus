
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CheckCircle, Shield } from "lucide-react";

interface HPTStep3Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep3 = ({ data, onUpdate }: HPTStep3Props) => {
  const ercItems = [
    { key: 'izaje', label: 'Trabajos de Izaje' },
    { key: 'buceo', label: 'Trabajos de Buceo' },
    { key: 'navegacion', label: 'Navegación' },
    { key: 'trabajo_altura', label: 'Trabajo en Altura' },
    { key: 'espacios_confinados', label: 'Espacios Confinados' },
    { key: 'energia_peligrosa', label: 'Energía Peligrosa' },
    { key: 'materiales_peligrosos', label: 'Materiales Peligrosos' }
  ];

  const handleERCChange = (key: string, checked: boolean) => {
    const updatedERC = {
      ...data.hpt_erc,
      [key]: checked
    };
    onUpdate({ hpt_erc: updatedERC });
  };

  const handleOtrosChange = (value: string) => {
    const updatedERC = {
      ...data.hpt_erc,
      otros: value
    };
    onUpdate({ hpt_erc: updatedERC });
  };

  const selectedCount = ercItems.filter(item => data.hpt_erc?.[item.key]).length;
  const hasOtros = data.hpt_erc?.otros && data.hpt_erc.otros.trim().length > 0;
  const isValid = selectedCount > 0 || hasOtros;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Estándares de Riesgos Críticos</h2>
        <p className="mt-2 text-gray-600">
          Seleccione todos los ERC que aplican a esta actividad
        </p>
      </div>

      {/* Status indicator */}
      <div className={`p-4 rounded-lg border ${isValid ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
        <div className="flex items-center gap-2">
          {isValid ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          )}
          <span className={`font-medium ${isValid ? 'text-green-800' : 'text-yellow-800'}`}>
            {isValid 
              ? `${selectedCount} ERC seleccionados${hasOtros ? ' + otros' : ''}`
              : 'Debe seleccionar al menos un ERC'
            }
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            Estándares de Riesgos Críticos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ercItems.map((item) => (
              <div key={item.key} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={item.key}
                  checked={data.hpt_erc?.[item.key] || false}
                  onCheckedChange={(checked) => handleERCChange(item.key, checked as boolean)}
                />
                <Label htmlFor={item.key} className="flex-1 cursor-pointer font-medium">
                  {item.label}
                </Label>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <Label htmlFor="erc_otros" className="text-sm font-medium text-gray-700">
              Otros ERC (especifique)
            </Label>
            <Textarea
              id="erc_otros"
              value={data.hpt_erc?.otros || ''}
              onChange={(e) => handleOtrosChange(e.target.value)}
              placeholder="Especifique otros estándares de riesgos críticos que apliquen..."
              className="mt-2"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800">
            <strong>Importante:</strong> Los Estándares de Riesgos Críticos (ERC) son actividades que, 
            si no se ejecutan correctamente, pueden resultar en fatalidades o lesiones graves. 
            Seleccione todos los que apliquen para esta tarea específica.
          </div>
        </div>
      </div>
    </div>
  );
};
