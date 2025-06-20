
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Wrench, Network, Clock } from "lucide-react";
import type { MultiXData } from '@/types/multix';

interface FaenaMantencion {
  id: string;
  tipo_faena: 'mantencion_preventiva' | 'mantencion_correctiva' | 'instalacion_red' | 'cambio_red' | 'reparacion_urgente';
  descripcion: string;
  hora_inicio: string;
  hora_fin: string;
  profundidad_trabajo: number;
  responsable: string;
  estado: 'planificada' | 'en_progreso' | 'completada' | 'suspendida';
  observaciones: string;
}

interface FaenaRedes {
  id: string;
  tipo_trabajo: 'instalacion' | 'cambio' | 'reparacion' | 'inspeccion' | 'limpieza';
  ubicacion: string;
  jaula_numero?: string;
  red_tipo: string;
  dimensiones: string;
  hora_inicio: string;
  hora_fin: string;
  personal_asignado: string[];
  materiales_usados: string;
  estado_completado: boolean;
  observaciones: string;
}

interface FaenasMantencionProps {
  formData: MultiXData;
  updateFormData: (data: Partial<MultiXData>) => void;
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
      tipo_faena: 'mantencion_preventiva',
      descripcion: '',
      hora_inicio: '',
      hora_fin: '',
      profundidad_trabajo: 0,
      responsable: '',
      estado: 'planificada',
      observaciones: ''
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

