
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HPTTaskDetailsFormProps {
  data: any;
  operacionData?: any;
  onChange: (data: any) => void;
}

export const HPTTaskDetailsForm: React.FC<HPTTaskDetailsFormProps> = ({ data, operacionData, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Detalles de la Tarea</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hora_inicio">Hora de Inicio</Label>
            <Input
              id="hora_inicio"
              type="time"
              value={data.hora_inicio || ''}
              onChange={(e) => handleChange('hora_inicio', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hora_termino">Hora de Término</Label>
            <Input
              id="hora_termino"
              type="time"
              value={data.hora_termino || ''}
              onChange={(e) => handleChange('hora_termino', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profundidad_maxima">Profundidad Máxima (m)</Label>
            <Input
              id="profundidad_maxima"
              type="number"
              value={data.profundidad_maxima || ''}
              onChange={(e) => handleChange('profundidad_maxima', parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperatura">Temperatura (°C)</Label>
            <Input
              id="temperatura"
              type="number"
              value={data.temperatura || ''}
              onChange={(e) => handleChange('temperatura', parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="corrientes">Corrientes</Label>
            <Select value={data.corrientes || ''} onValueChange={(value) => handleChange('corrientes', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el estado de corrientes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baja">Baja</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibilidad">Visibilidad</Label>
            <Select value={data.visibilidad || ''} onValueChange={(value) => handleChange('visibilidad', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione la visibilidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excelente">Excelente</SelectItem>
                <SelectItem value="buena">Buena</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="mala">Mala</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="plan_emergencia">Plan de Emergencia</Label>
          <Textarea
            id="plan_emergencia"
            value={data.plan_emergencia || ''}
            onChange={(e) => handleChange('plan_emergencia', e.target.value)}
            placeholder="Descripción del plan de emergencia"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};
