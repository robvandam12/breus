
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Settings, Wrench } from "lucide-react";
import type { NetworkMaintenanceData, SistemaEquipo } from '@/types/network-maintenance';

interface SistemasEquiposProps {
  formData: NetworkMaintenanceData;
  updateFormData: (updates: Partial<NetworkMaintenanceData>) => void;
}

export const SistemasEquipos = ({ formData, updateFormData }: SistemasEquiposProps) => {
  const sistemas = formData.sistemas_equipos || [];

  const agregarSistema = () => {
    const nuevoSistema: SistemaEquipo = {
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
      sistemas_equipos: [...sistemas, nuevoSistema]
    });
  };

  const actualizarSistema = (id: string, campo: keyof SistemaEquipo, valor: any) => {
    const sistemasActualizados = sistemas.map(sistema =>
      sistema.id === id ? { ...sistema, [campo]: valor } : sistema
    );
    updateFormData({ sistemas_equipos: sistemasActualizados });
  };

  const eliminarSistema = (id: string) => {
    const sistemasActualizados = sistemas.filter(sistema => sistema.id !== id);
    updateFormData({ sistemas_equipos: sistemasActualizados });
  };

  const toggleTipoTrabajo = (sistemaId: string, tipo: string) => {
    const sistema = sistemas.find(s => s.id === sistemaId);
    if (!sistema) return;

    const tiposActuales = sistema.tipo_trabajo_sist || [];
    const nuevos = tiposActuales.includes(tipo)
      ? tiposActuales.filter(t => t !== tipo)
      : [...tiposActuales, tipo];
    
    actualizarSistema(sistemaId, 'tipo_trabajo_sist', nuevos);
  };

  const tiposTrabajo = [
    'Instalación',
    'Mantención', 
    'Recuperación',
    'Limpieza',
    'Ajuste'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Sistemas y Equipos Operacionales
          </h3>
          <p className="text-sm text-gray-600">
            Registro de trabajos en sistemas y equipos de la instalación
          </p>
        </div>
        <Button onClick={agregarSistema} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Sistema
        </Button>
      </div>

      <div className="space-y-4">
        {sistemas.map((sistema, index) => (
          <Card key={sistema.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Sistema {index + 1}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => eliminarSistema(sistema.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`jaulas_sist_${sistema.id}`}>Nº Jaula(s)</Label>
                  <Input
                    id={`jaulas_sist_${sistema.id}`}
                    value={sistema.jaulas_sist}
                    onChange={(e) => actualizarSistema(sistema.id, 'jaulas_sist', e.target.value)}
                    placeholder="Ej: J1, J2, J3"
                  />
                </div>

                <div>
                  <Label>Tipo de Trabajo</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {tiposTrabajo.map((tipo) => (
                      <label key={tipo} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={sistema.tipo_trabajo_sist?.includes(tipo) || false}
                          onChange={() => toggleTipoTrabajo(sistema.id, tipo)}
                          className="rounded"
                        />
                        <span>{tipo}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor={`focos_${sistema.id}`}>Focos fotoperíodo</Label>
                  <Input
                    id={`focos_${sistema.id}`}
                    type="number"
                    value={sistema.focos}
                    onChange={(e) => actualizarSistema(sistema.id, 'focos', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor={`extractor_${sistema.id}`}>Extractor mortalidad</Label>
                  <Input
                    id={`extractor_${sistema.id}`}
                    type="number"
                    value={sistema.extractor}
                    onChange={(e) => actualizarSistema(sistema.id, 'extractor', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor={`aireacion_${sistema.id}`}>Sistema aireación</Label>
                  <Input
                    id={`aireacion_${sistema.id}`}
                    type="number"
                    value={sistema.aireacion}
                    onChange={(e) => actualizarSistema(sistema.id, 'aireacion', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor={`oxigenacion_${sistema.id}`}>Sistema oxigenación</Label>
                  <Input
                    id={`oxigenacion_${sistema.id}`}
                    type="number"
                    value={sistema.oxigenacion}
                    onChange={(e) => actualizarSistema(sistema.id, 'oxigenacion', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`otros_sist_${sistema.id}`}>Otros</Label>
                <Input
                  id={`otros_sist_${sistema.id}`}
                  value={sistema.otros_sist}
                  onChange={(e) => actualizarSistema(sistema.id, 'otros_sist', e.target.value)}
                  placeholder="Otros sistemas o equipos..."
                />
              </div>

              <div>
                <Label htmlFor={`obs_sist_${sistema.id}`}>Observaciones</Label>
                <Textarea
                  id={`obs_sist_${sistema.id}`}
                  value={sistema.obs_sist}
                  onChange={(e) => actualizarSistema(sistema.id, 'obs_sist', e.target.value)}
                  placeholder="Observaciones del sistema..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {sistemas.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-gray-500">
                <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No hay sistemas registrados</p>
                <p className="text-sm">Agrega sistemas y equipos trabajados en esta operación</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
