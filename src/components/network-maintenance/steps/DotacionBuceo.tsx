
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Users, UserCheck } from "lucide-react";
import type { NetworkMaintenanceData, DotacionBuceo } from '@/types/network-maintenance';

interface DotacionBuceoProps {
  formData: NetworkMaintenanceData;
  updateFormData: (updates: Partial<NetworkMaintenanceData>) => void;
}

export const DotacionBuceo = ({ formData, updateFormData }: DotacionBuceoProps) => {
  const dotacion = formData.dotacion || [];

  const agregarMiembro = () => {
    const nuevoMiembro: DotacionBuceo = {
      id: Date.now().toString(),
      nombre: '',
      apellido: '',
      rol: 'buzo',
      matricula: '',
      equipo: '',
      hora_inicio_buzo: '',
      hora_fin_buzo: '',
      profundidad: 0,
      contratista: false
    };

    updateFormData({
      dotacion: [...dotacion, nuevoMiembro]
    });
  };

  const actualizarMiembro = (id: string, campo: keyof DotacionBuceo, valor: any) => {
    const dotacionActualizada = dotacion.map(miembro =>
      miembro.id === id ? { ...miembro, [campo]: valor } : miembro
    );
    updateFormData({ dotacion: dotacionActualizada });
  };

  const eliminarMiembro = (id: string) => {
    const dotacionActualizada = dotacion.filter(miembro => miembro.id !== id);
    updateFormData({ dotacion: dotacionActualizada });
  };

  const contarPorRol = (rol: string) => {
    return dotacion.filter(miembro => miembro.rol === rol).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Dotación de Buceo
          </h3>
          <p className="text-sm text-gray-600">
            Personal asignado para la operación de mantención de redes
          </p>
        </div>
        <Button onClick={agregarMiembro} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Miembro
        </Button>
      </div>

      {/* Resumen de roles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumen por Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{contarPorRol('buzo')}</div>
              <div className="text-sm text-blue-600">Buzos</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{contarPorRol('supervisor')}</div>
              <div className="text-sm text-green-600">Supervisores</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{contarPorRol('asistente')}</div>
              <div className="text-sm text-orange-600">Asistentes</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{contarPorRol('operador_superficie')}</div>
              <div className="text-sm text-purple-600">Operadores</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de miembros */}
      <div className="space-y-4">
        {dotacion.map((miembro, index) => (
          <Card key={miembro.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Miembro {index + 1}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => eliminarMiembro(miembro.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`nombre_${miembro.id}`}>Nombre *</Label>
                  <Input
                    id={`nombre_${miembro.id}`}
                    value={miembro.nombre}
                    onChange={(e) => actualizarMiembro(miembro.id, 'nombre', e.target.value)}
                    placeholder="Nombre"
                  />
                </div>

                <div>
                  <Label htmlFor={`apellido_${miembro.id}`}>Apellido</Label>
                  <Input
                    id={`apellido_${miembro.id}`}
                    value={miembro.apellido || ''}
                    onChange={(e) => actualizarMiembro(miembro.id, 'apellido', e.target.value)}
                    placeholder="Apellido"
                  />
                </div>

                <div>
                  <Label htmlFor={`rol_${miembro.id}`}>Rol *</Label>
                  <Select
                    value={miembro.rol}
                    onValueChange={(value) => actualizarMiembro(miembro.id, 'rol', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buzo">Buzo</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="asistente">Asistente de Buceo</SelectItem>
                      <SelectItem value="operador_superficie">Operador de Superficie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`matricula_${miembro.id}`}>Matrícula/Certificación</Label>
                  <Input
                    id={`matricula_${miembro.id}`}
                    value={miembro.matricula || ''}
                    onChange={(e) => actualizarMiembro(miembro.id, 'matricula', e.target.value)}
                    placeholder="Ej: BUZ-12345"
                  />
                </div>

                <div>
                  <Label htmlFor={`equipo_${miembro.id}`}>Equipo Asignado</Label>
                  <Input
                    id={`equipo_${miembro.id}`}
                    value={miembro.equipo || ''}
                    onChange={(e) => actualizarMiembro(miembro.id, 'equipo', e.target.value)}
                    placeholder="Ej: Equipo de buceo #1"
                  />
                </div>
              </div>

              {miembro.rol === 'buzo' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`hora_inicio_${miembro.id}`}>Hora Inicio Buceo</Label>
                    <Input
                      id={`hora_inicio_${miembro.id}`}
                      type="time"
                      value={miembro.hora_inicio_buzo || ''}
                      onChange={(e) => actualizarMiembro(miembro.id, 'hora_inicio_buzo', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`hora_fin_${miembro.id}`}>Hora Fin Buceo</Label>
                    <Input
                      id={`hora_fin_${miembro.id}`}
                      type="time"
                      value={miembro.hora_fin_buzo || ''}
                      onChange={(e) => actualizarMiembro(miembro.id, 'hora_fin_buzo', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`profundidad_${miembro.id}`}>Profundidad Máxima (m)</Label>
                    <Input
                      id={`profundidad_${miembro.id}`}
                      type="number"
                      step="0.1"
                      value={miembro.profundidad || 0}
                      onChange={(e) => actualizarMiembro(miembro.id, 'profundidad', parseFloat(e.target.value) || 0)}
                      placeholder="0.0"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`contratista_${miembro.id}`}
                  checked={miembro.contratista || false}
                  onCheckedChange={(checked) => actualizarMiembro(miembro.id, 'contratista', checked)}
                />
                <Label htmlFor={`contratista_${miembro.id}`}>
                  Personal de empresa contratista
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
                <p className="text-sm">Agrega miembros de la dotación para continuar</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
