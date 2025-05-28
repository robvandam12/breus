
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface HPTTeamFormProps {
  data: any;
  operacionData?: any;
  onChange: (data: any) => void;
}

export const HPTTeamForm: React.FC<HPTTeamFormProps> = ({ data, operacionData, onChange }) => {
  const handleChange = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  const addBuzo = () => {
    const buzos = data.buzos || [];
    buzos.push({
      nombre: '',
      matricula: '',
      rol: 'buzo_principal'
    });
    handleChange('buzos', buzos);
  };

  const removeBuzo = (index: number) => {
    const buzos = [...(data.buzos || [])];
    buzos.splice(index, 1);
    handleChange('buzos', buzos);
  };

  const updateBuzo = (index: number, field: string, value: string) => {
    const buzos = [...(data.buzos || [])];
    buzos[index] = { ...buzos[index], [field]: value };
    handleChange('buzos', buzos);
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Equipo de Trabajo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="jefe_mandante_nombre">Jefe Mandante</Label>
          <Input
            id="jefe_mandante_nombre"
            value={data.jefe_mandante_nombre || ''}
            onChange={(e) => handleChange('jefe_mandante_nombre', e.target.value)}
            placeholder="Nombre del jefe mandante"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Buzos Asignados</Label>
            <Button type="button" variant="outline" size="sm" onClick={addBuzo}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Buzo
            </Button>
          </div>

          {(data.buzos || []).map((buzo: any, index: number) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={buzo.nombre || ''}
                  onChange={(e) => updateBuzo(index, 'nombre', e.target.value)}
                  placeholder="Nombre del buzo"
                />
              </div>
              <div className="space-y-2">
                <Label>Matrícula</Label>
                <Input
                  value={buzo.matricula || ''}
                  onChange={(e) => updateBuzo(index, 'matricula', e.target.value)}
                  placeholder="Matrícula"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeBuzo(index)}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
