
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Users, Clock } from "lucide-react";
import type { NetworkMaintenanceData, Dotacion } from '@/types/network-maintenance';

interface DotacionBuceoProps {
  formData: NetworkMaintenanceData;
  updateFormData: (updates: Partial<NetworkMaintenanceData>) => void;
  readOnly?: boolean;
}

export const DotacionBuceo = ({ formData, updateFormData, readOnly = false }: DotacionBuceoProps) => {
  const dotacion = formData.dotacion || [];

  const agregarMiembro = () => {
    const nuevoMiembro: Dotacion = {
      id: Date.now().toString(),
      rol: 'buzo',
      nombre: '',
      apellido: '',
      rut: '',
      horas_trabajadas: 0,
      matricula: '',
      contratista: false,
      equipo: 'liviano',
      hora_inicio_buzo: '',
      hora_fin_buzo: '',
      profundidad: 0
    };

    updateFormData({
      dotacion: [...dotacion, nuevoMiembro]
    });
  };

  const actualizarMiembro = (id: string, campo: keyof Dotacion, valor: any) => {
    const dotacionActualizada = dotacion.map(miembro =>
      miembro.id === id ? { ...miembro, [campo]: valor } : miembro
    );
    updateFormData({ dotacion: dotacionActualizada });
  };

  const eliminarMiembro = (id: string) => {
    const dotacionActualizada = dotacion.filter(miembro => miembro.id !== id);
    updateFormData({ dotacion: dotacionActualizada });
  };

  const rolesDisponibles = [
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'buzo_emergencia_1', label: 'Buzo Emergencia 1' },
    { value: 'buzo_emergencia_2', label: 'Buzo Emergencia 2' },
    { value: 'buzo_1', label: 'Buzo N°1' },
    { value: 'buzo_2', label: 'Buzo N°2' },
    { value: 'buzo_3', label: 'Buzo N°3' },
    { value: 'buzo_4', label: 'Buzo N°4' },
    { value: 'buzo_5', label: 'Buzo N°5' },
    { value: 'buzo_6', label: 'Buzo N°6' },
    { value: 'buzo_7', label: 'Buzo N°7' },
    { value: 'buzo_8', label: 'Buzo N°8' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Dotación y Roles de Buceo
          </h3>
          <p className="text-sm text-gray-600">
            Personal asignado para la operación de mantención
          </p>
        </div>
        {!readOnly && (
          <Button onClick={agregarMiembro} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Persona
          </Button>
        )}
      </div>

      {/* Resumen */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumen de Dotación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{dotacion.length}</div>
              <div className="text-sm text-blue-600">Total Personal</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {dotacion.filter(m => m.rol === 'supervisor').length}
              </div>
              <div className="text-sm text-green-600">Supervisores</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {dotacion.filter(m => m.rol.includes('buzo')).length}
              </div>
              <div className="text-sm text-purple-600">Buzos</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {dotacion.filter(m => m.contratista).length}
              </div>
              <div className="text-sm text-orange-600">Contratistas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Personal */}
      <div className="space-y-4">
        {dotacion.map((miembro, index) => (
          <Card key={miembro.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Persona {index + 1}
                </CardTitle>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => eliminarMiembro(miembro.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`rol_${miembro.id}`}>Rol</Label>
                  <Select
                    value={miembro.rol}
                    onValueChange={(value) => actualizarMiembro(miembro.id, 'rol', value)}
                    disabled={readOnly}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {rolesDisponibles.map(rol => (
                        <SelectItem key={rol.value} value={rol.value}>
                          {rol.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`nombre_${miembro.id}`}>Nombre</Label>
                  <Input
                    id={`nombre_${miembro.id}`}
                    value={miembro.nombre}
                    onChange={(e) => actualizarMiembro(miembro.id, 'nombre', e.target.value)}
                    placeholder="Nombre"
                    disabled={readOnly}
                  />
                </div>

                <div>
                  <Label htmlFor={`apellido_${miembro.id}`}>Apellido</Label>
                  <Input
                    id={`apellido_${miembro.id}`}
                    value={miembro.apellido}
                    onChange={(e) => actualizarMiembro(miembro.id, 'apellido', e.target.value)}
                    placeholder="Apellido"
                    disabled={readOnly}
                  />
                </div>

                <div>
                  <Label htmlFor={`matricula_${miembro.id}`}>Nº Matrícula</Label>
                  <Input
                    id={`matricula_${miembro.id}`}
                    value={miembro.matricula}
                    onChange={(e) => actualizarMiembro(miembro.id, 'matricula', e.target.value)}
                    placeholder="Matrícula"
                    disabled={readOnly}
                  />
                </div>

                <div>
                  <Label htmlFor={`equipo_${miembro.id}`}>Equipo</Label>
                  <Select
                    value={miembro.equipo}
                    onValueChange={(value) => actualizarMiembro(miembro.id, 'equipo', value)}
                    disabled={readOnly}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="liviano">Liviano</SelectItem>
                      <SelectItem value="mediano">Mediano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`profundidad_${miembro.id}`}>Profundidad (m)</Label>
                  <Input
                    id={`profundidad_${miembro.id}`}
                    type="number"
                    value={miembro.profundidad || ''}
                    onChange={(e) => actualizarMiembro(miembro.id, 'profundidad', Number(e.target.value))}
                    placeholder="0"
                    disabled={readOnly}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`hora_inicio_${miembro.id}`} className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Hora Inicio Inmersión
                  </Label>
                  <Input
                    id={`hora_inicio_${miembro.id}`}
                    type="time"
                    value={miembro.hora_inicio_buzo || ''}
                    onChange={(e) => actualizarMiembro(miembro.id, 'hora_inicio_buzo', e.target.value)}
                    disabled={readOnly}
                  />
                </div>

                <div>
                  <Label htmlFor={`hora_fin_${miembro.id}`} className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Hora Término Inmersión
                  </Label>
                  <Input
                    id={`hora_fin_${miembro.id}`}
                    type="time"
                    value={miembro.hora_fin_buzo || ''}
                    onChange={(e) => actualizarMiembro(miembro.id, 'hora_fin_buzo', e.target.value)}
                    disabled={readOnly}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`contratista_${miembro.id}`}
                  checked={miembro.contratista}
                  onCheckedChange={(checked) => actualizarMiembro(miembro.id, 'contratista', checked)}
                  disabled={readOnly}
                />
                <Label htmlFor={`contratista_${miembro.id}`}>
                  Personal de Contratista
                </Label>
              </div>
            </CardContent>
          </Card>
        ))}

        {dotacion.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No hay personal asignado</p>
                <p className="text-sm">Agrega personal de buceo para continuar</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
