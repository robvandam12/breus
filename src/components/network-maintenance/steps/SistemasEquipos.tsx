
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Cog } from "lucide-react";
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

interface SistemasEquiposProps {
  formData: NetworkMaintenanceData;
  updateFormData: (updates: Partial<NetworkMaintenanceData>) => void;
  readOnly?: boolean;
}

export const SistemasEquipos = ({ formData, updateFormData, readOnly = false }: SistemasEquiposProps) => {
  const sistemas = formData.sistemas_equipos || [];

  const addSistema = () => {
    const newSistema = {
      id: Date.now().toString(),
      jaulas_sist: '',
      tipo_trabajo_sist: [],
      focos: 0,
      extractor: 0,
      aireacion: 0,
      oxigenacion: 0,
      otros_sist: '',
      obs_sist: ''
    };

    updateFormData({
      sistemas_equipos: [...sistemas, newSistema]
    });
  };

  const updateSistema = (id: string, field: string, value: any) => {
    const updatedSistemas = sistemas.map(sistema =>
      sistema.id === id ? { ...sistema, [field]: value } : sistema
    );
    
    updateFormData({
      sistemas_equipos: updatedSistemas
    });
  };

  const removeSistema = (id: string) => {
    const filteredSistemas = sistemas.filter(sistema => sistema.id !== id);
    updateFormData({
      sistemas_equipos: filteredSistemas
    });
  };

  const toggleTipoTrabajo = (sistemaId: string, trabajo: string) => {
    const sistema = sistemas.find(s => s.id === sistemaId);
    if (!sistema) return;

    const trabajos = sistema.tipo_trabajo_sist || [];
    const isSelected = trabajos.includes(trabajo);
    
    const newTrabajos = isSelected 
      ? trabajos.filter(t => t !== trabajo)
      : [...trabajos, trabajo];

    updateSistema(sistemaId, 'tipo_trabajo_sist', newTrabajos);
  };

  const tiposTrabajoDisponibles = [
    'Instalación',
    'Mantención',
    'Recuperación', 
    'Limpieza',
    'Ajuste'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Cog className="w-5 h-5" />
          Sistemas y Equipos
        </h3>
        <p className="text-sm text-gray-600">
          Registro de trabajos en sistemas operativos
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base">Lista de Sistemas</CardTitle>
          {!readOnly && (
            <Button onClick={addSistema} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Sistema
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {sistemas.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay sistemas registrados
            </p>
          ) : (
            sistemas.map((sistema) => (
              <div key={sistema.id} className="p-4 border rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`jaulas_sist_${sistema.id}`}>Nº Jaula(s)</Label>
                    <Input
                      id={`jaulas_sist_${sistema.id}`}
                      value={sistema.jaulas_sist}
                      onChange={(e) => updateSistema(sistema.id, 'jaulas_sist', e.target.value)}
                      placeholder="Ej: 1, 2-5, 10"
                      disabled={readOnly}
                    />
                  </div>
                </div>

                {/* Tipos de trabajo */}
                <div>
                  <Label>Tipo de Trabajo (marcar con "X")</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                    {tiposTrabajoDisponibles.map((trabajo) => (
                      <div key={trabajo} className="flex items-center space-x-2">
                        <Checkbox
                          id={`trabajo_${sistema.id}_${trabajo}`}
                          checked={(sistema.tipo_trabajo_sist || []).includes(trabajo)}
                          onCheckedChange={() => toggleTipoTrabajo(sistema.id, trabajo)}
                          disabled={readOnly}
                        />
                        <Label htmlFor={`trabajo_${sistema.id}_${trabajo}`} className="text-sm">
                          {trabajo}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Equipos específicos */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor={`focos_${sistema.id}`}>Focos Fotoperíodo</Label>
                    <Input
                      id={`focos_${sistema.id}`}
                      type="number"
                      value={sistema.focos}
                      onChange={(e) => updateSistema(sistema.id, 'focos', Number(e.target.value))}
                      placeholder="0"
                      disabled={readOnly}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`extractor_${sistema.id}`}>Extractor Mortalidad</Label>
                    <Input
                      id={`extractor_${sistema.id}`}
                      type="number"
                      value={sistema.extractor}
                      onChange={(e) => updateSistema(sistema.id, 'extractor', Number(e.target.value))}
                      placeholder="0"
                      disabled={readOnly}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`aireacion_${sistema.id}`}>Sistema Aireación</Label>
                    <Input
                      id={`aireacion_${sistema.id}`}
                      type="number"
                      value={sistema.aireacion}
                      onChange={(e) => updateSistema(sistema.id, 'aireacion', Number(e.target.value))}
                      placeholder="0"
                      disabled={readOnly}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`oxigenacion_${sistema.id}`}>Sistema Oxigenación</Label>
                    <Input
                      id={`oxigenacion_${sistema.id}`}
                      type="number"
                      value={sistema.oxigenacion}
                      onChange={(e) => updateSistema(sistema.id, 'oxigenacion', Number(e.target.value))}
                      placeholder="0"
                      disabled={readOnly}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`otros_sist_${sistema.id}`}>Otros</Label>
                  <Input
                    id={`otros_sist_${sistema.id}`}
                    value={sistema.otros_sist}
                    onChange={(e) => updateSistema(sistema.id, 'otros_sist', e.target.value)}
                    placeholder="Otros equipos o sistemas"
                    disabled={readOnly}
                  />
                </div>

                <div>
                  <Label htmlFor={`obs_sist_${sistema.id}`}>Observaciones</Label>
                  <Textarea
                    id={`obs_sist_${sistema.id}`}
                    value={sistema.obs_sist}
                    onChange={(e) => updateSistema(sistema.id, 'obs_sist', e.target.value)}
                    placeholder="Observaciones del trabajo realizado..."
                    rows={3}
                    disabled={readOnly}
                  />
                </div>

                {!readOnly && (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSistema(sistema.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar Sistema
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Resumen de sistemas */}
      {sistemas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumen de Sistemas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">
                  {sistemas.reduce((sum, s) => sum + s.focos, 0)}
                </div>
                <div className="text-xs text-blue-600">Focos Totales</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">
                  {sistemas.reduce((sum, s) => sum + s.extractor, 0)}
                </div>
                <div className="text-xs text-green-600">Extractores</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">
                  {sistemas.reduce((sum, s) => sum + s.aireacion, 0)}
                </div>
                <div className="text-xs text-purple-600">Aireación</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-xl font-bold text-orange-600">
                  {sistemas.reduce((sum, s) => sum + s.oxigenacion, 0)}
                </div>
                <div className="text-xs text-orange-600">Oxigenación</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
