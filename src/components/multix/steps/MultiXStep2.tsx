
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { MultiXData, DotacionMember } from '@/types/multix';

interface MultiXStep2Props {
  data: MultiXData;
  onUpdate: (field: keyof MultiXData, value: any) => void;
}

export const MultiXStep2: React.FC<MultiXStep2Props> = ({ data, onUpdate }) => {
  const dotacion = data.dotacion || [];

  const agregarMiembro = () => {
    const nuevoMiembro: DotacionMember = {
      id: crypto.randomUUID(),
      nombre: '',
      rut: '',
      rol: '',
      empresa: ''
    };
    
    onUpdate('dotacion', [...dotacion, nuevoMiembro]);
  };

  const actualizarMiembro = (id: string, campo: keyof DotacionMember, valor: string) => {
    const dotacionActualizada = dotacion.map(miembro =>
      miembro.id === id ? { ...miembro, [campo]: valor } : miembro
    );
    onUpdate('dotacion', dotacionActualizada);
  };

  const eliminarMiembro = (id: string) => {
    const dotacionFiltrada = dotacion.filter(miembro => miembro.id !== id);
    onUpdate('dotacion', dotacionFiltrada);
  };

  const rolesDisponibles = [
    'Supervisor de Buceo',
    'Buzo Profesional',
    'Asistente de Buceo',
    'Operador de Superficie',
    'Técnico de Equipos',
    'Encargado de Seguridad'
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Dotación</h2>
        <p className="text-muted-foreground mt-2">
          Personal asignado a la operación
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Miembros del Equipo</CardTitle>
          <Button
            type="button"
            onClick={agregarMiembro}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Agregar Miembro
          </Button>
        </CardHeader>
        <CardContent>
          {dotacion.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay miembros en la dotación</p>
              <Button
                type="button"
                variant="outline"
                onClick={agregarMiembro}
                className="mt-4"
              >
                Agregar Primer Miembro
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {dotacion.map((miembro, index) => (
                <div key={miembro.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Miembro #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarMiembro(miembro.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`nombre-${miembro.id}`}>Nombre Completo *</Label>
                      <Input
                        id={`nombre-${miembro.id}`}
                        value={miembro.nombre}
                        onChange={(e) => actualizarMiembro(miembro.id, 'nombre', e.target.value)}
                        placeholder="Nombre y apellido"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`rut-${miembro.id}`}>RUT *</Label>
                      <Input
                        id={`rut-${miembro.id}`}
                        value={miembro.rut}
                        onChange={(e) => actualizarMiembro(miembro.id, 'rut', e.target.value)}
                        placeholder="12.345.678-9"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`rol-${miembro.id}`}>Rol *</Label>
                      <Select
                        value={miembro.rol}
                        onValueChange={(value) => actualizarMiembro(miembro.id, 'rol', value)}
                      >
                        <SelectTrigger id={`rol-${miembro.id}`}>
                          <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                        <SelectContent>
                          {rolesDisponibles.map(rol => (
                            <SelectItem key={rol} value={rol}>
                              {rol}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`empresa-${miembro.id}`}>Empresa *</Label>
                      <Input
                        id={`empresa-${miembro.id}`}
                        value={miembro.empresa}
                        onChange={(e) => actualizarMiembro(miembro.id, 'empresa', e.target.value)}
                        placeholder="Nombre de la empresa"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Resumen de Dotación</h3>
        <p className="text-sm text-blue-700">
          Total de miembros: <strong>{dotacion.length}</strong>
        </p>
        {dotacion.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-blue-600">
              Roles: {Array.from(new Set(dotacion.filter(m => m.rol).map(m => m.rol))).join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
