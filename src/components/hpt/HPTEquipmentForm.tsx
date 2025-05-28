
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface HPTEquipmentFormProps {
  data: any;
  onChange: (data: any) => void;
}

export const HPTEquipmentForm: React.FC<HPTEquipmentFormProps> = ({ data, onChange }) => {
  const handleEquipmentChange = (category: string, equipmentId: string, checked: boolean) => {
    const equipment = { ...(data[category] || {}) };
    equipment[equipmentId] = checked;
    onChange({ [category]: equipment });
  };

  const handleEquipmentTextChange = (category: string, equipmentId: string, value: string) => {
    const equipment = { ...(data[category] || {}) };
    equipment[equipmentId] = value;
    onChange({ [category]: equipment });
  };

  const equipoBuceo = [
    { id: 'mascara', label: 'Máscara facial completa' },
    { id: 'regulador', label: 'Regulador principal' },
    { id: 'regulador_respaldo', label: 'Regulador de respaldo' },
    { id: 'traje_seco', label: 'Traje seco' },
    { id: 'aletas', label: 'Aletas' },
    { id: 'cuchillo', label: 'Cuchillo de buceo' }
  ];

  const equipoSeguridad = [
    { id: 'cabo_vida', label: 'Cabo de vida' },
    { id: 'sistema_comunicacion', label: 'Sistema de comunicación' },
    { id: 'linterna_principal', label: 'Linterna principal' },
    { id: 'linterna_respaldo', label: 'Linterna de respaldo' },
    { id: 'silbato', label: 'Silbato de emergencia' }
  ];

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Equipo de Buceo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {equipoBuceo.map((equipo) => (
            <div key={equipo.id} className="flex items-center space-x-2">
              <Checkbox
                id={`buceo_${equipo.id}`}
                checked={data.equipo_buceo?.[equipo.id] || false}
                onCheckedChange={(checked) => handleEquipmentChange('equipo_buceo', equipo.id, checked as boolean)}
              />
              <Label htmlFor={`buceo_${equipo.id}`}>{equipo.label}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Equipo de Seguridad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {equipoSeguridad.map((equipo) => (
            <div key={equipo.id} className="flex items-center space-x-2">
              <Checkbox
                id={`seguridad_${equipo.id}`}
                checked={data.equipo_seguridad?.[equipo.id] || false}
                onCheckedChange={(checked) => handleEquipmentChange('equipo_seguridad', equipo.id, checked as boolean)}
              />
              <Label htmlFor={`seguridad_${equipo.id}`}>{equipo.label}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Herramientas Adicionales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="herramientas_especiales">Herramientas Especiales</Label>
            <Input
              id="herramientas_especiales"
              value={data.herramientas?.especiales || ''}
              onChange={(e) => handleEquipmentTextChange('herramientas', 'especiales', e.target.value)}
              placeholder="Describe las herramientas especiales necesarias"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
