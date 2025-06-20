
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Settings, Wrench } from "lucide-react";
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

interface SistemasEquiposProps {
  formData: NetworkMaintenanceData;
  updateFormData: (updates: Partial<NetworkMaintenanceData>) => void;
}

interface SistemaEquipo {
  id: string;
  tipo_sistema: 'alimentacion' | 'oxigenacion' | 'limpieza' | 'monitoreo' | 'seguridad';
  nombre_equipo: string;
  estado_operativo: 'operativo' | 'mantenimiento' | 'fuera_servicio';
  observaciones: string;
  trabajo_realizado: string;
  responsable: string;
  verificado: boolean;
}

export const SistemasEquipos = ({ formData, updateFormData }: SistemasEquiposProps) => {
  const sistemas = formData.sistemas_equipos || [];

  const agregarSistema = () => {
    const nuevoSistema: SistemaEquipo = {
      id: Date.now().toString(),
      tipo_sistema: 'alimentacion',
      nombre_equipo: '',
      estado_operativo: 'operativo',
      observaciones: '',
      trabajo_realizado: '',
      responsable: '',
      verificado: false
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
                  <Label htmlFor={`tipo_sistema_${sistema.id}`}>Tipo de Sistema</Label>
                  <Select
                    value={sistema.tipo_sistema}
                    onValueChange={(value) => actualizarSistema(sistema.id, 'tipo_sistema', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alimentacion">Sistema de Alimentación</SelectItem>
                      <SelectItem value="oxigenacion">Sistema de Oxigenación</SelectItem>
                      <SelectItem value="limpieza">Sistema de Limpieza</SelectItem>
                      <SelectItem value="monitoreo">Sistema de Monitoreo</SelectItem>
                      <SelectItem value="seguridad">Sistema de Seguridad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`nombre_equipo_${sistema.id}`}>Nombre del Equipo</Label>
                  <Input
                    id={`nombre_equipo_${sistema.id}`}
                    value={sistema.nombre_equipo}
                    onChange={(e) => actualizarSistema(sistema.id, 'nombre_equipo', e.target.value)}
                    placeholder="Ej: Compresor principal A1"
                  />
                </div>

                <div>
                  <Label htmlFor={`estado_${sistema.id}`}>Estado Operativo</Label>
                  <Select
                    value={sistema.estado_operativo}
                    onValueChange={(value) => actualizarSistema(sistema.id, 'estado_operativo', value)}
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

                <div>
                  <Label htmlFor={`responsable_${sistema.id}`}>Responsable</Label>
                  <Input
                    id={`responsable_${sistema.id}`}
                    value={sistema.responsable}
                    onChange={(e) => actualizarSistema(sistema.id, 'responsable', e.target.value)}
                    placeholder="Nombre del responsable"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`trabajo_${sistema.id}`}>Trabajo Realizado</Label>
                <Textarea
                  id={`trabajo_${sistema.id}`}
                  value={sistema.trabajo_realizado}
                  onChange={(e) => actualizarSistema(sistema.id, 'trabajo_realizado', e.target.value)}
                  placeholder="Describe el trabajo realizado en el sistema..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor={`observaciones_${sistema.id}`}>Observaciones</Label>
                <Textarea
                  id={`observaciones_${sistema.id}`}
                  value={sistema.observaciones}
                  onChange={(e) => actualizarSistema(sistema.id, 'observaciones', e.target.value)}
                  placeholder="Observaciones adicionales..."
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`verificado_${sistema.id}`}
                  checked={sistema.verificado}
                  onCheckedChange={(checked) => actualizarSistema(sistema.id, 'verificado', checked)}
                />
                <Label htmlFor={`verificado_${sistema.id}`}>
                  Trabajo verificado y completado
                </Label>
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
