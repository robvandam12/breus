import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

interface EncabezadoGeneralProps {
  data: NetworkMaintenanceData;
  onDataChange: (data: Partial<NetworkMaintenanceData>) => void;
}

export const EncabezadoGeneral: React.FC<EncabezadoGeneralProps> = ({ data, onDataChange }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos Generales de la Operación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <DatePicker
                date={data.fecha ? new Date(data.fecha) : undefined}
                onDateChange={(date) => onDataChange({ fecha: date?.toISOString().split('T')[0] || '' })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lugar_trabajo">Lugar de Trabajo</Label>
              <Input
                id="lugar_trabajo"
                value={data.lugar_trabajo || ''}
                onChange={(e) => onDataChange({ lugar_trabajo: e.target.value })}
                placeholder="Ingrese lugar de trabajo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperatura">Temperatura (°C)</Label>
              <Input
                id="temperatura"
                type="number"
                value={data.temperatura || ''}
                onChange={(e) => onDataChange({ temperatura: Number(e.target.value) })}
                placeholder="Temperatura del agua"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profundidad_max">Profundidad Máxima (m)</Label>
              <Input
                id="profundidad_max"
                type="number"
                value={data.profundidad_max || ''}
                onChange={(e) => onDataChange({ profundidad_max: Number(e.target.value) })}
                placeholder="Profundidad máxima de trabajo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado_puerto">Estado del Puerto</Label>
              <Select 
                value={data.estado_puerto || ''} 
                onValueChange={(value) => onDataChange({ estado_puerto: value })}
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

            <div className="space-y-2">
              <Label htmlFor="nave_maniobras">Nave de Maniobras</Label>
              <Input
                id="nave_maniobras"
                value={data.nave_maniobras || ''}
                onChange={(e) => onDataChange({ nave_maniobras: e.target.value })}
                placeholder="Nombre de la embarcación"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teams */}
      <Card>
        <CardHeader>
          <CardTitle>Equipos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="team_s">Team S</Label>
              <Input
                id="team_s"
                value={data.team_s || ''}
                onChange={(e) => onDataChange({ team_s: e.target.value })}
                placeholder="Nombre del Team S"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team_be">Team BE</Label>
              <Input
                id="team_be"
                value={data.team_be || ''}
                onChange={(e) => onDataChange({ team_be: e.target.value })}
                placeholder="Nombre del Team BE"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team_bi">Team BI</Label>
              <Input
                id="team_bi"
                value={data.team_bi || ''}
                onChange={(e) => onDataChange({ team_bi: e.target.value })}
                placeholder="Nombre del Team BI"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
