
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, Wrench, Network } from "lucide-react";
import type { NetworkMaintenanceData, FaenaMantencion, FaenaRedes } from '@/types/network-maintenance';

interface FaenasMantencionProps {
  formData: NetworkMaintenanceData;
  updateFormData: (data: Partial<NetworkMaintenanceData>) => void;
  errors?: Record<string, string>;
}

export const FaenasMantencion = ({ 
  formData, 
  updateFormData, 
  errors = {} 
}: FaenasMantencionProps) => {
  
  const faenasMantencion = formData.faenas_mantencion || [];
  const faenasRedes = formData.faenas_redes || [];

  const addFaenaMantencion = () => {
    const newFaena: FaenaMantencion = {
      id: `faena-mant-${Date.now()}`,
      jaulas: '',
      cantidad: 0,
      ubicacion: '',
      tipo_rotura: '2x1',
      retensado: false,
      descostura: false,
      objetos: false,
      otros: '',
      obs_faena: ''
    };
    
    const updatedFaenas = [...faenasMantencion, newFaena];
    updateFormData({ faenas_mantencion: updatedFaenas });
  };

  const updateFaenaMantencion = (id: string, updates: Partial<FaenaMantencion>) => {
    const updatedFaenas = faenasMantencion.map((faena: FaenaMantencion) =>
      faena.id === id ? { ...faena, ...updates } : faena
    );
    updateFormData({ faenas_mantencion: updatedFaenas });
  };

  const removeFaenaMantencion = (id: string) => {
    const updatedFaenas = faenasMantencion.filter((faena: FaenaMantencion) => faena.id !== id);
    updateFormData({ faenas_mantencion: updatedFaenas });
  };

  const addFaenaRedes = () => {
    const newFaena: FaenaRedes = {
      id: `faena-red-${Date.now()}`,
      tipo_trabajo: 'instalacion',
      ubicacion: '',
      red_tipo: '',
      dimensiones: '',
      hora_inicio: '',
      hora_fin: '',
      personal_asignado: [],
      materiales_usados: '',
      estado_completado: false,
      observaciones: ''
    };
    
    const updatedFaenas = [...faenasRedes, newFaena];
    updateFormData({ faenas_redes: updatedFaenas });
  };

  const updateFaenaRedes = (id: string, updates: Partial<FaenaRedes>) => {
    const updatedFaenas = faenasRedes.map((faena: FaenaRedes) =>
      faena.id === id ? { ...faena, ...updates } : faena
    );
    updateFormData({ faenas_redes: updatedFaenas });
  };

  const removeFaenaRedes = (id: string) => {
    const updatedFaenas = faenasRedes.filter((faena: FaenaRedes) => faena.id !== id);
    updateFormData({ faenas_redes: updatedFaenas });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Faenas de Mantención - Redes
        </h3>
        <p className="text-sm text-gray-600">
          Registro de trabajos realizados en redes, loberas y peceras
        </p>
      </div>

      {/* Faenas de Mantención */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Faenas de Mantención ({faenasMantencion.length})
            </CardTitle>
            <Button onClick={addFaenaMantencion} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Faena
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faenasMantencion.map((faena, index) => (
              <Card key={faena.id} className="border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Faena de Mantención {index + 1}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFaenaMantencion(faena.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`jaulas_${faena.id}`}>Nº Jaula(s)</Label>
                      <Input
                        id={`jaulas_${faena.id}`}
                        value={faena.jaulas}
                        onChange={(e) => updateFaenaMantencion(faena.id, { jaulas: e.target.value })}
                        placeholder="Ej: J1, J2, J3"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`cantidad_${faena.id}`}>Cantidad</Label>
                      <Input
                        id={`cantidad_${faena.id}`}
                        type="number"
                        value={faena.cantidad}
                        onChange={(e) => updateFaenaMantencion(faena.id, { cantidad: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`ubicacion_${faena.id}`}>Ubicación</Label>
                      <Input
                        id={`ubicacion_${faena.id}`}
                        value={faena.ubicacion}
                        onChange={(e) => updateFaenaMantencion(faena.id, { ubicacion: e.target.value })}
                        placeholder="Ubicación específica"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`tipo_rotura_${faena.id}`}>Tipo Rotura</Label>
                      <Select
                        value={faena.tipo_rotura}
                        onValueChange={(value) => updateFaenaMantencion(faena.id, { tipo_rotura: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2x1">2×1</SelectItem>
                          <SelectItem value="2x2">2×2</SelectItem>
                          <SelectItem value=">2x2">&gt;2×2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`otros_${faena.id}`}>Otros</Label>
                      <Input
                        id={`otros_${faena.id}`}
                        value={faena.otros}
                        onChange={(e) => updateFaenaMantencion(faena.id, { otros: e.target.value })}
                        placeholder="Otros trabajos"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`retensado_${faena.id}`}
                        checked={faena.retensado}
                        onCheckedChange={(checked) => updateFaenaMantencion(faena.id, { retensado: checked as boolean })}
                      />
                      <Label htmlFor={`retensado_${faena.id}`}>Retensado</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`descostura_${faena.id}`}
                        checked={faena.descostura}
                        onCheckedChange={(checked) => updateFaenaMantencion(faena.id, { descostura: checked as boolean })}
                      />
                      <Label htmlFor={`descostura_${faena.id}`}>Descostura</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`objetos_${faena.id}`}
                        checked={faena.objetos}
                        onCheckedChange={(checked) => updateFaenaMantencion(faena.id, { objetos: checked as boolean })}
                      />
                      <Label htmlFor={`objetos_${faena.id}`}>Objetos</Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`obs_faena_${faena.id}`}>Observaciones</Label>
                    <Textarea
                      id={`obs_faena_${faena.id}`}
                      value={faena.obs_faena}
                      onChange={(e) => updateFaenaMantencion(faena.id, { obs_faena: e.target.value })}
                      placeholder="Observaciones de la faena..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            {faenasMantencion.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Wrench className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                <p className="text-lg font-medium">No hay faenas de mantención registradas</p>
                <p className="text-sm">Agrega faenas de mantención para continuar</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Faenas de Redes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              Faenas de Redes ({faenasRedes.length})
            </CardTitle>
            <Button onClick={addFaenaRedes} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Faena
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faenasRedes.map((faena, index) => (
              <Card key={faena.id} className="border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Faena de Redes {index + 1}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFaenaRedes(faena.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`tipo_trabajo_${faena.id}`}>Tipo de Trabajo</Label>
                      <Select
                        value={faena.tipo_trabajo}
                        onValueChange={(value) => updateFaenaRedes(faena.id, { tipo_trabajo: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instalacion">Instalación</SelectItem>
                          <SelectItem value="cambio">Cambio</SelectItem>
                          <SelectItem value="reparacion">Reparación</SelectItem>
                          <SelectItem value="inspeccion">Inspección</SelectItem>
                          <SelectItem value="limpieza">Limpieza</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`ubicacion_${faena.id}`}>Ubicación</Label>
                      <Input
                        id={`ubicacion_${faena.id}`}
                        value={faena.ubicacion}
                        onChange={(e) => updateFaenaRedes(faena.id, { ubicacion: e.target.value })}
                        placeholder="Ubicación de la faena"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`red_tipo_${faena.id}`}>Tipo de Red</Label>
                      <Input
                        id={`red_tipo_${faena.id}`}
                        value={faena.red_tipo}
                        onChange={(e) => updateFaenaRedes(faena.id, { red_tipo: e.target.value })}
                        placeholder="Tipo de red"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`dimensiones_${faena.id}`}>Dimensiones</Label>
                      <Input
                        id={`dimensiones_${faena.id}`}
                        value={faena.dimensiones}
                        onChange={(e) => updateFaenaRedes(faena.id, { dimensiones: e.target.value })}
                        placeholder="Dimensiones de la red"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`hora_inicio_${faena.id}`}>Hora Inicio</Label>
                      <Input
                        id={`hora_inicio_${faena.id}`}
                        type="time"
                        value={faena.hora_inicio}
                        onChange={(e) => updateFaenaRedes(faena.id, { hora_inicio: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`hora_fin_${faena.id}`}>Hora Fin</Label>
                      <Input
                        id={`hora_fin_${faena.id}`}
                        type="time"
                        value={faena.hora_fin}
                        onChange={(e) => updateFaenaRedes(faena.id, { hora_fin: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`materiales_${faena.id}`}>Materiales Usados</Label>
                    <Input
                      id={`materiales_${faena.id}`}
                      value={faena.materiales_usados}
                      onChange={(e) => updateFaenaRedes(faena.id, { materiales_usados: e.target.value })}
                      placeholder="Materiales utilizados en la faena"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`observaciones_${faena.id}`}>Observaciones</Label>
                    <Textarea
                      id={`observaciones_${faena.id}`}
                      value={faena.observaciones}
                      onChange={(e) => updateFaenaRedes(faena.id, { observaciones: e.target.value })}
                      placeholder="Observaciones de la faena..."
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`completado_${faena.id}`}
                      checked={faena.estado_completado}
                      onCheckedChange={(checked) => updateFaenaRedes(faena.id, { estado_completado: checked as boolean })}
                    />
                    <Label htmlFor={`completado_${faena.id}`}>Faena completada</Label>
                  </div>
                </CardContent>
              </Card>
            ))}

            {faenasRedes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Network className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                <p className="text-lg font-medium">No hay faenas de redes registradas</p>
                <p className="text-sm">Agrega faenas de redes para continuar</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Información de ayuda */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Wrench className="h-4 w-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Registro de Faenas</p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Registra todas las faenas de mantención realizadas</li>
              <li>• Incluye detalles específicos de cada trabajo</li>
              <li>• Marca las casillas según corresponda</li>
              <li>• Agrega observaciones importantes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
