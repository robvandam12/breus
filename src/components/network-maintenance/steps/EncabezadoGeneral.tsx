
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, Ship, Thermometer } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

interface EncabezadoGeneralProps {
  formData: NetworkMaintenanceData;
  updateFormData: (updates: Partial<NetworkMaintenanceData>) => void;
  readOnly?: boolean;
  tipoFormulario: 'mantencion' | 'faena_redes';
}

export const EncabezadoGeneral = ({ 
  formData, 
  updateFormData, 
  readOnly = false,
  tipoFormulario 
}: EncabezadoGeneralProps) => {
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      updateFormData({ fecha: format(date, 'yyyy-MM-dd') });
    }
  };

  const selectedDate = formData.fecha ? new Date(formData.fecha) : undefined;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Información General de la Faena
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lugar_trabajo">Lugar de Trabajo (Centro u Otro) *</Label>
              <Input
                id="lugar_trabajo"
                value={formData.lugar_trabajo}
                onChange={(e) => updateFormData({ lugar_trabajo: e.target.value })}
                placeholder="Ingrese lugar de trabajo"
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label>Fecha *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                    disabled={readOnly}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    initialFocus
                    disabled={readOnly}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperatura" className="flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                Temperatura (°C)
              </Label>
              <Input
                id="temperatura"
                type="number"
                value={formData.temperatura}
                onChange={(e) => updateFormData({ temperatura: Number(e.target.value) })}
                placeholder="15"
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profundidad_max">Profundidad Máxima (m)</Label>
              <Input
                id="profundidad_max"
                type="number"
                value={formData.profundidad_max}
                onChange={(e) => updateFormData({ profundidad_max: Number(e.target.value) })}
                placeholder="30"
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora_inicio">Hora Inicio Faena *</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => updateFormData({ hora_inicio: e.target.value })}
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora_termino">Hora Término Faena</Label>
              <Input
                id="hora_termino"
                type="time"
                value={formData.hora_termino}
                onChange={(e) => updateFormData({ hora_termino: e.target.value })}
                disabled={readOnly}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ship className="w-5 h-5" />
            Información de Embarcación y Equipos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nave_maniobras">Nave Maniobras</Label>
              <Input
                id="nave_maniobras"
                value={formData.nave_maniobras}
                onChange={(e) => updateFormData({ nave_maniobras: e.target.value })}
                placeholder="Nombre de la embarcación"
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="matricula_nave">Matrícula Nave</Label>
              <Input
                id="matricula_nave"
                value={formData.matricula_nave}
                onChange={(e) => updateFormData({ matricula_nave: e.target.value })}
                placeholder="Matrícula de la embarcación"
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team_s">Team S</Label>
              <Input
                id="team_s"
                value={formData.team_s}
                onChange={(e) => updateFormData({ team_s: e.target.value })}
                placeholder="Equipo S"
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team_be">Team BE</Label>
              <Input
                id="team_be"
                value={formData.team_be}
                onChange={(e) => updateFormData({ team_be: e.target.value })}
                placeholder="Equipo BE"
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team_bi">Team BI</Label>
              <Input
                id="team_bi"
                value={formData.team_bi}
                onChange={(e) => updateFormData({ team_bi: e.target.value })}
                placeholder="Equipo BI"
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado_puerto">Estado de Puerto</Label>
              <Select
                value={formData.estado_puerto}
                onValueChange={(value) => updateFormData({ estado_puerto: value })}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione estado del puerto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calmo">Calmo</SelectItem>
                  <SelectItem value="moderado">Moderado</SelectItem>
                  <SelectItem value="agitado">Agitado</SelectItem>
                  <SelectItem value="muy_agitado">Muy Agitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campos específicos para Faena de Redes */}
      {tipoFormulario === 'faena_redes' && (
        <Card>
          <CardHeader>
            <CardTitle>Información Específica de Faena</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supervisor_faena">Supervisor</Label>
              <Input
                id="supervisor_faena"
                value={formData.supervisor_faena || ''}
                onChange={(e) => updateFormData({ supervisor_faena: e.target.value })}
                placeholder="Nombre del supervisor"
                disabled={readOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="obs_generales">Observaciones Generales</Label>
              <Textarea
                id="obs_generales"
                value={formData.obs_generales || ''}
                onChange={(e) => updateFormData({ obs_generales: e.target.value })}
                placeholder="Observaciones generales de la faena..."
                rows={4}
                disabled={readOnly}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
