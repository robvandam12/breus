
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Users } from "lucide-react";
import { useInmersiones } from '@/hooks/useInmersiones';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useEquiposBuceoEnhanced } from '@/hooks/useEquiposBuceoEnhanced';

interface BuzoData {
  id?: string;
  nombre: string;
  apellido?: string;
  rut: string;
  rol: string;
  profundidad_trabajo?: number;
  tiempo_inmersion?: number;
  profundidad_maxima?: number;
  tiempo_fondo?: number;
  tiempo_descompresion?: number;
  hora_entrada_agua?: string;
  hora_salida_agua?: string;
  observaciones?: string;
  del_equipo_buceo: boolean;
}

interface BitacoraStep2Props {
  data: any;
  onUpdate: (data: any) => void;
  inmersionId?: string;
}

export const BitacoraStep2 = ({ data, onUpdate, inmersionId }: BitacoraStep2Props) => {
  const [selectedBuzo, setSelectedBuzo] = useState<string>('');
  const { inmersiones } = useInmersiones();
  const { operaciones } = useOperaciones();
  const { equipos } = useEquiposBuceoEnhanced();

  const selectedInmersion = inmersiones.find(i => i.inmersion_id === inmersionId);
  const selectedOperation = selectedInmersion ? operaciones.find(op => op.id === selectedInmersion.operacion_id) : null;
  
  // Since operations no longer have direct team assignments, get all available teams
  const availableTeams = equipos || [];
  const assignedTeam = availableTeams.length > 0 ? availableTeams[0] : null;

  const buzosFromEquipo = assignedTeam?.miembros?.filter(miembro => {
    const miembroAny = miembro as any;
    const rol = (miembroAny.rol_equipo || miembroAny.rol || 'buzo').toLowerCase();
    return rol === 'buzo' || rol === 'buzo_principal' || rol === 'buzo_asistente';
  }).map(miembro => {
    const miembroAny = miembro as any;
    const nombreCompleto = miembroAny.usuario?.nombre_completo || 
                          miembroAny.nombre_completo ||
                          (miembroAny.usuario?.nombre && miembroAny.usuario?.apellido 
                            ? `${miembroAny.usuario.nombre} ${miembroAny.usuario.apellido}` 
                            : miembroAny.nombre || 'Sin nombre');
    
    const [nombre, ...apellidoParts] = nombreCompleto.split(' ');
    const apellido = apellidoParts.join(' ');
    
    return {
      id: miembroAny.id || miembroAny.usuario_id || `temp_${Date.now()}_${Math.random()}`,
      nombre: nombre || 'Sin nombre',
      apellido: apellido || '',
      rut: miembroAny.usuario?.perfil_buzo?.rut || miembroAny.rut || '',
      rol: miembroAny.rol_equipo || miembroAny.rol || 'Buzo',
      profundidad_trabajo: 0,
      tiempo_inmersion: 0,
      profundidad_maxima: 0,
      tiempo_fondo: 0,
      tiempo_descompresion: 0,
      hora_entrada_agua: '',
      hora_salida_agua: '',
      observaciones: '',
      del_equipo_buceo: true
    };
  }) || [];

  const currentBuzos: BuzoData[] = data.inmersiones_buzos || [];

  const addBuzoFromEquipo = () => {
    if (!selectedBuzo) return;
    
    const buzoFromEquipo = buzosFromEquipo.find(b => b.id === selectedBuzo);
    if (buzoFromEquipo && !currentBuzos.find(b => b.id === buzoFromEquipo.id)) {
      const updatedBuzos = [...currentBuzos, buzoFromEquipo];
      onUpdate({ inmersiones_buzos: updatedBuzos });
      setSelectedBuzo('');
    }
  };

  const addManualBuzo = () => {
    const newBuzo: BuzoData = {
      id: `manual_${Date.now()}`,
      nombre: '',
      apellido: '',
      rut: '',
      rol: 'Buzo',
      profundidad_trabajo: 0,
      tiempo_inmersion: 0,
      profundidad_maxima: 0,
      tiempo_fondo: 0,
      tiempo_descompresion: 0,
      hora_entrada_agua: '',
      hora_salida_agua: '',
      observaciones: '',
      del_equipo_buceo: false
    };
    
    const updatedBuzos = [...currentBuzos, newBuzo];
    onUpdate({ inmersiones_buzos: updatedBuzos });
  };

  const updateBuzo = (index: number, field: string, value: any) => {
    const updatedBuzos = [...currentBuzos];
    updatedBuzos[index] = { ...updatedBuzos[index], [field]: value };
    onUpdate({ inmersiones_buzos: updatedBuzos });
  };

  const removeBuzo = (index: number) => {
    const updatedBuzos = currentBuzos.filter((_, i) => i !== index);
    onUpdate({ inmersiones_buzos: updatedBuzos });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Personal de Buceo Participante
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Agregar buzos del equipo */}
        {buzosFromEquipo.length > 0 && (
          <div className="space-y-3">
            <Label>Agregar desde Equipo de Buceo</Label>
            <div className="flex gap-2">
              <Select value={selectedBuzo} onValueChange={setSelectedBuzo}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Seleccionar buzo del equipo" />
                </SelectTrigger>
                <SelectContent>
                  {buzosFromEquipo.filter(b => !currentBuzos.find(cb => cb.id === b.id)).map((buzo) => (
                    <SelectItem key={buzo.id} value={buzo.id!}>
                      <div className="flex flex-col">
                        <span>{buzo.nombre} {buzo.apellido}</span>
                        <span className="text-xs text-gray-500">{buzo.rol} - RUT: {buzo.rut}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addBuzoFromEquipo} disabled={!selectedBuzo}>
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>
          </div>
        )}

        {/* Agregar buzo manual */}
        <div>
          <Button onClick={addManualBuzo} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Buzo Manual
          </Button>
        </div>

        {/* Lista de buzos */}
        <div className="space-y-4">
          {currentBuzos.map((buzo, index) => (
            <Card key={buzo.id || index} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant={buzo.del_equipo_buceo ? "default" : "secondary"}>
                    {buzo.del_equipo_buceo ? "Del Equipo" : "Manual"}
                  </Badge>
                  <span className="font-medium">Buzo {index + 1}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBuzo(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label>Nombre</Label>
                  <Input
                    value={buzo.nombre}
                    onChange={(e) => updateBuzo(index, 'nombre', e.target.value)}
                    disabled={buzo.del_equipo_buceo}
                  />
                </div>
                <div>
                  <Label>Apellido</Label>
                  <Input
                    value={buzo.apellido || ''}
                    onChange={(e) => updateBuzo(index, 'apellido', e.target.value)}
                    disabled={buzo.del_equipo_buceo}
                  />
                </div>
                <div>
                  <Label>RUT</Label>
                  <Input
                    value={buzo.rut}
                    onChange={(e) => updateBuzo(index, 'rut', e.target.value)}
                    disabled={buzo.del_equipo_buceo}
                  />
                </div>
                <div>
                  <Label>Rol</Label>
                  <Select
                    value={buzo.rol}
                    onValueChange={(value) => updateBuzo(index, 'rol', value)}
                    disabled={buzo.del_equipo_buceo}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Buzo Principal">Buzo Principal</SelectItem>
                      <SelectItem value="Buzo Asistente">Buzo Asistente</SelectItem>
                      <SelectItem value="Buzo">Buzo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Profundidad Trabajo (m)</Label>
                  <Input
                    type="number"
                    value={buzo.profundidad_trabajo || ''}
                    onChange={(e) => updateBuzo(index, 'profundidad_trabajo', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Tiempo Inmersión (min)</Label>
                  <Input
                    type="number"
                    value={buzo.tiempo_inmersion || ''}
                    onChange={(e) => updateBuzo(index, 'tiempo_inmersion', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Hora Entrada</Label>
                  <Input
                    type="time"
                    value={buzo.hora_entrada_agua || ''}
                    onChange={(e) => updateBuzo(index, 'hora_entrada_agua', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Hora Salida</Label>
                  <Input
                    type="time"
                    value={buzo.hora_salida_agua || ''}
                    onChange={(e) => updateBuzo(index, 'hora_salida_agua', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <Label>Observaciones</Label>
                  <Textarea
                    value={buzo.observaciones || ''}
                    onChange={(e) => updateBuzo(index, 'observaciones', e.target.value)}
                    placeholder="Observaciones sobre el buzo..."
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {currentBuzos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay buzos agregados. Agregue al menos un buzo para continuar.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
