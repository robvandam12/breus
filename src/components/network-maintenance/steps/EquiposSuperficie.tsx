
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Settings, Wrench, AlertTriangle, CheckCircle } from "lucide-react";
import type { NetworkMaintenanceFormProps, EquipoSuperficie } from '@/types/network-maintenance';

export const EquiposSuperficie = ({ 
  formData, 
  updateFormData, 
  errors = {} 
}: NetworkMaintenanceFormProps) => {
  
  const equipos = formData.equipos_superficie || [];

  const addEquipo = () => {
    const newEquipo: EquipoSuperficie = {
      id: `equipo-${Date.now()}`,
      tipo: 'compresor',
      marca: '',
      modelo: '',
      numero_serie: '',
      estado: 'operativo',
      observaciones: ''
    };
    
    const updatedEquipos = [...equipos, newEquipo];
    updateFormData({ equipos_superficie: updatedEquipos });
  };

  const updateEquipo = (id: string, updates: Partial<EquipoSuperficie>) => {
    const updatedEquipos = equipos.map((equipo: EquipoSuperficie) =>
      equipo.id === id ? { ...equipo, ...updates } : equipo
    );
    updateFormData({ equipos_superficie: updatedEquipos });
  };

  const removeEquipo = (id: string) => {
    const updatedEquipos = equipos.filter((equipo: EquipoSuperficie) => equipo.id !== id);
    updateFormData({ equipos_superficie: updatedEquipos });
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'compresor': return <Settings className="h-4 w-4" />;
      case 'winche': return <Wrench className="h-4 w-4" />;
      case 'grua': return <Settings className="h-4 w-4" />;
      case 'embarcacion': return <Settings className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'operativo': return 'text-green-600 bg-green-50 border-green-200';
      case 'mantenimiento': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'fuera_servicio': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'operativo': return <CheckCircle className="h-4 w-4" />;
      case 'mantenimiento': return <Wrench className="h-4 w-4" />;
      case 'fuera_servicio': return <AlertTriangle className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'compresor': return 'Compresor';
      case 'winche': return 'Winche';
      case 'grua': return 'Grúa';
      case 'embarcacion': return 'Embarcación';
      case 'otro': return 'Otro';
      default: return tipo;
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'operativo': return 'Operativo';
      case 'mantenimiento': return 'En Mantenimiento';
      case 'fuera_servicio': return 'Fuera de Servicio';
      default: return estado;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Equipos de Superficie
        </h3>
        <p className="text-sm text-gray-600">
          Registra los equipos utilizados en la operación de mantención
        </p>
      </div>

      {/* Resumen de equipos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="h-4 w-4" />
            Resumen de Equipos ({equipos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {equipos.filter((e: EquipoSuperficie) => e.estado === 'operativo').length}
              </div>
              <div className="text-sm text-green-600">Operativos</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {equipos.filter((e: EquipoSuperficie) => e.estado === 'mantenimiento').length}
              </div>
              <div className="text-sm text-yellow-600">Mantenimiento</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {equipos.filter((e: EquipoSuperficie) => e.estado === 'fuera_servicio').length}
              </div>
              <div className="text-sm text-red-600">Fuera Servicio</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {equipos.filter((e: EquipoSuperficie) => e.tipo === 'compresor').length}
              </div>
              <div className="text-sm text-blue-600">Compresores</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de equipos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4" />
              Equipos Registrados
            </CardTitle>
            <Button onClick={addEquipo} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Equipo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {equipos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Settings className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p>No hay equipos registrados</p>
              <p className="text-sm">Los equipos son opcionales para esta operación</p>
            </div>
          ) : (
            <div className="space-y-4">
              {equipos.map((equipo: EquipoSuperficie) => (
                <Card key={equipo.id} className={`border ${getEstadoColor(equipo.estado)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getTipoIcon(equipo.tipo)}
                        <span className="font-medium text-gray-900">
                          {getTipoLabel(equipo.tipo)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium ${getEstadoColor(equipo.estado)}`}>
                          {getEstadoIcon(equipo.estado)}
                          {getEstadoLabel(equipo.estado)}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeEquipo(equipo.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor={`tipo-${equipo.id}`}>Tipo de Equipo</Label>
                        <Select
                          value={equipo.tipo}
                          onValueChange={(value) => updateEquipo(equipo.id, { tipo: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="compresor">Compresor</SelectItem>
                            <SelectItem value="winche">Winche</SelectItem>
                            <SelectItem value="grua">Grúa</SelectItem>
                            <SelectItem value="embarcacion">Embarcación</SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`estado-${equipo.id}`}>Estado</Label>
                        <Select
                          value={equipo.estado}
                          onValueChange={(value) => updateEquipo(equipo.id, { estado: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="operativo">Operativo</SelectItem>
                            <SelectItem value="mantenimiento">En Mantenimiento</SelectItem>
                            <SelectItem value="fuera_servicio">Fuera de Servicio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label htmlFor={`marca-${equipo.id}`}>Marca</Label>
                        <Input
                          id={`marca-${equipo.id}`}
                          value={equipo.marca}
                          onChange={(e) => updateEquipo(equipo.id, { marca: e.target.value })}
                          placeholder="Marca del equipo"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`modelo-${equipo.id}`}>Modelo</Label>
                        <Input
                          id={`modelo-${equipo.id}`}
                          value={equipo.modelo}
                          onChange={(e) => updateEquipo(equipo.id, { modelo: e.target.value })}
                          placeholder="Modelo del equipo"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`serie-${equipo.id}`}>Número de Serie</Label>
                        <Input
                          id={`serie-${equipo.id}`}
                          value={equipo.numero_serie || ''}
                          onChange={(e) => updateEquipo(equipo.id, { numero_serie: e.target.value })}
                          placeholder="Número de serie"
                        />
                      </div>
                    </div>

                    {equipo.observaciones !== undefined && (
                      <div>
                        <Label htmlFor={`obs-${equipo.id}`}>Observaciones</Label>
                        <Textarea
                          id={`obs-${equipo.id}`}
                          value={equipo.observaciones}
                          onChange={(e) => updateEquipo(equipo.id, { observaciones: e.target.value })}
                          placeholder="Observaciones sobre el equipo..."
                          rows={2}
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
          <Settings className="h-4 w-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Equipos de Superficie</p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Registra todos los equipos utilizados en la operación</li>
              <li>• El estado del equipo es crucial para la seguridad operacional</li>
              <li>• Los compresores son especialmente importantes para operaciones de buceo</li>
              <li>• Incluye números de serie para trazabilidad y mantenimiento</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
