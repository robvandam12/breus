
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Settings } from "lucide-react";
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

interface EquiposSuperficieProps {
  formData: NetworkMaintenanceData;
  updateFormData: (updates: Partial<NetworkMaintenanceData>) => void;
  readOnly?: boolean;
}

export const EquiposSuperficie = ({ formData, updateFormData, readOnly = false }: EquiposSuperficieProps) => {
  const equipos = formData.equipos_superficie || [];

  const addEquipo = () => {
    const newEquipo = {
      id: Date.now().toString(),
      equipo_sup: 'compresor_1' as const,
      matricula_eq: '',
      horometro_ini: 0,
      horometro_fin: 0
    };

    updateFormData({
      equipos_superficie: [...equipos, newEquipo]
    });
  };

  const updateEquipo = (id: string, field: string, value: any) => {
    const updatedEquipos = equipos.map(equipo =>
      equipo.id === id ? { ...equipo, [field]: value } : equipo
    );
    
    updateFormData({
      equipos_superficie: updatedEquipos
    });
  };

  const removeEquipo = (id: string) => {
    const filteredEquipos = equipos.filter(equipo => equipo.id !== id);
    updateFormData({
      equipos_superficie: filteredEquipos
    });
  };

  const getEquipoLabel = (tipo: string) => {
    const labels = {
      'compresor_1': 'Compresor 1',
      'compresor_2': 'Compresor 2'
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Equipos de Superficie
        </h3>
        <p className="text-sm text-gray-600">
          Registro de equipos utilizados durante la faena
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base">Lista de Equipos</CardTitle>
          {!readOnly && (
            <Button onClick={addEquipo} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Equipo
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {equipos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay equipos registrados
            </p>
          ) : (
            equipos.map((equipo) => (
              <div key={equipo.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                <div>
                  <Label htmlFor={`equipo_${equipo.id}`}>Tipo de Equipo</Label>
                  <Select
                    value={equipo.equipo_sup}
                    onValueChange={(value) => updateEquipo(equipo.id, 'equipo_sup', value)}
                    disabled={readOnly}
                  >
                    <SelectTrigger id={`equipo_${equipo.id}`}>
                      <SelectValue placeholder="Seleccionar equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compresor_1">Compresor 1</SelectItem>
                      <SelectItem value="compresor_2">Compresor 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`matricula_${equipo.id}`}>Nº Matrícula</Label>
                  <Input
                    id={`matricula_${equipo.id}`}
                    value={equipo.matricula_eq}
                    onChange={(e) => updateEquipo(equipo.id, 'matricula_eq', e.target.value)}
                    placeholder="Matrícula del equipo"
                    disabled={readOnly}
                  />
                </div>

                <div>
                  <Label htmlFor={`horometro_ini_${equipo.id}`}>Horómetro Inicio</Label>
                  <Input
                    id={`horometro_ini_${equipo.id}`}
                    type="number"
                    value={equipo.horometro_ini}
                    onChange={(e) => updateEquipo(equipo.id, 'horometro_ini', Number(e.target.value))}
                    placeholder="0"
                    disabled={readOnly}
                  />
                </div>

                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`horometro_fin_${equipo.id}`}>Horómetro Fin</Label>
                    <Input
                      id={`horometro_fin_${equipo.id}`}
                      type="number"
                      value={equipo.horometro_fin}
                      onChange={(e) => updateEquipo(equipo.id, 'horometro_fin', Number(e.target.value))}
                      placeholder="0"
                      disabled={readOnly}
                    />
                  </div>
                  {!readOnly && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeEquipo(equipo.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Resumen de equipos */}
      {equipos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumen de Equipos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {equipos.map((equipo) => (
                <div key={equipo.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{getEquipoLabel(equipo.equipo_sup)}</span>
                  <span className="text-sm text-gray-600">
                    {equipo.matricula_eq} • {equipo.horometro_fin - equipo.horometro_ini}h trabajadas
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
