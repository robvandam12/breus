
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Clock, MapPin, Thermometer, Anchor } from "lucide-react";
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

interface EncabezadoGeneralProps {
  formData: NetworkMaintenanceData;
  updateFormData: (data: Partial<NetworkMaintenanceData>) => void;
  errors?: Record<string, string>;
}

export const EncabezadoGeneral = ({ 
  formData, 
  updateFormData, 
  errors = {} 
}: EncabezadoGeneralProps) => {
  
  const handleInputChange = (field: keyof NetworkMaintenanceData, value: any) => {
    updateFormData({ [field]: value });
  };

  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Encabezado General
        </h3>
        <p className="text-sm text-gray-600">
          Información básica de la operación de mantención de redes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información Básica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="lugar_trabajo">Lugar de Trabajo *</Label>
              <Input
                id="lugar_trabajo"
                value={formData.lugar_trabajo}
                onChange={(e) => handleInputChange('lugar_trabajo', e.target.value)}
                placeholder="Ej: Centro de Cultivo Punta Arenas"
                className={errors.lugar_trabajo ? 'border-red-500' : ''}
              />
              {errors.lugar_trabajo && (
                <p className="text-sm text-red-500 mt-1">{errors.lugar_trabajo}</p>
              )}
            </div>

            <div>
              <Label htmlFor="fecha">Fecha *</Label>
              <DatePicker
                date={parseDate(formData.fecha)}
                onDateChange={(date) => handleInputChange('fecha', formatDate(date))}
                placeholder="Seleccionar fecha"
              />
              {errors.fecha && (
                <p className="text-sm text-red-500 mt-1">{errors.fecha}</p>
              )}
            </div>

            <div>
              <Label htmlFor="estado_puerto">Estado del Puerto</Label>
              <Select
                value={formData.estado_puerto}
                onValueChange={(value) => handleInputChange('estado_puerto', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calmo">Calmo</SelectItem>
                  <SelectItem value="moderado">Moderado</SelectItem>
                  <SelectItem value="agitado">Agitado</SelectItem>
                  <SelectItem value="muy_agitado">Muy Agitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Condiciones Operativas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Thermometer className="h-4 w-4" />
              Condiciones Operativas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hora_inicio">Hora Inicio *</Label>
                <Input
                  id="hora_inicio"
                  type="time"
                  value={formData.hora_inicio}
                  onChange={(e) => handleInputChange('hora_inicio', e.target.value)}
                  className={errors.hora_inicio ? 'border-red-500' : ''}
                />
              </div>

              <div>
                <Label htmlFor="hora_termino">Hora Término</Label>
                <Input
                  id="hora_termino"
                  type="time"
                  value={formData.hora_termino}
                  onChange={(e) => handleInputChange('hora_termino', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="temperatura">Temperatura (°C)</Label>
                <Input
                  id="temperatura"
                  type="number"
                  step="0.1"
                  value={formData.temperatura}
                  onChange={(e) => handleInputChange('temperatura', parseFloat(e.target.value) || 0)}
                  placeholder="Ej: 15.5"
                />
              </div>

              <div>
                <Label htmlFor="profundidad_max">Profundidad Máxima (m)</Label>
                <Input
                  id="profundidad_max"
                  type="number"
                  step="0.1"
                  value={formData.profundidad_max}
                  onChange={(e) => handleInputChange('profundidad_max', parseFloat(e.target.value) || 0)}
                  placeholder="Ej: 25.0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de Nave y Equipos */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Anchor className="h-4 w-4" />
              Nave y Equipos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="nave_maniobras">Nave de Maniobras</Label>
                <Input
                  id="nave_maniobras"
                  value={formData.nave_maniobras}
                  onChange={(e) => handleInputChange('nave_maniobras', e.target.value)}
                  placeholder="Nombre de la nave"
                />
              </div>

              <div>
                <Label htmlFor="matricula_nave">Matrícula Nave</Label>
                <Input
                  id="matricula_nave"
                  value={formData.matricula_nave}
                  onChange={(e) => handleInputChange('matricula_nave', e.target.value)}
                  placeholder="Matrícula"
                />
              </div>

              <div>
                <Label htmlFor="team_s">Team S</Label>
                <Input
                  id="team_s"
                  value={formData.team_s}
                  onChange={(e) => handleInputChange('team_s', e.target.value)}
                  placeholder="Equipo S"
                />
              </div>

              <div>
                <Label htmlFor="team_be">Team BE</Label>
                <Input
                  id="team_be"
                  value={formData.team_be}
                  onChange={(e) => handleInputChange('team_be', e.target.value)}
                  placeholder="Equipo BE"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="team_bi">Team BI</Label>
              <Input
                id="team_bi"
                value={formData.team_bi}
                onChange={(e) => handleInputChange('team_bi', e.target.value)}
                placeholder="Equipo BI"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campos requeridos info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Campos Requeridos</p>
            <p className="text-sm text-blue-700 mt-1">
              Los campos marcados con (*) son obligatorios para continuar al siguiente paso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