  const getTipoFaenaColor = (tipo: string) => {
    switch (tipo) {
      case 'mantencion_preventiva': return 'text-green-600 bg-green-50 border-green-200';
      case 'mantencion_correctiva': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'reparacion_urgente': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getTipoTrabajoColor = (tipo: string) => {
    switch (tipo) {
      case 'instalacion': return 'text-green-600 bg-green-50 border-green-200';
      case 'cambio': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'reparacion': return 'text-red-600 bg-red-50 border-red-200';
      case 'inspeccion': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Faenas de Mantenimiento y Redes
        </h3>
        <p className="text-sm text-gray-600">
          Registro de trabajos de mantenimiento y operaciones en redes
        </p>
      </div>

      {/* Resumen de faenas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wrench className="h-4 w-4" />
            Resumen de Faenas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {faenasMantencion.length}
              </div>
              <div className="text-sm text-blue-600">Mantenimiento</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {faenasRedes.length}
              </div>
              <div className="text-sm text-green-600">Redes</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {faenasMantencion.filter((f: FaenaMantencion) => f.estado === 'completada').length + 
                 faenasRedes.filter((f: FaenaRedes) => f.estado_completado).length}
              </div>
              <div className="text-sm text-purple-600">Completadas</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {faenasMantencion.filter((f: FaenaMantencion) => f.estado === 'en_progreso').length}
              </div>
              <div className="text-sm text-orange-600">En Progreso</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Faenas de Mantenimiento */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Wrench className="h-4 w-4" />
              Faenas de Mantenimiento ({faenasMantencion.length})
            </CardTitle>
            <Button onClick={addFaenaMantencion} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Mantenimiento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {faenasMantencion.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Wrench className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p>No hay faenas de mantenimiento registradas</p>
              <p className="text-sm">Agrega tareas de mantenimiento preventivo o correctivo</p>
            </div>
          ) : (
            <div className="space-y-4">
              {faenasMantencion.map((faena: FaenaMantencion) => (
                <Card key={faena.id} className={`border ${getTipoFaenaColor(faena.tipo_faena)}`}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor={`tipo-${faena.id}`}>Tipo de Faena</Label>
                        <Select
                          value={faena.tipo_faena}
                          onValueChange={(value) => updateFaenaMantencion(faena.id, { tipo_faena: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mantencion_preventiva">Mantenimiento Preventivo</SelectItem>
                            <SelectItem value="mantencion_correctiva">Mantenimiento Correctivo</SelectItem>
                            <SelectItem value="instalacion_red">Instalación de Red</SelectItem>
                            <SelectItem value="cambio_red">Cambio de Red</SelectItem>
                            <SelectItem value="reparacion_urgente">Reparación Urgente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`responsable-${faena.id}`}>Responsable</Label>
                        <Input
                          id={`responsable-${faena.id}`}
                          value={faena.responsable}
                          onChange={(e) => updateFaenaMantencion(faena.id, { responsable: e.target.value })}
                          placeholder="Nombre del responsable"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <Label htmlFor={`descripcion-${faena.id}`}>Descripción</Label>
                      <Textarea
                        id={`descripcion-${faena.id}`}
                        value={faena.descripcion}
                        onChange={(e) => updateFaenaMantencion(faena.id, { descripcion: e.target.value })}
                        placeholder="Describe el trabajo a realizar..."
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <Label htmlFor={`inicio-${faena.id}`}>Hora Inicio</Label>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <Input
                            id={`inicio-${faena.id}`}
                            type="time"
                            value={faena.hora_inicio}
                            onChange={(e) => updateFaenaMantencion(faena.id, { hora_inicio: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`fin-${faena.id}`}>Hora Fin</Label>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <Input
                            id={`fin-${faena.id}`}
                            type="time"
                            value={faena.hora_fin}
                            onChange={(e) => updateFaenaMantencion(faena.id, { hora_fin: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`profundidad-${faena.id}`}>Profundidad (m)</Label>
                        <Input
                          id={`profundidad-${faena.id}`}
                          type="number"
                          step="0.1"
                          value={faena.profundidad_trabajo}
                          onChange={(e) => updateFaenaMantencion(faena.id, { profundidad_trabajo: parseFloat(e.target.value) || 0 })}
                          placeholder="0.0"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Select
                          value={faena.estado}
                          onValueChange={(value) => updateFaenaMantencion(faena.id, { estado: value as any })}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planificada">Planificada</SelectItem>
                            <SelectItem value="en_progreso">En Progreso</SelectItem>
                            <SelectItem value="completada">Completada</SelectItem>
                            <SelectItem value="suspendida">Suspendida</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFaenaMantencion(faena.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {faena.observaciones && (
                      <div className="mt-4">
                        <Label htmlFor={`obs-${faena.id}`}>Observaciones</Label>
                        <Textarea
                          id={`obs-${faena.id}`}
                          value={faena.observaciones}
                          onChange={(e) => updateFaenaMantencion(faena.id, { observaciones: e.target.value })}
                          placeholder="Observaciones adicionales..."
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

      {/* Faenas de Redes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Network className="h-4 w-4" />
              Faenas de Redes ({faenasRedes.length})
            </CardTitle>
            <Button onClick={addFaenaRedes} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Faena de Red
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {faenasRedes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Network className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p>No hay faenas de redes registradas</p>
              <p className="text-sm">Agrega trabajos específicos en redes de cultivo</p>
            </div>
          ) : (
            <div className="space-y-4">
              {faenasRedes.map((faena: FaenaRedes) => (
                <Card key={faena.id} className={`border ${getTipoTrabajoColor(faena.tipo_trabajo)}`}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label htmlFor={`tipo-red-${faena.id}`}>Tipo de Trabajo</Label>
                        <Select
                          value={faena.tipo_trabajo}
                          onValueChange={(value) => updateFaenaRedes(faena.id, { tipo_trabajo: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instalacion">Instalación</SelectItem>
                            <SelectItem value="cambio">Cambio de Red</SelectItem>
                            <SelectItem value="reparacion">Reparación</SelectItem>
                            <SelectItem value="inspeccion">Inspección</SelectItem>
                            <SelectItem value="limpieza">Limpieza</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`ubicacion-${faena.id}`}>Ubicación</Label>
                        <Input
                          id={`ubicacion-${faena.id}`}
                          value={faena.ubicacion}
                          onChange={(e) => updateFaenaRedes(faena.id, { ubicacion: e.target.value })}
                          placeholder="Ej: Sector Norte, Jaula 5"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`red-tipo-${faena.id}`}>Tipo de Red</Label>
                        <Input
                          id={`red-tipo-${faena.id}`}
                          value={faena.red_tipo}
                          onChange={(e) => updateFaenaRedes(faena.id, { red_tipo: e.target.value })}
                          placeholder="Ej: Predadora, Cosecha"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <Label htmlFor={`inicio-red-${faena.id}`}>Hora Inicio</Label>
                        <Input
                          id={`inicio-red-${faena.id}`}
                          type="time"
                          value={faena.hora_inicio}
                          onChange={(e) => updateFaenaRedes(faena.id, { hora_inicio: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`fin-red-${faena.id}`}>Hora Fin</Label>
                        <Input
                          id={`fin-red-${faena.id}`}
                          type="time"
                          value={faena.hora_fin}
                          onChange={(e) => updateFaenaRedes(faena.id, { hora_fin: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`dimensiones-${faena.id}`}>Dimensiones</Label>
                        <Input
                          id={`dimensiones-${faena.id}`}
                          value={faena.dimensiones}
                          onChange={(e) => updateFaenaRedes(faena.id, { dimensiones: e.target.value })}
                          placeholder="Ej: 15x15m"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`completado-${faena.id}`}
                            checked={faena.estado_completado}
                            onChange={(e) => updateFaenaRedes(faena.id, { estado_completado: e.target.checked })}
                            className="rounded"
                          />
                          <Label htmlFor={`completado-${faena.id}`} className="text-sm">
                            Completado
                          </Label>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFaenaRedes(faena.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {faena.materiales_usados && (
                      <div className="mt-4">
                        <Label htmlFor={`materiales-${faena.id}`}>Materiales Utilizados</Label>
                        <Textarea
                          id={`materiales-${faena.id}`}
                          value={faena.materiales_usados}
                          onChange={(e) => updateFaenaRedes(faena.id, { materiales_usados: e.target.value })}
                          placeholder="Lista de materiales utilizados..."
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
          <Wrench className="h-4 w-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Registro de Faenas</p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Registra todas las faenas de mantenimiento y trabajo en redes</li>
              <li>• Asigna responsables y controla tiempos de ejecución</li>
              <li>• Documenta observaciones y materiales utilizados</li>
              <li>• Marca como completadas las faenas terminadas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
