
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Settings, Gauge } from "lucide-react";
import type { NetworkMaintenanceData, EquipoSuperficie } from '@/types/network-maintenance';

interface EquiposSuperficieProps {
  formData: NetworkMaintenanceData;
  updateFormData: (data: Partial<NetworkMaintenanceData>) => void;
  errors?: Record<string, string>;
}

export const EquiposSuperficie = ({ 
  formData, 
  updateFormData, 
  errors = {} 
}: EquiposSuperficieProps) => {
  
  const addEquipo = () => {
    const newEquipo: EquipoSuperficie = {
      id: `equipo-${Date.now()}`,
      equipo_sup: 'Compresor 1',
      matricula_eq: '',
      horometro_ini: 0,
      horometro_fin: 0
    };
    
    const updatedEquipos = [...formData.equipos_superficie, newEquipo];
    updateFormData({ equipos_superficie: updatedEquipos });
  };

  const updateEquipo = (id: string, updates: Partial<EquipoSuperficie>) => {
    const updatedEquipos = formData.equipos_superficie.map(equipo =>
      equipo.id === id ? { ...equipo, ...updates } : equipo
    );
    updateFormData({ equipos_superficie: updatedEquipos });
  };

  const removeEquipo = (id: string) => {
    const updatedEquipos = formData.equipos_superficie.filter(equipo => equipo.id !== id);
    updateFormData({ equipos_superficie: updatedEquipos });
  };

  const calcularHorasTrabajo = (inicio: number, fin: number): number => {
    return Math.max(0, fin - inicio);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Equipos de Superficie
        </h3>
        <p className="text-sm text-gray-600">
          Registro de compresores y equipos utilizados para mantención de redes
        </p>
      </div>

      {/* Resumen de equipos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="h-4 w-4" />
            Resumen de Equipos ({formData.equipos_superficie.length} equipos)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formData.equipos_superficie.filter(e => e.equipo_sup === 'Compresor 1').length}
              </div>
              <div className="text-sm text-blue-600">Compresores 1</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formData.equipos_superficie.filter(e => e.equipo_sup === 'Compresor 2').length}
              </div>
              <div className="text-sm text-green-600">Compresores 2</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formData.equipos_superficie.reduce((total, eq) => 
                  total + calcularHorasTrabajo(eq.horometro_ini, eq.horometro_fin), 0
                ).toFixed(1)}
              </div>
              <div className="text-sm text-purple-600">Horas Totales</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de equipos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Equipos Registrados</CardTitle>
            <Button onClick={addEquipo} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Equipo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {formData.equipos_superficie.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Settings className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p>No hay equipos registrados</p>
              <p className="text-sm">Agrega equipos de superficie para continuar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.equipos_superficie.map((equipo) => (
                <Card key={equipo.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                      <div>
                        <Label htmlFor={`tipo-${equipo.id}`}>Tipo de Equipo</Label>
                        <Select
                          value={equipo.equipo_sup}
                          onValueChange={(value) => updateEquipo(equipo.id, { equipo_sup: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Compresor 1">Compresor 1</SelectItem>
                            <SelectItem value="Compresor 2">Compresor 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`matricula-${equipo.id}`}>Matrícula/ID</Label>
                        <Input
                          id={`matricula-${equipo.id}`}
                          value={equipo.matricula_eq}
                          onChange={(e) => updateEquipo(equipo.id, { matricula_eq: e.target.value })}
                          placeholder="Ej: CMP-001"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`inicio-${equipo.id}`}>Horómetro Inicial</Label>
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-gray-400" />
                          <Input
                            id={`inicio-${equipo.id}`}
                            type="number"
                            step="0.1"
                            value={equipo.horometro_ini}
                            onChange={(e) => updateEquipo(equipo.id, { horometro_ini: parseFloat(e.target.value) || 0 })}
                            placeholder="0.0"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`fin-${equipo.id}`}>Horómetro Final</Label>
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-gray-400" />
                          <Input
                            id={`fin-${equipo.id}`}
                            type="number"
                            step="0.1"
                            value={equipo.horometro_fin}
                            onChange={(e) => updateEquipo(equipo.id, { horometro_fin: parseFloat(e.target.value) || 0 })}
                            placeholder="0.0"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-sm">
                          <span className="font-medium">Horas trabajadas:</span>
                          <div className="text-lg font-bold text-blue-600">
                            {calcularHorasTrabajo(equipo.horometro_ini, equipo.horometro_fin).toFixed(1)}h
                          </div>
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
            <p className="text-sm font-medium text-blue-900">Registro de Equipos</p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Registra todos los compresores utilizados</li>
              <li>• El horómetro final debe ser mayor al inicial</li>
              <li>• Las horas trabajadas se calculan automáticamente</li>
              <li>• Asegúrate de registrar la matrícula correcta</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
