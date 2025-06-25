
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Settings } from "lucide-react";
import type { FishingNetworkMaintenanceData } from '@/types/fishing-networks';

interface Step3EquipoInmersionProps {
  formData: FishingNetworkMaintenanceData;
  updateFormData: (updates: Partial<FishingNetworkMaintenanceData>) => void;
  readOnly?: boolean;
}

export const Step3EquipoInmersion = ({ formData, updateFormData, readOnly = false }: Step3EquipoInmersionProps) => {
  const handleChange = (field: string, value: string | number) => {
    updateFormData({
      equipo_inmersion: {
        ...formData.equipo_inmersion,
        [field]: value
      }
    });
  };

  const equipoData = formData.equipo_inmersion || {
    equipo: 'liviano' as const,
    hora_inicio: '',
    hora_termino: '',
    profundidad: 0,
    horometro_inicio: 0,
    horometro_termino: 0
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Datos de Equipo por Inmersión
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Equipo</Label>
            <RadioGroup
              value={equipoData.equipo}
              onValueChange={(value) => handleChange('equipo', value)}
              disabled={readOnly}
              className="flex gap-6"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hora_inicio">Hora inicio</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={equipoData.hora_inicio}
                onChange={(e) => handleChange('hora_inicio', e.target.value)}
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora_termino">Hora término</Label>
              <Input
                id="hora_termino"
                type="time"
                value={equipoData.hora_termino}
                onChange={(e) => handleChange('hora_termino', e.target.value)}
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profundidad">Profundidad (m)</Label>
              <Input
                id="profundidad"
                type="number"
                value={equipoData.profundidad || ''}
                onChange={(e) => handleChange('profundidad', Number(e.target.value))}
                placeholder="0"
                min="0"
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horometro_inicio">Horómetro inicio</Label>
              <Input
                id="horometro_inicio"
                type="number"
                value={equipoData.horometro_inicio || ''}
                onChange={(e) => handleChange('horometro_inicio', Number(e.target.value))}
                placeholder="0"
                min="0"
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="horometro_termino">Horómetro término</Label>
              <Input
                id="horometro_termino"
                type="number"
                value={equipoData.horometro_termino || ''}
                onChange={(e) => handleChange('horometro_termino', Number(e.target.value))}
                placeholder="0"
                min="0"
                disabled={readOnly}
                className="md:max-w-sm"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
