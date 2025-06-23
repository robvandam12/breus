
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Cpu, Radio, Shield, Navigation, Settings } from "lucide-react";
import type { NetworkMaintenanceFormProps, SistemaEquipo } from '@/types/network-maintenance';

export const SistemasEquipos = ({ 
  formData, 
  updateFormData, 
  errors = {} 
}: NetworkMaintenanceFormProps) => {
  
  const sistemas = formData.sistemas_equipos || [];

  const addSistema = () => {
    const newSistema: SistemaEquipo = {
      id: `sistema-${Date.now()}`,
      sistema: 'comunicaciones',
      descripcion: '',
      estado: 'operativo',
      responsable: '',
      observaciones: ''
    };
    
    const updatedSistemas = [...sistemas, newSistema];
    updateFormData({ sistemas_equipos: updatedSistemas });
  };

  const updateSistema = (id: string, updates: Partial<SistemaEquipo>) => {
    const updatedSistemas = sistemas.map((sistema: SistemaEquipo) =>
      sistema.id === id ? { ...sistema, ...updates } : sistema
    );
    updateFormData({ sistemas_equipos: updatedSistemas });
  };

  const removeSistema = (id: string) => {
    const updatedSistemas = sistemas.filter((sistema: SistemaEquipo) => sistema.id !== id);
    updateFormData({ sistemas_equipos: updatedSistemas });
  };

  const getSistemaIcon = (sistema: string) => {
    switch (sistema) {
      case 'comunicaciones': return <Radio className="h-4 w-4" />;
      case 'aire_comprimido': return <Cpu className="h-4 w-4" />;
      case 'emergencia': return <Shield className="h-4 w-4" />;
      case 'navegacion': return <Navigation className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'operativo': return 'text-green-600 bg-green-50 border-green-200';
      case 'falla': return 'text-red-600 bg-red-50 border-red-200';
      case 'mantenimiento': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSistemaLabel = (sistema: string) => {
    switch (sistema) {
      case 'comunicaciones': return 'Comunicaciones';
      case 'aire_comprimido': return 'Aire Comprimido';
      case 'emergencia': return 'Emergencia';
      case 'navegacion': return 'Navegación';
      case 'otro': return 'Otro';
      default: return sistema;
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'operativo': return 'Operativo';
      case 'falla': return 'Con Falla';
      case 'mantenimiento': return 'En Mantenimiento';
      default: return estado;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Sistemas y Equipos Operacionales
        </h3>
        <p className="text-sm text-gray-600">
          Registra el estado de los sistemas críticos para la operación
        </p>
      </div>

      {/* Resumen de sistemas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Cpu className="h-4 w-4" />
            Resumen de Sistemas ({sistemas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {sistemas.filter((s: SistemaEquipo) => s.estado === 'operativo').length}
              </div>
              <div className="text-sm text-green-600">Operativos</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {sistemas.filter((s: SistemaEquipo) => s.estado === 'falla').length}
              </div>
              <div className="text-sm text-red-600">Con Fallas</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {sistemas.filter((s: SistemaEquipo) => s.estado === 'mantenimiento').length}
              </div>
              <div className="text-sm text-yellow-600">Mantenimiento</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {sistemas.filter((s: SistemaEquipo) => s.sistema === 'comunicaciones').length}
              </div>
              <div className="text-sm text-blue-600">Comunicaciones</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de sistemas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4" />
              Sistemas Registrados
            </CardTitle>
            <Button onClick={addSistema} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Sistema
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sistemas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Cpu className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p>No hay sistemas registrados</p>
              <p className="text-sm">Los sistemas son opcionales para esta operación</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sistemas.map((sistema: SistemaEquipo) => (
                <Card key={sistema.id} className={`border ${getEstadoColor(sistema.estado)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getSistemaIcon(sistema.sistema)}
                        <span className="font-medium text-gray-900">
                          {getSistemaLabel(sistema.sistema)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded-md text-sm font-medium ${getEstadoColor(sistema.estado)}`}>
                          {getEstadoLabel(sistema.estado)}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSistema(sistema.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor={`sistema-${sistema.id}`}>Tipo de Sistema</Label>
                        <Select
                          value={sistema.sistema}
                          onValueChange={(value) => updateSistema(sistema.id, { sistema: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="comunicaciones">Comunicaciones</SelectItem>
                            <SelectItem value="aire_comprimido">Aire Comprimido</SelectItem>
                            <SelectItem value="emergencia">Emergencia</SelectItem>
                            <SelectItem value="navegacion">Navegación</SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`estado-${sistema.id}`}>Estado</Label>
                        <Select
                          value={sistema.estado}
                          onValueChange={(value) => updateSistema(sistema.id, { estado: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="operativo">Operativo</SelectItem>
                            <SelectItem value="falla">Con Falla</SelectItem>
                            <SelectItem value="mantenimiento">En Mantenimiento</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`descripcion-${sistema.id}`}>Descripción</Label>
                        <Input
                          id={`descripcion-${sistema.id}`}
                          value={sistema.descripcion}
                          onChange={(e) => updateSistema(sistema.id, { descripcion: e.target.value })}
                          placeholder="Describe el sistema o equipo..."
                        />
                      </div>

                      <div>
                        <Label htmlFor={`responsable-${sistema.id}`}>Responsable</Label>
                        <Input
                          id={`responsable-${sistema.id}`}
                          value={sistema.responsable}
                          onChange={(e) => updateSistema(sistema.id, { responsable: e.target.value })}
                          placeholder="Nombre del responsable"
                        />
                      </div>

                      {sistema.observaciones !== undefined && (
                        <div>
                          <Label htmlFor={`obs-${sistema.id}`}>Observaciones</Label>
                          <Textarea
                            id={`obs-${sistema.id}`}
                            value={sistema.observaciones}
                            onChange={(e) => updateSistema(sistema.id, { observaciones: e.target.value })}
                            placeholder="Observaciones sobre el sistema..."
                            rows={2}
                          />
                        </div>
                      )}
                    </div>
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
          <Cpu className="h-4 w-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Sistemas Operacionales</p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Los sistemas de comunicaciones son críticos para la seguridad</li>
              <li>• El aire comprimido es esencial para operaciones de buceo</li>
              <li>• Los sistemas de emergencia deben estar siempre operativos</li>
              <li>• Asigna responsables para cada sistema crítico</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
