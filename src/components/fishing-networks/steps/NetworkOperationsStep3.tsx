
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Settings } from "lucide-react";
import type { NetworkOperationsData } from '@/types/fishing-networks';

interface NetworkOperationsStep3Props {
  formData: NetworkOperationsData;
  updateFormData: (updates: Partial<NetworkOperationsData>) => void;
  readOnly?: boolean;
}

export const NetworkOperationsStep3 = ({ 
  formData, 
  updateFormData, 
  readOnly = false 
}: NetworkOperationsStep3Props) => {
  const handleInputChange = (field: keyof typeof formData.equipo_inmersion, value: string | number) => {
    updateFormData({
      equipo_inmersion: {
        ...formData.equipo_inmersion,
        [field]: value
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Equipo de Inmersión
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">Tipo de Equipo</Label>
            <RadioGroup
              value={formData.equipo_inmersion.equipo}
              onValueChange={(value) => handleInputChange('equipo', value as 'liviano' | 'mediano')}
              disabled={readOnly}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="liviano" id="liviano" />
                <Label htmlFor="liviano">Liviano</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mediano" id="mediano" />
                <Label htmlFor="mediano">Mediano</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="hora_inicio">Hora inicio</Label>
                <Input
                  id="hora_inicio"
                  type="time"
                  value={formData.equipo_inmersion.hora_inicio}
                  onChange={(e) => handleInputChange('hora_inicio', e.target.value)}
                  disabled={readOnly}
                />
              </div>

              <div>
                <Label htmlFor="hora_termino">Hora término</Label>
                <Input
                  id="hora_termino"
                  type="time"
                  value={formData.equipo_inmersion.hora_termino}
                  onChange={(e) => handleInputChange('hora_termino', e.target.value)}
                  disabled={readOnly}
                />
              </div>

              <div>
                <Label htmlFor="profundidad">Profundidad (m)</Label>
                <Input
                  id="profundidad"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.equipo_inmersion.profundidad}
                  onChange={(e) => handleInputChange('profundidad', parseFloat(e.target.value) || 0)}
                  disabled={readOnly}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="horometro_inicio">Horómetro inicio</Label>
                <Input
                  id="horometro_inicio"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.equipo_inmersion.horometro_inicio}
                  onChange={(e) => handleInputChange('horometro_inicio', parseFloat(e.target.value) || 0)}
                  disabled={readOnly}
                />
              </div>

              <div>
                <Label htmlFor="horometro_termino">Horómetro término</Label>
                <Input
                  id="horometro_termino"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.equipo_inmersion.horometro_termino}
                  onChange={(e) => handleInputChange('horometro_termino', parseFloat(e.target.value) || 0)}
                  disabled={readOnly}
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Información del Equipo</p>
                <p className="text-sm text-blue-700">
                  Registre los datos del equipo de inmersión utilizado durante la faena, 
                  incluyendo horarios, profundidad y lecturas del horómetro.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
