
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import type { FishingNetworkMaintenanceData } from '@/types/fishing-networks';

interface Step1DatosGeneralesProps {
  formData: FishingNetworkMaintenanceData;
  updateFormData: (updates: Partial<FishingNetworkMaintenanceData>) => void;
  readOnly?: boolean;
}

export const Step1DatosGenerales = ({ formData, updateFormData, readOnly = false }: Step1DatosGeneralesProps) => {
  const handleChange = (field: string, value: string | number) => {
    updateFormData({
      datos_generales: {
        ...formData.datos_generales,
        [field]: value
      }
    });
  };

  const estadosPuerto = [
    'Calmo',
    'Leve marejada',
    'Marejada moderada',
    'Marejada fuerte',
    'Temporal'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Datos Generales de la Faena
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lugar_trabajo">Lugar de trabajo (Centro u otro)</Label>
            <Input
              id="lugar_trabajo"
              value={formData.datos_generales?.lugar_trabajo || ''}
              onChange={(e) => handleChange('lugar_trabajo', e.target.value)}
              placeholder="Ingrese lugar de trabajo"
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={formData.datos_generales?.fecha || ''}
              onChange={(e) => handleChange('fecha', e.target.value)}
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hora_inicio_faena">Hora inicio faena</Label>
            <Input
              id="hora_inicio_faena"
              type="time"
              value={formData.datos_generales?.hora_inicio_faena || ''}
              onChange={(e) => handleChange('hora_inicio_faena', e.target.value)}
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hora_termino_faena">Hora término faena</Label>
            <Input
              id="hora_termino_faena"
              type="time"
              value={formData.datos_generales?.hora_termino_faena || ''}
              onChange={(e) => handleChange('hora_termino_faena', e.target.value)}
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profundidad_maxima">Profundidad máxima (m)</Label>
            <Input
              id="profundidad_maxima"
              type="number"
              value={formData.datos_generales?.profundidad_maxima || ''}
              onChange={(e) => handleChange('profundidad_maxima', Number(e.target.value))}
              placeholder="0"
              min="0"
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperatura">Temperatura (°C)</Label>
            <Input
              id="temperatura"
              type="number"
              value={formData.datos_generales?.temperatura || ''}
              onChange={(e) => handleChange('temperatura', Number(e.target.value))}
              placeholder="0"
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nave_maniobras">Nave Maniobras</Label>
            <Input
              id="nave_maniobras"
              value={formData.datos_generales?.nave_maniobras || ''}
              onChange={(e) => handleChange('nave_maniobras', e.target.value)}
              placeholder="Nombre de la nave"
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="matricula_nave">Matrícula nave</Label>
            <Input
              id="matricula_nave"
              value={formData.datos_generales?.matricula_nave || ''}
              onChange={(e) => handleChange('matricula_nave', e.target.value)}
              placeholder="Matrícula"
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado_puerto">Estado de puerto</Label>
            <Select
              value={formData.datos_generales?.estado_puerto || ''}
              onValueChange={(value) => handleChange('estado_puerto', value)}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione estado" />
              </SelectTrigger>
              <SelectContent>
                {estadosPuerto.map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
