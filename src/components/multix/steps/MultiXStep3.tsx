
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { MultiXData, EquipoSuperficie } from '@/types/multix';

interface MultiXStep3Props {
  data: MultiXData;
  onUpdate: (field: keyof MultiXData, value: any) => void;
}

const estadosEquipo = [
  { value: 'operativo', label: 'Operativo' },
  { value: 'mantenimiento', label: 'En Mantenimiento' },
  { value: 'falla', label: 'Con Falla' },
  { value: 'no_disponible', label: 'No Disponible' }
];

export const MultiXStep3: React.FC<MultiXStep3Props> = ({ data, onUpdate }) => {
  const equipos = data.equipos_superficie || [];

  const agregarEquipo = () => {
    const nuevoEquipo: EquipoSuperficie = {
      id: crypto.randomUUID(),
      nombre: '',
      descripcion: '',
      cantidad: 1,
      estado: 'operativo'
    };
    
    onUpdate('equipos_superficie', [...equipos, nuevoEquipo]);
  };

  const actualizarEquipo = (id: string, campo: keyof EquipoSuperficie, valor: any) => {
    const equiposActualizados = equipos.map(equipo =>
      equipo.id === id ? { ...equipo, [campo]: valor } : equipo
    );
    onUpdate('equipos_superficie', equiposActualizados);
  };

  const eliminarEquipo = (id: string) => {
    const equiposFiltrados = equipos.filter(equipo => equipo.id !== id);
    onUpdate('equipos_superficie', equiposFiltrados);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Equipos de Superficie</h2>
        <p className="text-muted-foreground mt-2">
          Equipos y herramientas utilizados en la operación
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Inventario de Equipos</CardTitle>
          <Button
            type="button"
            onClick={agregarEquipo}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Agregar Equipo
          </Button>
        </CardHeader>
        <CardContent>
          {equipos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay equipos registrados</p>
              <Button
                type="button"
                variant="outline"
                onClick={agregarEquipo}
                className="mt-4"
              >
                Agregar Primer Equipo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {equipos.map((equipo, index) => (
                <div key={equipo.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Equipo #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarEquipo(equipo.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`nombre-${equipo.id}`}>Nombre del Equipo *</Label>
                      <Input
                        id={`nombre-${equipo.id}`}
                        value={equipo.nombre}
                        onChange={(e) => actualizarEquipo(equipo.id, 'nombre', e.target.value)}
                        placeholder="Nombre del equipo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`cantidad-${equipo.id}`}>Cantidad</Label>
                      <Input
                        id={`cantidad-${equipo.id}`}
                        type="number"
                        min="1"
                        value={equipo.cantidad}
                        onChange={(e) => actualizarEquipo(equipo.id, 'cantidad', parseInt(e.target.value) || 1)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`estado-${equipo.id}`}>Estado</Label>
                      <Select
                        value={equipo.estado}
                        onValueChange={(value) => actualizarEquipo(equipo.id, 'estado', value)}
                      >
                        <SelectTrigger id={`estado-${equipo.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {estadosEquipo.map(estado => (
                            <SelectItem key={estado.value} value={estado.value}>
                              {estado.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label htmlFor={`descripcion-${equipo.id}`}>Descripción</Label>
                    <Textarea
                      id={`descripcion-${equipo.id}`}
                      value={equipo.descripcion}
                      onChange={(e) => actualizarEquipo(equipo.id, 'descripcion', e.target.value)}
                      placeholder="Descripción detallada del equipo, modelo, características, etc."
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {estadosEquipo.map(estado => {
          const count = equipos.filter(e => e.estado === estado.value).length;
          return (
            <Card key={estado.value}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground">{estado.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-medium text-green-900 mb-2">Resumen de Equipos</h3>
        <p className="text-sm text-green-700">
          Total de equipos: <strong>{equipos.length}</strong>
        </p>
        <p className="text-sm text-green-700">
          Total de unidades: <strong>{equipos.reduce((sum, e) => sum + e.cantidad, 0)}</strong>
        </p>
      </div>
    </div>
  );
};
