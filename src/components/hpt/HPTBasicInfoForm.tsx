
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface HPTBasicInfoFormProps {
  data: any;
  operacionData?: any;
  onChange: (data: any) => void;
}

export const HPTBasicInfoForm: React.FC<HPTBasicInfoFormProps> = ({ data, operacionData, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Información Básica</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="codigo">Código HPT</Label>
            <Input
              id="codigo"
              value={data.codigo || ''}
              onChange={(e) => handleChange('codigo', e.target.value)}
              placeholder="HPT-001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={data.fecha || ''}
              onChange={(e) => handleChange('fecha', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supervisor_nombre">Supervisor</Label>
            <Input
              id="supervisor_nombre"
              value={data.supervisor_nombre || ''}
              onChange={(e) => handleChange('supervisor_nombre', e.target.value)}
              placeholder="Nombre del supervisor"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="centro_trabajo_nombre">Centro de Trabajo</Label>
            <Input
              id="centro_trabajo_nombre"
              value={data.centro_trabajo_nombre || ''}
              onChange={(e) => handleChange('centro_trabajo_nombre', e.target.value)}
              placeholder="Nombre del centro de trabajo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="empresa_servicio_nombre">Empresa de Servicio</Label>
            <Input
              id="empresa_servicio_nombre"
              value={data.empresa_servicio_nombre || ''}
              onChange={(e) => handleChange('empresa_servicio_nombre', e.target.value)}
              placeholder="Nombre de la empresa"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lugar_especifico">Lugar Específico</Label>
            <Input
              id="lugar_especifico"
              value={data.lugar_especifico || ''}
              onChange={(e) => handleChange('lugar_especifico', e.target.value)}
              placeholder="Ubicación específica"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion_tarea">Descripción de la Tarea</Label>
          <Textarea
            id="descripcion_tarea"
            value={data.descripcion_tarea || ''}
            onChange={(e) => handleChange('descripcion_tarea', e.target.value)}
            placeholder="Descripción detallada de la tarea a realizar"
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="es_rutinaria"
            checked={data.es_rutinaria || false}
            onCheckedChange={(checked) => handleChange('es_rutinaria', checked)}
          />
          <Label htmlFor="es_rutinaria">Es una tarea rutinaria</Label>
        </div>
      </CardContent>
    </Card>
  );
};
