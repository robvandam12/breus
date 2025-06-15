
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiXData } from '@/types/multix';

interface MultiXStep1Props {
  data: MultiXData;
  onUpdate: (field: keyof MultiXData, value: any) => void;
  tipo: 'mantencion' | 'faena';
}

export const MultiXStep1: React.FC<MultiXStep1Props> = ({ data, onUpdate, tipo }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Información General</h2>
        <p className="text-muted-foreground mt-2">
          Datos básicos del formulario MultiX - {tipo === 'mantencion' ? 'Mantención' : 'Faena'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información de Trabajo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lugar_trabajo">Lugar de Trabajo *</Label>
              <Input
                id="lugar_trabajo"
                value={data.lugar_trabajo || ''}
                onChange={(e) => onUpdate('lugar_trabajo', e.target.value)}
                placeholder="Nombre del lugar de trabajo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                value={data.fecha || ''}
                onChange={(e) => onUpdate('fecha', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hora_inicio">Hora Inicio *</Label>
                <Input
                  id="hora_inicio"
                  type="time"
                  value={data.hora_inicio || ''}
                  onChange={(e) => onUpdate('hora_inicio', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora_termino">Hora Término *</Label>
                <Input
                  id="hora_termino"
                  type="time"
                  value={data.hora_termino || ''}
                  onChange={(e) => onUpdate('hora_termino', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de Nave</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nave_maniobras">Nave de Maniobras</Label>
              <Input
                id="nave_maniobras"
                value={data.nave_maniobras || ''}
                onChange={(e) => onUpdate('nave_maniobras', e.target.value)}
                placeholder="Nombre de la nave"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="matricula_nave">Matrícula de Nave</Label>
              <Input
                id="matricula_nave"
                value={data.matricula_nave || ''}
                onChange={(e) => onUpdate('matricula_nave', e.target.value)}
                placeholder="Matrícula"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado_puerto">Estado del Puerto</Label>
              <Select
                value={data.estado_puerto || ''}
                onValueChange={(value) => onUpdate('estado_puerto', value)}
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipos de Trabajo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="team_s">Team S</Label>
              <Input
                id="team_s"
                value={data.team_s || ''}
                onChange={(e) => onUpdate('team_s', e.target.value)}
                placeholder="Equipo S"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team_be">Team BE</Label>
              <Input
                id="team_be"
                value={data.team_be || ''}
                onChange={(e) => onUpdate('team_be', e.target.value)}
                placeholder="Equipo BE"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team_bi">Team BI</Label>
              <Input
                id="team_bi"
                value={data.team_bi || ''}
                onChange={(e) => onUpdate('team_bi', e.target.value)}
                placeholder="Equipo BI"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Condiciones Ambientales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperatura">Temperatura (°C)</Label>
              <Input
                id="temperatura"
                type="number"
                step="0.1"
                value={data.temperatura || ''}
                onChange={(e) => onUpdate('temperatura', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profundidad_max">Profundidad Máxima (m)</Label>
              <Input
                id="profundidad_max"
                type="number"
                step="0.1"
                value={data.profundidad_max || ''}
                onChange={(e) => onUpdate('profundidad_max', parseFloat(e.target.value) || 0)}
                placeholder="0.0"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
