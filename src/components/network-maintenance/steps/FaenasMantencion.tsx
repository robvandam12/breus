
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Wrench, Clock } from "lucide-react";
import type { NetworkMaintenanceData, FaenaMantencion } from '@/types/network-maintenance';

interface FaenasMantencionProps {
  formData: NetworkMaintenanceData;
  updateFormData: (updates: Partial<NetworkMaintenanceData>) => void;
}

export const FaenasMantencion = ({ formData, updateFormData }: FaenasMantencionProps) => {
  const faenas = formData.faenas_mantencion || [];

  const agregarFaena = () => {
    const nuevaFaena: FaenaMantencion = {
      id: Date.now().toString(),
      tipo_faena: 'mantencion_preventiva',
      descripcion: '',
      hora_inicio: '',
      hora_fin: '',
      profundidad_trabajo: 0,
      responsable: '',
      estado: 'planificada',
      observaciones: ''
    };

    updateFormData({
      faenas_mantencion: [...faenas, nuevaFaena]
    });
  };

  const actualizarFaena = (id: string, campo: keyof FaenaMantencion, valor: any) => {
    const faenasActualizadas = faenas.map(faena =>
      faena.id === id ? { ...faena, [campo]: valor } : faena
    );
    updateFormData({ faenas_mantencion: faenasActualizadas });
  };

  const eliminarFaena = (id: string) => {
    const faenasActualizadas = faenas.filter(faena => faena.id !== id);
    updateFormData({ faenas_mantencion: faenasActualizadas });
  };

  const calcularDuracion = (inicio: string, fin: string): string => {
    if (!inicio || !fin) return '0:00';
    
    const [horaIni, minIni] = inicio.split(':').map(Number);
    const [horaFin, minFin] = fin.split(':').map(Number);
    
    const minutosIni = horaIni * 60 + minIni;
    const minutosFin = horaFin * 60 + minFin;
    
    const duracionMinutos = Math.max(0, minutosFin - minutosIni);
    const horas = Math.floor(duracionMinutos / 60);
    const minutos = duracionMinutos % 60;
    
    return `${horas}:${minutos.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Faenas de Mantención
          </h3>
          <p className="text-sm text-gray-600">
            Registro de trabajos de mantención realizados en redes y estructuras
          </p>
        </div>
        <Button onClick={agregarFaena} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Faena
        </Button>
      </div>

      {/* Resumen de faenas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumen de Faenas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">
                {faenas.filter(f => f.tipo_faena === 'mantencion_preventiva').length}
              </div>
              <div className="text-xs text-green-600">Preventiva</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-xl font-bold text-orange-600">
                {faenas.filter(f => f.tipo_faena === 'mantencion_correctiva').length}
              </div>
              <div className="text-xs text-orange-600">Correctiva</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">
                {faenas.filter(f => f.tipo_faena === 'instalacion_red').length}
              </div>
              <div className="text-xs text-blue-600">Instalación</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">
                {faenas.filter(f => f.tipo_faena === 'cambio_red').length}
              </div>
              <div className="text-xs text-purple-600">Cambio Red</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-xl font-bold text-red-600">
                {faenas.filter(f => f.tipo_faena === 'reparacion_urgente').length}
              </div>
              <div className="text-xs text-red-600">Urgente</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de faenas */}
      <div className="space-y-4">
        {faenas.map((faena, index) => (
          <Card key={faena.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Faena {index + 1}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => eliminarFaena(faena.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`tipo_faena_${faena.id}`}>Tipo de Faena</Label>
                  <Select
                    value={faena.tipo_faena}
                    onValueChange={(value) => actualizarFaena(faena.id, 'tipo_faena', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mantencion_preventiva">Mantención Preventiva</SelectItem>
                      <SelectItem value="mantencion_correctiva">Mantención Correctiva</SelectItem>
                      <SelectItem value="instalacion_red">Instalación de Red</SelectItem>
                      <SelectItem value="cambio_red">Cambio de Red</SelectItem>
                      <SelectItem value="reparacion_urgente">Reparación Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`estado_${faena.id}`}>Estado</Label>
                  <Select
                    value={faena.estado}
                    onValueChange={(value) => actualizarFaena(faena.id, 'estado', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planificada">Planificada</SelectItem>
                      <SelectItem value="en_progreso">En Progreso</SelectItem>
                      <SelectItem value="completada">Completada</SelectItem>
                      <SelectItem value="suspendida">Suspendida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor={`descripcion_${faena.id}`}>Descripción del Trabajo</Label>
                <Textarea
                  id={`descripcion_${faena.id}`}
                  value={faena.descripcion}
                  onChange={(e) => actualizarFaena(faena.id, 'descripcion', e.target.value)}
                  placeholder="Describe el trabajo realizado..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor={`hora_inicio_${faena.id}`}>Hora Inicio</Label>
                  <Input
                    id={`hora_inicio_${faena.id}`}
                    type="time"
                    value={faena.hora_inicio}
                    onChange={(e) => actualizarFaena(faena.id, 'hora_inicio', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor={`hora_fin_${faena.id}`}>Hora Fin</Label>
                  <Input
                    id={`hora_fin_${faena.id}`}
                    type="time"
                    value={faena.hora_fin}
                    onChange={(e) => actualizarFaena(faena.id, 'hora_fin', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Duración</Label>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">
                      {calcularDuracion(faena.hora_inicio, faena.hora_fin)}
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor={`profundidad_${faena.id}`}>Profundidad (m)</Label>
                  <Input
                    id={`profundidad_${faena.id}`}
                    type="number"
                    step="0.1"
                    value={faena.profundidad_trabajo}
                    onChange={(e) => actualizarFaena(faena.id, 'profundidad_trabajo', parseFloat(e.target.value) || 0)}
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`responsable_${faena.id}`}>Responsable</Label>
                  <Input
                    id={`responsable_${faena.id}`}
                    value={faena.responsable}
                    onChange={(e) => actualizarFaena(faena.id, 'responsable', e.target.value)}
                    placeholder="Nombre del responsable"
                  />
                </div>

                <div>
                  <Label htmlFor={`observaciones_${faena.id}`}>Observaciones</Label>
                  <Textarea
                    id={`observaciones_${faena.id}`}
                    value={faena.observaciones}
                    onChange={(e) => actualizarFaena(faena.id, 'observaciones', e.target.value)}
                    placeholder="Observaciones adicionales..."
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {faenas.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-gray-500">
                <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No hay faenas registradas</p>
                <p className="text-sm">Agrega faenas de mantención para documentar el trabajo realizado</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
