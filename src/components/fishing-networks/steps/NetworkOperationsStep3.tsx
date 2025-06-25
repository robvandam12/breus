
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
  const handleEquipoChange = (field: keyof typeof formData.equipo_inmersion, value: string | number) => {
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
      <CardContent className="space-y-6">
        {/* Tipo de Equipo */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Tipo de Equipo</Label>
          <RadioGroup
            value={formData.equipo_inmersion.equipo}
            onValueChange={(value) => handleEquipoChange('equipo', value as 'liviano' | 'mediano')}
            disabled={readOnly}
            className="flex flex-row space-x-6"
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

        {/* Horarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hora_inicio">Hora inicio</Label>
            <Input
              id="hora_inicio"
              type="time"
              value={formData.equipo_inmersion.hora_inicio}
              onChange={(e) => handleEquipoChange('hora_inicio', e.target.value)}
              disabled={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hora_termino">Hora término</Label>
            <Input
              id="hora_termino"
              type="time"
              value={formData.equipo_inmersion.hora_termino}
              onChange={(e) => handleEquipoChange('hora_termino', e.target.value)}
              disabled={readOnly}
            />
          </div>
        </div>

        {/* Mediciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="profundidad">Profundidad (m)</Label>
            <Input
              id="profundidad"
              type="number"
              value={formData.equipo_inmersion.profundidad}
              onChange={(e) => handleEquipoChange('profundidad', Number(e.target.value))}
              min="0"
              disabled={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="horometro_inicio">Horómetro inicio</Label>
            <Input
              id="horometro_inicio"
              type="number"
              value={formData.equipo_inmersion.horometro_inicio}
              onChange={(e) => handleEquipoChange('horometro_inicio', Number(e.target.value))}
              min="0"
              disabled={readOnly}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="horometro_termino">Horómetro término</Label>
            <Input
              id="horometro_termino"
              type="number"
              value={formData.equipo_inmersion.horometro_termino}
              onChange={(e) => handleEquipoChange('horometro_termino', Number(e.target.value))}
              min="0"
              disabled={readOnly}
            />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Información:</strong> Registre los datos del equipo de inmersión utilizado durante la faena. 
            Los horómetros deben registrar las horas de funcionamiento del equipo.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

