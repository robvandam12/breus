
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EncabezadoGeneralProps {
  data: {
    lugar_trabajo: string;
    fecha: string;
    temperatura: number;
    hora_inicio: string;
    hora_termino: string;
    profundidad_max: number;
    nave_maniobras: string;
    team_s: string;
    team_be: string;
    team_bi: string;
    matricula_nave: string;
    estado_puerto: string;
  };
  onChange: (field: string, value: any) => void;
  readOnly?: boolean;
}

export const EncabezadoGeneral = ({ data, onChange, readOnly = false }: EncabezadoGeneralProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Encabezado General</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="lugar_trabajo">Lugar de trabajo (centro u otro)</Label>
            <Input
              id="lugar_trabajo"
              value={data.lugar_trabajo}
              onChange={(e) => onChange('lugar_trabajo', e.target.value)}
              disabled={readOnly}
            />
          </div>
          
          <div>
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={data.fecha}
              onChange={(e) => onChange('fecha', e.target.value)}
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="temperatura">Temperatura (°C)</Label>
            <Input
              id="temperatura"
              type="number"
              value={data.temperatura}
              onChange={(e) => onChange('temperatura', parseFloat(e.target.value) || 0)}
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="hora_inicio">Hora inicio faena</Label>
            <Input
              id="hora_inicio"
              type="time"
              value={data.hora_inicio}
              onChange={(e) => onChange('hora_inicio', e.target.value)}
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="hora_termino">Hora término faena</Label>
            <Input
              id="hora_termino"
              type="time"
              value={data.hora_termino}
              onChange={(e) => onChange('hora_termino', e.target.value)}
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="profundidad_max">Profundidad máxima (m)</Label>
            <Input
              id="profundidad_max"
              type="number"
              value={data.profundidad_max}
              onChange={(e) => onChange('profundidad_max', parseFloat(e.target.value) || 0)}
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="nave_maniobras">Nave maniobras</Label>
            <Input
              id="nave_maniobras"
              value={data.nave_maniobras}
              onChange={(e) => onChange('nave_maniobras', e.target.value)}
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="team_s">Team S</Label>
            <Input
              id="team_s"
              value={data.team_s}
              onChange={(e) => onChange('team_s', e.target.value)}
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="team_be">Team BE</Label>
            <Input
              id="team_be"
              value={data.team_be}
              onChange={(e) => onChange('team_be', e.target.value)}
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="team_bi">Team BI</Label>
            <Input
              id="team_bi"
              value={data.team_bi}
              onChange={(e) => onChange('team_bi', e.target.value)}
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="matricula_nave">Matrícula nave</Label>
            <Input
              id="matricula_nave"
              value={data.matricula_nave}
              onChange={(e) => onChange('matricula_nave', e.target.value)}
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="estado_puerto">Estado de puerto</Label>
            <Select 
              value={data.estado_puerto} 
              onValueChange={(value) => onChange('estado_puerto', value)}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="calmo">Calmo</SelectItem>
                <SelectItem value="moderado">Moderado</SelectItem>
                <SelectItem value="agitado">Agitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
