
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, MapPin, Calendar, Clock, Thermometer, Ship, Anchor } from "lucide-react";
import type { NetworkMaintenanceFormProps } from '@/types/network-maintenance';

export const EncabezadoGeneral = ({ 
  formData, 
  updateFormData, 
  errors = {} 
}: NetworkMaintenanceFormProps) => {
  
  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Información General de la Operación
        </h3>
        <p className="text-sm text-gray-600">
          Completa los datos básicos de la operación de mantención de redes
        </p>
      </div>

      {/* Información Básica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Datos Operacionales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="lugar_trabajo" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                Lugar de Trabajo *
              </Label>
              <Input
                id="lugar_trabajo"
                value={formData.lugar_trabajo}
                onChange={(e) => handleInputChange('lugar_trabajo', e.target.value)}
                placeholder="Ej: Centro Cultivo Bahía Norte"
                className={errors.lugar_trabajo ? 'border-red-500' : ''}
              />
              {errors.lugar_trabajo && (
                <p className="text-sm text-red-600">{errors.lugar_trabajo}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                Fecha *
              </Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => handleInputChange('fecha', e.target.value)}
                className={errors.fecha ? 'border-red-500' : ''}
              />
              {errors.fecha && (
                <p className="text-sm text-red-600">{errors.fecha}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora_inicio" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                Hora Inicio
              </Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => handleInputChange('hora_inicio', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora_termino" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                Hora Término
              </Label>
              <Input
                id="hora_termino"
                type="time"
                value={formData.hora_termino}
                onChange={(e) => handleInputChange('hora_termino', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperatura" className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-gray-500" />
                Temperatura Agua (°C)
              </Label>
              <Input
                id="temperatura"
                type="number"
                step="0.1"
                value={formData.temperatura}
                onChange={(e) => handleInputChange('temperatura', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profundidad_max" className="flex items-center gap-2">
                <Anchor className="h-4 w-4 text-gray-500" />
                Profundidad Máxima (m)
              </Label>
              <Input
                id="profundidad_max"
                type="number"
                step="0.1"
                value={formData.profundidad_max}
                onChange={(e) => handleInputChange('profundidad_max', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de Embarcación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Ship className="h-4 w-4" />
            Embarcación y Logística
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nave_maniobras">Nave de Maniobras</Label>
              <Input
                id="nave_maniobras"
                value={formData.nave_maniobras}
                onChange={(e) => handleInputChange('nave_maniobras', e.target.value)}
                placeholder="Nombre de la embarcación"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="matricula_nave">Matrícula de Nave</Label>
              <Input
                id="matricula_nave"
                value={formData.matricula_nave}
                onChange={(e) => handleInputChange('matricula_nave', e.target.value)}
                placeholder="Matrícula oficial"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado_puerto">Estado del Puerto</Label>
              <Select
                value={formData.estado_puerto}
                onValueChange={(value) => handleInputChange('estado_puerto', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bueno">Bueno</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="malo">Malo</SelectItem>
                  <SelectItem value="cerrado">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de Teams */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Configuración de Teams
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="team_s">Team S (Supervisor)</Label>
              <Input
                id="team_s"
                value={formData.team_s}
                onChange={(e) => handleInputChange('team_s', e.target.value)}
                placeholder="Configuración Team S"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team_be">Team BE (Buzo Especialista)</Label>
              <Input
                id="team_be"
                value={formData.team_be}
                onChange={(e) => handleInputChange('team_be', e.target.value)}
                placeholder="Configuración Team BE"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team_bi">Team BI (Buzo Industrial)</Label>
              <Input
                id="team_bi"
                value={formData.team_bi}
                onChange={(e) => handleInputChange('team_bi', e.target.value)}
                placeholder="Configuración Team BI"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Condiciones y Observaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Condiciones Generales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="condiciones_climaticas">Condiciones Climáticas</Label>
              <Textarea
                id="condiciones_climaticas"
                value={formData.condiciones_climaticas || ''}
                onChange={(e) => handleInputChange('condiciones_climaticas', e.target.value)}
                placeholder="Describe las condiciones climáticas del día..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones_generales">Observaciones Generales</Label>
              <Textarea
                id="observaciones_generales"
                value={formData.observaciones_generales || ''}
                onChange={(e) => handleInputChange('observaciones_generales', e.target.value)}
                placeholder="Observaciones importantes para la operación..."
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de ayuda */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Información General</p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Los campos marcados con (*) son obligatorios</li>
              <li>• La información se guarda automáticamente cada 30 segundos</li>
              <li>• Puedes navegar entre pasos usando los botones de navegación</li>
              <li>• Las condiciones climáticas son importantes para el análisis posterior</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
