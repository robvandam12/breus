
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Users, Clock, Award } from "lucide-react";
import type { NetworkMaintenanceData, DotacionBuceo as DotacionBuceoType } from '@/types/network-maintenance';

interface DotacionBuceoStepProps {
  formData: NetworkMaintenanceData;
  updateFormData: (data: Partial<NetworkMaintenanceData>) => void;
  errors?: Record<string, string>;
}

const ROLES_DISPONIBLES = [
  'supervisor',
  'buzo_emergencia_1', 
  'buzo_emergencia_2',
  'buzo_1',
  'buzo_2',
  'buzo_3',
  'buzo_4',
  'buzo_5',
  'buzo_6',
  'buzo_7',
  'buzo_8'
] as const;

const EQUIPOS_DISPONIBLES = ['liviano', 'mediano'] as const;

export const DotacionBuceo = ({ 
  formData, 
  updateFormData, 
  errors = {} 
}: DotacionBuceoStepProps) => {
  
  const [editingMember, setEditingMember] = useState<DotacionBuceoType | null>(null);

  const addMember = () => {
    const newMember: DotacionBuceoType = {
      id: `member-${Date.now()}`,
      rol: 'buzo_1',
      nombre: '',
      apellido: '',
      matricula: '',
      contratista: false,
      equipo: 'liviano'
    };
    
    const updatedDotacion = [...formData.dotacion, newMember];
    updateFormData({ dotacion: updatedDotacion });
    setEditingMember(newMember);
  };

  const updateMember = (id: string, updates: Partial<DotacionBuceoType>) => {
    const updatedDotacion = formData.dotacion.map(member =>
      member.id === id ? { ...member, ...updates } : member
    );
    updateFormData({ dotacion: updatedDotacion });
  };

  const removeMember = (id: string) => {
    const updatedDotacion = formData.dotacion.filter(member => member.id !== id);
    updateFormData({ dotacion: updatedDotacion });
    if (editingMember?.id === id) {
      setEditingMember(null);
    }
  };

  const getRoleColor = (rol: string) => {
    if (rol === 'supervisor') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (rol.includes('emergencia')) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const isRoleUsed = (rol: string, currentId?: string) => {
    return formData.dotacion.some(member => 
      member.rol === rol && member.id !== currentId
    );
  };

  const getRoleDisplayName = (rol: string) => {
    switch (rol) {
      case 'supervisor': return 'Supervisor';
      case 'buzo_emergencia_1': return 'Buzo Emergencia 1';
      case 'buzo_emergencia_2': return 'Buzo Emergencia 2';
      case 'buzo_1': return 'Buzo 1';
      case 'buzo_2': return 'Buzo 2';
      case 'buzo_3': return 'Buzo 3';
      case 'buzo_4': return 'Buzo 4';
      case 'buzo_5': return 'Buzo 5';
      case 'buzo_6': return 'Buzo 6';
      case 'buzo_7': return 'Buzo 7';
      case 'buzo_8': return 'Buzo 8';
      default: return rol;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Dotación de Buceo
        </h3>
        <p className="text-sm text-gray-600">
          Gestión de personal y roles asignados para la mantención de redes
        </p>
      </div>

      {/* Resumen de dotación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />
            Resumen de Dotación ({formData.dotacion.length} personas)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formData.dotacion.filter(m => m.rol === 'supervisor').length}
              </div>
              <div className="text-sm text-blue-600">Supervisores</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {formData.dotacion.filter(m => m.rol.includes('emergencia')).length}
              </div>
              <div className="text-sm text-red-600">Buzos Emergencia</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formData.dotacion.filter(m => m.rol.startsWith('buzo_') && !m.rol.includes('emergencia')).length}
              </div>
              <div className="text-sm text-green-600">Buzos</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {formData.dotacion.filter(m => m.contratista).length}
              </div>
              <div className="text-sm text-yellow-600">Contratistas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de miembros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Personal Asignado</CardTitle>
            <Button onClick={addMember} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Persona
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {formData.dotacion.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p>No hay personal asignado</p>
              <p className="text-sm">Agrega personas a la dotación para continuar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {formData.dotacion.map((member) => (
                <div key={member.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(member.rol)}`}>
                        {getRoleDisplayName(member.rol)}
                      </span>
                      {member.contratista && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                          Contratista
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingMember(member)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500">Nombre Completo</Label>
                      <p className="font-medium">{member.nombre} {member.apellido}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Matrícula</Label>
                      <p>{member.matricula || 'No especificada'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Equipo</Label>
                      <p className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        {member.equipo}
                      </p>
                    </div>
                  </div>

                  {(member.hora_inicio_buzo || member.hora_fin_buzo || member.profundidad) && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {member.hora_inicio_buzo && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span>Inicio: {member.hora_inicio_buzo}</span>
                          </div>
                        )}
                        {member.hora_fin_buzo && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span>Fin: {member.hora_fin_buzo}</span>
                          </div>
                        )}
                        {member.profundidad && (
                          <div>
                            <span>Profundidad: {member.profundidad}m</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de edición */}
      {editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingMember.nombre ? `Editar: ${editingMember.nombre} ${editingMember.apellido}` : 'Nuevo Miembro'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={editingMember.nombre}
                    onChange={(e) => updateMember(editingMember.id, { nombre: e.target.value })}
                    placeholder="Nombre"
                  />
                </div>
                <div>
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input
                    id="apellido"
                    value={editingMember.apellido}
                    onChange={(e) => updateMember(editingMember.id, { apellido: e.target.value })}
                    placeholder="Apellido"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rol">Rol</Label>
                  <Select
                    value={editingMember.rol}
                    onValueChange={(value) => updateMember(editingMember.id, { rol: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES_DISPONIBLES.map((rol) => (
                        <SelectItem 
                          key={rol} 
                          value={rol}
                          disabled={isRoleUsed(rol, editingMember.id)}
                        >
                          {getRoleDisplayName(rol)} {isRoleUsed(rol, editingMember.id) && '(Ya asignado)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="matricula">Matrícula</Label>
                  <Input
                    id="matricula"
                    value={editingMember.matricula}
                    onChange={(e) => updateMember(editingMember.id, { matricula: e.target.value })}
                    placeholder="Número de matrícula"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="equipo">Tipo de Equipo</Label>
                  <Select
                    value={editingMember.equipo}
                    onValueChange={(value) => updateMember(editingMember.id, { equipo: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EQUIPOS_DISPONIBLES.map((equipo) => (
                        <SelectItem key={equipo} value={equipo}>
                          {equipo.charAt(0).toUpperCase() + equipo.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="contratista"
                    checked={editingMember.contratista}
                    onCheckedChange={(checked) => updateMember(editingMember.id, { contratista: checked })}
                  />
                  <Label htmlFor="contratista">Es Contratista</Label>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Horarios y Profundidad (Opcional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="hora_inicio">Hora Inicio</Label>
                    <Input
                      id="hora_inicio"
                      type="time"
                      value={editingMember.hora_inicio_buzo || ''}
                      onChange={(e) => updateMember(editingMember.id, { hora_inicio_buzo: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hora_fin">Hora Fin</Label>
                    <Input
                      id="hora_fin"
                      type="time"
                      value={editingMember.hora_fin_buzo || ''}
                      onChange={(e) => updateMember(editingMember.id, { hora_fin_buzo: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="profundidad">Profundidad (m)</Label>
                    <Input
                      id="profundidad"
                      type="number"
                      step="0.1"
                      value={editingMember.profundidad || ''}
                      onChange={(e) => updateMember(editingMember.id, { profundidad: parseFloat(e.target.value) || undefined })}
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditingMember(null)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={() => setEditingMember(null)}
                  disabled={!editingMember.nombre || !editingMember.apellido}
                >
                  Guardar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Información de ayuda */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Users className="h-4 w-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Gestión de Dotación</p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Cada rol puede ser asignado a múltiples personas</li>
              <li>• Los campos de nombre y apellido son obligatorios</li>
              <li>• Los horarios y profundidad son opcionales</li>
              <li>• Marca como contratista si corresponde</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
