
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin } from "lucide-react";
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

interface EncabezadoGeneralProps {
  formData: NetworkMaintenanceData;
  updateFormData: (updates: Partial<NetworkMaintenanceData>) => void;
  tipoFormulario: 'mantencion' | 'faena_redes';
  readOnly?: boolean;
}

export const EncabezadoGeneral = ({ 
  formData, 
  updateFormData, 
  tipoFormulario,
  readOnly = false 
}: EncabezadoGeneralProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Encabezado General
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="lugar_trabajo">Lugar de trabajo (centro u otro)</Label>
            <Input
              id="lugar_trabajo"
              value={formData.lugar_trabajo}
              onChange={(e) => updateFormData({ lugar_trabajo: e.target.value })}
              placeholder="Ej: Centro Norte"
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) => updateFormData({ fecha: e.target.value })}
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="temperatura">Temperatura (°C)</Label>
            <Input
              id="temperatura"
              type="number"
              value={formData.temperatura}
              onChange={(e) => updateFormData({ temperatura: parseFloat(e.target.value) })}
              placeholder="15"
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="hora_inicio">Hora inicio faena</Label>
            <Input
              id="hora_inicio"
              type="time"
              value={formData.hora_inicio}
              onChange={(e) => updateFormData({ hora_inicio: e.target.value })}
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="hora_termino">Hora término faena</Label>
            <Input
              id="hora_termino"
              type="time"
              value={formData.hora_termino}
              onChange={(e) => updateFormData({ hora_termino: e.target.value })}
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="profundidad_max">Profundidad máxima (m)</Label>
            <Input
              id="profundidad_max"
              type="number"
              value={formData.profundidad_max}
              onChange={(e) => updateFormData({ profundidad_max: parseFloat(e.target.value) })}
              placeholder="30"
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="nave_maniobras">Nave maniobras</Label>
            <Input
              id="nave_maniobras"
              value={formData.nave_maniobras}
              onChange={(e) => updateFormData({ nave_maniobras: e.target.value })}
              placeholder="Nombre de la embarcación"
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="team_s">Team S</Label>
            <Input
              id="team_s"
              value={formData.team_s}
              onChange={(e) => updateFormData({ team_s: e.target.value })}
              placeholder="Equipo supervisor"
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="team_be">Team BE</Label>
            <Input
              id="team_be"
              value={formData.team_be}
              onChange={(e) => updateFormData({ team_be: e.target.value })}
              placeholder="Equipo buceo emergencia"
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="team_bi">Team BI</Label>
            <Input
              id="team_bi"
              value={formData.team_bi}
              onChange={(e) => updateFormData({ team_bi: e.target.value })}
              placeholder="Equipo buceo industrial"
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="matricula_nave">Matrícula nave</Label>
            <Input
              id="matricula_nave"
              value={formData.matricula_nave}
              onChange={(e) => updateFormData({ matricula_nave: e.target.value })}
              placeholder="Ej: PN-1234"
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="estado_puerto">Estado de puerto</Label>
            <Select 
              value={formData.estado_puerto} 
              onValueChange={(value) => updateFormData({ estado_puerto: value })}
              disabled={readOnly}
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
        </div>
      </CardContent>
    </Card>
  );
};
