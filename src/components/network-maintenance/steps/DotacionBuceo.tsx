
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Users, UserCheck, Clock, Waves } from "lucide-react";
import type { NetworkMaintenanceFormProps, PersonalBuceo } from '@/types/network-maintenance';

export const DotacionBuceo = ({ 
  formData, 
  updateFormData, 
  errors = {} 
}: NetworkMaintenanceFormProps) => {
  
  const dotacion = formData.dotacion || [];

  const addPersonal = () => {
    const newPersonal: PersonalBuceo = {
      id: `personal-${Date.now()}`,
      nombre: '',
      rol: 'buzo_industrial',
      certificaciones: [],
      tiempo_inmersion: 0,
      profundidad_max: 0,
      observaciones: ''
    };
    
    const updatedDotacion = [...dotacion, newPersonal];
    updateFormData({ dotacion: updatedDotacion });
  };

  const updatePersonal = (id: string, updates: Partial<PersonalBuceo>) => {
    const updatedDotacion = dotacion.map((personal: PersonalBuceo) =>
      personal.id === id ? { ...personal, ...updates } : personal
    );
    updateFormData({ dotacion: updatedDotacion });
  };

  const removePersonal = (id: string) => {
    const updatedDotacion = dotacion.filter((personal: PersonalBuceo) => personal.id !== id);
    updateFormData({ dotacion: updatedDotacion });
  };

  const getRolColor = (rol: string) => {
    switch (rol) {
      case 'supervisor': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'buzo_especialista': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'buzo_industrial': return 'text-green-600 bg-green-50 border-green-200';
      case 'buzo_aprendiz': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRolLabel = (rol: string) => {
    switch (rol) {
      case 'supervisor': return 'Supervisor';
      case 'buzo_especialista': return 'Buzo Especialista';
      case 'buzo_industrial': return 'Buzo Industrial';
      case 'buzo_aprendiz': return 'Buzo Aprendiz';
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
          Registra el personal de buceo asignado a la operación
        </p>
      </div>

      {/* Resumen de dotación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />
            Resumen de Personal ({dotacion.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {dotacion.filter((p: PersonalBuceo) => p.rol === 'supervisor').length}
              </div>
              <div className="text-sm text-purple-600">Supervisores</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {dotacion.filter((p: PersonalBuceo) => p.rol === 'buzo_especialista').length}
              </div>
              <div className="text-sm text-blue-600">Especialistas</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {dotacion.filter((p: PersonalBuceo) => p.rol === 'buzo_industrial').length}
              </div>
              <div className="text-sm text-green-600">Industriales</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {dotacion.filter((p: PersonalBuceo) => p.rol === 'buzo_aprendiz').length}
              </div>
              <div className="text-sm text-orange-600">Aprendices</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de personal */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <UserCheck className="h-4 w-4" />
              Personal de Buceo
            </CardTitle>
            <Button onClick={addPersonal} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Personal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {dotacion.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p>No hay personal registrado</p>
              <p className="text-sm">Agrega el personal de buceo para continuar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dotacion.map((personal: PersonalBuceo) => (
                <Card key={personal.id} className={`border ${getRolColor(personal.rol)}`}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor={`nombre-${personal.id}`}>Nombre Completo *</Label>
                        <Input
                          id={`nombre-${personal.id}`}
                          value={personal.nombre}
                          onChange={(e) => updatePersonal(personal.id, { nombre: e.target.value })}
                          placeholder="Nombre y apellidos"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`rol-${personal.id}`}>Rol</Label>
                        <Select
                          value={personal.rol}
                          onValueChange={(value) => updatePersonal(personal.id, { rol: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="supervisor">Supervisor</SelectItem>
                            <SelectItem value="buzo_especialista">Buzo Especialista</SelectItem>
                            <SelectItem value="buzo_industrial">Buzo Industrial</SelectItem>
                            <SelectItem value="buzo_aprendiz">Buzo Aprendiz</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div>
                        <Label htmlFor={`tiempo-${personal.id}`}>Tiempo Inmersión (min)</Label>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <Input
                            id={`tiempo-${personal.id}`}
                            type="number"
                            min="0"
                            value={personal.tiempo_inmersion || 0}
                            onChange={(e) => updatePersonal(personal.id, { tiempo_inmersion: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`profundidad-${personal.id}`}>Profundidad Máx (m)</Label>
                        <div className="flex items-center gap-2">
                          <Waves className="h-4 w-4 text-gray-400" />
                          <Input
                            id={`profundidad-${personal.id}`}
                            type="number"
                            step="0.1"
                            min="0"
                            value={personal.profundidad_max || 0}
                            onChange={(e) => updatePersonal(personal.id, { profundidad_max: parseFloat(e.target.value) || 0 })}
                            placeholder="0.0"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded-md text-sm font-medium ${getRolColor(personal.rol)}`}>
                          {getRolLabel(personal.rol)}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removePersonal(personal.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {personal.observaciones !== undefined && (
                      <div className="mt-4">
                        <Label htmlFor={`obs-${personal.id}`}>Observaciones</Label>
                        <Input
                          id={`obs-${personal.id}`}
                          value={personal.observaciones}
                          onChange={(e) => updatePersonal(personal.id, { observaciones: e.target.value })}
                          placeholder="Observaciones adicionales..."
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información de ayuda */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Users className="h-4 w-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Dotación de Buceo</p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Al menos un supervisor debe estar presente en cada operación</li>
              <li>• Los tiempos de inmersión se registran para control de seguridad</li>
              <li>• La profundidad máxima debe cumplir con las certificaciones del personal</li>
              <li>• Cada rol tiene responsabilidades específicas en la operación</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
