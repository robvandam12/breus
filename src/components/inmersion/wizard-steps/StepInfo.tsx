
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export const StepInfo = ({ formData, handleInputChange, isFieldDisabled }) => {
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Información Básica
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="codigo">Código de Inmersión *</Label>
          <Input id="codigo" value={formData.codigo} onChange={(e) => handleInputChange('codigo', e.target.value)} placeholder="Código único de la inmersión" disabled={isFieldDisabled('codigo')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fecha_inmersion">Fecha *</Label>
            <Input id="fecha_inmersion" type="date" value={formData.fecha_inmersion} onChange={(e) => handleInputChange('fecha_inmersion', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="hora_inicio">Hora Inicio *</Label>
            <Input id="hora_inicio" type="time" value={formData.hora_inicio} onChange={(e) => handleInputChange('hora_inicio', e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="objetivo">Objetivo *</Label>
          <Textarea id="objetivo" value={formData.objetivo} onChange={(e) => handleInputChange('objetivo', e.target.value)} placeholder="Objetivo de la inmersión" rows={3} disabled={isFieldDisabled('objetivo')} />
        </div>
      </CardContent>
    </Card>
  );
};
