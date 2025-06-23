
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Network, Settings } from "lucide-react";
import type { NetworkMaintenanceData, FaenaRedes } from '@/types/network-maintenance';

interface FaenasRedesProps {
  formData: NetworkMaintenanceData;
  updateFormData: (updates: Partial<NetworkMaintenanceData>) => void;
}

export const FaenasRedesStep = ({ formData, updateFormData }: FaenasRedesProps) => {
  const faenasRedes = formData.faenas_redes || [];

  const agregarFaenaRedes = () => {
    const nuevaFaena: FaenaRedes = {
      id: Date.now().toString(),
      tipo_trabajo: 'instalacion',
      ubicacion: '',
      jaula_numero: '',
      red_tipo: '',
      dimensiones: '',
      hora_inicio: '',
      hora_fin: '',
      personal_asignado: [],
      materiales_usados: '',
      estado_completado: false,
      observaciones: ''
    };

    updateFormData({
      faenas_redes: [...faenasRedes, nuevaFaena]
    });
  };

  const actualizarFaenaRedes = (id: string, campo: keyof FaenaRedes, valor: any) => {
    const faenasActualizadas = faenasRedes.map(faena =>
      faena.id === id ? { ...faena, [campo]: valor } : faena
    );
    updateFormData({ faenas_redes: faenasActualizadas });
  };

  const eliminarFaenaRedes = (id: string) => {
    const faenasActualizadas = faenasRedes.filter(faena => faena.id !== id);
    updateFormData({ faenas_redes: faenasActualizadas });
  };

  const agregarPersonal = (faenaId: string, nombrePersonal: string) => {
    if (!nombrePersonal.trim()) return;
    
    const faenasActualizadas = faenasRedes.map(faena =>
      faena.id === faenaId 
        ? { ...faena, personal_asignado: [...faena.personal_asignado, nombrePersonal] }
        : faena
    );
    updateFormData({ faenas_redes: faenasActualizadas });
  };

  const eliminarPersonal = (faenaId: string, index: number) => {
    const faenasActualizadas = faenasRedes.map(faena =>
      faena.id === faenaId 
        ? { ...faena, personal_asignado: faena.personal_asignado.filter((_, i) => i !== index) }
        : faena
    );
    updateFormData({ faenas_redes: faenasActualizadas });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Network className="w-5 h-5" />
            Faenas de Redes
          </h3>
          <p className="text-sm text-gray-600">
            Registro detallado de trabajos realizados en redes de cultivo
          </p>
        </div>
        <Button onClick={agregarFaenaRedes} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Faena
        </Button>
      </div>

      <div className="space-y-4">
        {faenasRedes.map((faena, index) => (
          <Card key={faena.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Faena de Red {index + 1}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => eliminarFaenaRedes(faena.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`tipo_trabajo_${faena.id}`}>Tipo de Trabajo</Label>
                  <Select
                    value={faena.tipo_trabajo}
                    onValueChange={(value) => actualizarFaenaRedes(faena.id, 'tipo_trabajo', value)}
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
                  <Label htmlFor={`ubicacion_${faena.id}`}>Ubicación</Label>
                  <Input
                    id={`ubicacion_${faena.id}`}
                    value={faena.ubicacion}
                    onChange={(e) => actualizarFaenaRedes(faena.id, 'ubicacion', e.target.value)}
                    placeholder="Ej: Sector Norte, Línea 1"
                  />
                </div>

                <div>
                  <Label htmlFor={`jaula_numero_${faena.id}`}>Número de Jaula</Label>
                  <Input
                    id={`jaula_numero_${faena.id}`}
                    value={faena.jaula_numero || ''}
                    onChange={(e) => actualizarFaenaRedes(faena.id, 'jaula_numero', e.target.value)}
                    placeholder="Ej: J-001"
                  />
                </div>

                <div>
                  <Label htmlFor={`red_tipo_${faena.id}`}>Tipo de Red</Label>
                  <Input
                    id={`red_tipo_${faena.id}`}
                    value={faena.red_tipo}
                    onChange={(e) => actualizarFaenaRedes(faena.id, 'red_tipo', e.target.value)}
                    placeholder="Ej: Red perimetral, Red de cosecha"
                  />
                </div>

                <div>
                  <Label htmlFor={`dimensiones_${faena.id}`}>Dimensiones</Label>
                  <Input
                    id={`dimensiones_${faena.id}`}
                    value={faena.dimensiones}
                    onChange={(e) => actualizarFaenaRedes(faena.id, 'dimensiones', e.target.value)}
                    placeholder="Ej: 20m x 20m x 15m"
                  />
                </div>

                <div>
                  <Label htmlFor={`hora_inicio_${faena.id}`}>Hora Inicio</Label>
                  <Input
                    id={`hora_inicio_${faena.id}`}
                    type="time"
                    value={faena.hora_inicio}
                    onChange={(e) => actualizarFaenaRedes(faena.id, 'hora_inicio', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor={`hora_fin_${faena.id}`}>Hora Fin</Label>
                  <Input
                    id={`hora_fin_${faena.id}`}
                    type="time"
                    value={faena.hora_fin}
                    onChange={(e) => actualizarFaenaRedes(faena.id, 'hora_fin', e.target.value)}
                  />
                </div>
              </div>

              {/* Personal Asignado */}
              <div>
                <Label>Personal Asignado</Label>
                <div className="space-y-2">
                  {faena.personal_asignado.map((persona, personaIndex) => (
                    <div key={personaIndex} className="flex items-center gap-2">
                      <Input value={persona} readOnly className="flex-1" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => eliminarPersonal(faena.id, personaIndex)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nombre del personal"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const target = e.target as HTMLInputElement;
                          agregarPersonal(faena.id, target.value);
                          target.value = '';
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                        if (input) {
                          agregarPersonal(faena.id, input.value);
                          input.value = '';
                        }
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor={`materiales_${faena.id}`}>Materiales Utilizados</Label>
                <Textarea
                  id={`materiales_${faena.id}`}
                  value={faena.materiales_usados}
                  onChange={(e) => actualizarFaenaRedes(faena.id, 'materiales_usados', e.target.value)}
                  placeholder="Describe los materiales utilizados..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor={`observaciones_${faena.id}`}>Observaciones</Label>
                <Textarea
                  id={`observaciones_${faena.id}`}
                  value={faena.observaciones}
                  onChange={(e) => actualizarFaenaRedes(faena.id, 'observaciones', e.target.value)}
                  placeholder="Observaciones adicionales sobre la faena..."
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`completado_${faena.id}`}
                  checked={faena.estado_completado}
                  onCheckedChange={(checked) => actualizarFaenaRedes(faena.id, 'estado_completado', checked)}
                />
                <Label htmlFor={`completado_${faena.id}`}>
                  Faena completada exitosamente
                </Label>
              </div>
            </CardContent>
          </Card>
        ))}

        {faenasRedes.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No hay faenas de redes registradas</p>
                <p className="text-sm">Agrega faenas de trabajo en redes para esta operación</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
