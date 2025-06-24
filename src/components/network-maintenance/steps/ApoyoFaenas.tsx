
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Handshake } from "lucide-react";
import type { NetworkMaintenanceData, ApoyoFaena } from '@/types/network-maintenance';

interface ApoyoFaenasProps {
  formData: NetworkMaintenanceData;
  updateFormData: (updates: Partial<NetworkMaintenanceData>) => void;
  readOnly?: boolean;
}

export const ApoyoFaenas = ({ formData, updateFormData, readOnly = false }: ApoyoFaenasProps) => {
  const apoyoFaenas = formData.apoyo_faenas || [];

  const agregarApoyo = () => {
    const nuevoApoyo: ApoyoFaena = {
      id: Date.now().toString(),
      tipo_apoyo: 'baños',
      seccion_apoyo: [],
      jaulas_apoyo: '',
      actividades_apoyo: [],
      cantidad_apoyo: 0,
      obs_apoyo: ''
    };

    updateFormData({
      apoyo_faenas: [...apoyoFaenas, nuevoApoyo]
    });
  };

  const actualizarApoyo = (id: string, campo: keyof ApoyoFaena, valor: any) => {
    const apoyosActualizados = apoyoFaenas.map(apoyo =>
      apoyo.id === id ? { ...apoyo, [campo]: valor } : apoyo
    );
    updateFormData({ apoyo_faenas: apoyosActualizados });
  };

  const eliminarApoyo = (id: string) => {
    const apoyosActualizados = apoyoFaenas.filter(apoyo => apoyo.id !== id);
    updateFormData({ apoyo_faenas: apoyosActualizados });
  };

  const toggleSeccion = (id: string, seccion: string) => {
    const apoyo = apoyoFaenas.find(a => a.id === id);
    if (!apoyo) return;

    const secciones = apoyo.seccion_apoyo.includes(seccion)
      ? apoyo.seccion_apoyo.filter(s => s !== seccion)
      : [...apoyo.seccion_apoyo, seccion];

    actualizarApoyo(id, 'seccion_apoyo', secciones);
  };

  const toggleActividad = (id: string, actividad: string) => {
    const apoyo = apoyoFaenas.find(a => a.id === id);
    if (!apoyo) return;

    const actividades = apoyo.actividades_apoyo.includes(actividad)
      ? apoyo.actividades_apoyo.filter(a => a !== actividad)
      : [...apoyo.actividades_apoyo, actividad];

    actualizarApoyo(id, 'actividades_apoyo', actividades);
  };

  const actividadesDisponibles = [
    'Soltar-reinstalar tensores',
    'Reparación red',
    'Instalación sistema',
    'Mantención equipos',
    'Limpieza estructura',
    'Revisión jaulas',
    'Cambio elementos'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Handshake className="w-5 h-5" />
            Apoyo a Faenas
          </h3>
          <p className="text-sm text-gray-600">
            Actividades de apoyo realizadas (Baños, Cosecha, etc.)
          </p>
        </div>
        {!readOnly && (
          <Button onClick={agregarApoyo} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Apoyo
          </Button>
        )}
      </div>

      {/* Lista de Apoyo a Faenas */}
      <div className="space-y-4">
        {apoyoFaenas.map((apoyo, index) => (
          <Card key={apoyo.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Apoyo {index + 1}
                </CardTitle>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => eliminarApoyo(apoyo.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`tipo_apoyo_${apoyo.id}`}>Tipo de Faena</Label>
                  <Select
                    value={apoyo.tipo_apoyo}
                    onValueChange={(value) => actualizarApoyo(apoyo.id, 'tipo_apoyo', value)}
                    disabled={readOnly}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baños">Baños</SelectItem>
                      <SelectItem value="cosecha">Cosecha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`jaulas_apoyo_${apoyo.id}`}>Nº Jaula(s)</Label>
                  <Input
                    id={`jaulas_apoyo_${apoyo.id}`}
                    value={apoyo.jaulas_apoyo}
                    onChange={(e) => actualizarApoyo(apoyo.id, 'jaulas_apoyo', e.target.value)}
                    placeholder="Ej: 1, 2, 3-5"
                    disabled={readOnly}
                  />
                </div>

                <div>
                  <Label htmlFor={`cantidad_apoyo_${apoyo.id}`}>Cantidad</Label>
                  <Input
                    id={`cantidad_apoyo_${apoyo.id}`}
                    type="number"
                    value={apoyo.cantidad_apoyo}
                    onChange={(e) => actualizarApoyo(apoyo.id, 'cantidad_apoyo', Number(e.target.value))}
                    placeholder="0"
                    disabled={readOnly}
                  />
                </div>
              </div>

              {/* Secciones */}
              <div>
                <Label>Secciones Apoyadas</Label>
                <div className="flex gap-4 mt-2">
                  {['red', 'lobera', 'peceras'].map(seccion => (
                    <div key={seccion} className="flex items-center space-x-2">
                      <Checkbox
                        id={`seccion_${apoyo.id}_${seccion}`}
                        checked={apoyo.seccion_apoyo.includes(seccion)}
                        onCheckedChange={() => toggleSeccion(apoyo.id, seccion)}
                        disabled={readOnly}
                      />
                      <Label htmlFor={`seccion_${apoyo.id}_${seccion}`} className="capitalize">
                        {seccion}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actividades */}
              <div>
                <Label>Actividades Realizadas</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {actividadesDisponibles.map(actividad => (
                    <div key={actividad} className="flex items-center space-x-2">
                      <Checkbox
                        id={`actividad_${apoyo.id}_${actividad}`}
                        checked={apoyo.actividades_apoyo.includes(actividad)}
                        onCheckedChange={() => toggleActividad(apoyo.id, actividad)}
                        disabled={readOnly}
                      />
                      <Label htmlFor={`actividad_${apoyo.id}_${actividad}`} className="text-sm">
                        {actividad}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor={`obs_apoyo_${apoyo.id}`}>Observaciones</Label>
                <Textarea
                  id={`obs_apoyo_${apoyo.id}`}
                  value={apoyo.obs_apoyo}
                  onChange={(e) => actualizarApoyo(apoyo.id, 'obs_apoyo', e.target.value)}
                  placeholder="Observaciones específicas del apoyo realizado..."
                  rows={3}
                  disabled={readOnly}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {apoyoFaenas.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-gray-500">
                <Handshake className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No hay apoyo a faenas registrado</p>
                <p className="text-sm">Agrega actividades de apoyo realizadas</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
