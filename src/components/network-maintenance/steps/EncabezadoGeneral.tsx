
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Thermometer } from "lucide-react";
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

export interface EncabezadoGeneralProps {
  formData: NetworkMaintenanceData;
  updateFormData: (updates: Partial<NetworkMaintenanceData>) => void;
  readOnly?: boolean;
}

export const EncabezadoGeneral = ({ formData, updateFormData, readOnly = false }: EncabezadoGeneralProps) => {
  const handleInputChange = (field: keyof NetworkMaintenanceData, value: any) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Encabezado General
        </h3>
        <p className="text-sm text-gray-600">
          Información básica de la faena de mantención
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datos Generales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lugar_trabajo">Lugar de trabajo (centro u otro)</Label>
              <Input
                id="lugar_trabajo"
                value={formData.lugar_trabajo}
                onChange={(e) => handleInputChange('lugar_trabajo', e.target.value)}
                placeholder="Ej: Centro Salmón Norte"
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => handleInputChange('fecha', e.target.value)}
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="temperatura">Temperatura (°C)</Label>
              <Input
                id="temperatura"
                type="number"
                value={formData.temperatura}
                onChange={(e) => handleInputChange('temperatura', Number(e.target.value))}
                placeholder="0"
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="profundidad_max">Profundidad máxima (m)</Label>
              <Input
                id="profundidad_max"
                type="number"
                value={formData.profundidad_max}
                onChange={(e) => handleInputChange('profundidad_max', Number(e.target.value))}
                placeholder="0"
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hora_inicio">Hora inicio faena</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => handleInputChange('hora_inicio', e.target.value)}
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="hora_termino">Hora término faena</Label>
              <Input
                id="hora_termino"
                type="time"
                value={formData.hora_termino}
                onChange={(e) => handleInputChange('hora_termino', e.target.value)}
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nave_maniobras">Nave maniobras</Label>
              <Input
                id="nave_maniobras"
                value={formData.nave_maniobras}
                onChange={(e) => handleInputChange('nave_maniobras', e.target.value)}
                placeholder="Nombre de la embarcación"
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="matricula_nave">Matrícula nave</Label>
              <Input
                id="matricula_nave"
                value={formData.matricula_nave}
                onChange={(e) => handleInputChange('matricula_nave', e.target.value)}
                placeholder="Matrícula de la embarcación"
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="team_s">Team S</Label>
              <Input
                id="team_s"
                value={formData.team_s}
                onChange={(e) => handleInputChange('team_s', e.target.value)}
                placeholder="Team S"
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="team_be">Team BE</Label>
              <Input
                id="team_be"
                value={formData.team_be}
                onChange={(e) => handleInputChange('team_be', e.target.value)}
                placeholder="Team BE"
                disabled={readOnly}
              />
            </div>

            <div>
              <Label htmlFor="team_bi">Team BI</Label>
              <Input
                id="team_bi"
                value={formData.team_bi}
                onChange={(e) => handleInputChange('team_bi', e.target.value)}
                placeholder="Team BI"
                disabled={readOnly}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="estado_puerto">Estado de puerto</Label>
            <Input
              id="estado_puerto"
              value={formData.estado_puerto}
              onChange={(e) => handleInputChange('estado_puerto', e.target.value)}
              placeholder="Ej: Bueno, Regular, Malo"
              disabled={readOnly}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
