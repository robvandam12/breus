
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Users, UserCheck, Plus, Save } from "lucide-react";
import { useEquiposBuceo } from "@/hooks/useEquiposBuceo";
import { useUsuarios } from "@/hooks/useUsuarios";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface EnhancedOperacionEquipoAssignmentProps {
  operacionId: string;
  currentEquipoId?: string;
  currentSupervisorId?: string;
  onComplete: (equipoId: string, supervisorId: string) => void;
}

export const EnhancedOperacionEquipoAssignment = ({ 
  operacionId, 
  currentEquipoId, 
  currentSupervisorId, 
  onComplete 
}: EnhancedOperacionEquipoAssignmentProps) => {
  const [selectedEquipoId, setSelectedEquipoId] = useState(currentEquipoId || '');
  const [selectedSupervisorId, setSelectedSupervisorId] = useState(currentSupervisorId || '');
  const [isCreatingNewTeam, setIsCreatingNewTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedBuzos, setSelectedBuzos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { equipos, createEquipo } = useEquiposBuceo();
  const { usuarios } = useUsuarios();

  // Filtrar supervisores y buzos
  const supervisores = usuarios?.filter(u => 
    u.rol === 'admin_servicio' || u.rol === 'superuser'
  ) || [];

  const buzos = usuarios?.filter(u => 
    u.rol === 'buzo' && u.estado_buzo === 'activo'
  ) || [];

  const handleAssignExistingTeam = async () => {
    if (!selectedEquipoId || !selectedSupervisorId) {
      toast({
        title: "Campos requeridos",
        description: "Debe seleccionar un equipo y un supervisor.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('operacion')
        .update({ 
          equipo_buceo_id: selectedEquipoId,
          supervisor_asignado_id: selectedSupervisorId
        })
        .eq('id', operacionId);

      if (error) throw error;

      toast({
        title: "Equipo asignado",
        description: "El equipo ha sido asignado exitosamente a la operación."
      });

      onComplete(selectedEquipoId, selectedSupervisorId);
    } catch (error) {
      console.error('Error assigning team:', error);
      toast({
        title: "Error",
        description: "No se pudo asignar el equipo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNewTeam = async () => {
    if (!newTeamName || !selectedSupervisorId || selectedBuzos.length === 0) {
      toast({
        title: "Campos requeridos",
        description: "Debe completar todos los campos para crear un nuevo equipo.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Crear nuevo equipo de buceo
      const newEquipo = await createEquipo({
        nombre: newTeamName,
        descripcion: `Equipo creado para operación ${operacionId}`,
        tipo_empresa: 'contratista',
        empresa_id: 'temp', // Se asignará después
        activo: true
      });

      if (!newEquipo?.id) {
        throw new Error('No se pudo crear el equipo');
      }

      // Asignar miembros al equipo (supervisor + buzos)
      const miembros = [
        {
          equipo_id: newEquipo.id,
          usuario_id: selectedSupervisorId,
          rol_equipo: 'supervisor',
          disponible: true
        },
        ...selectedBuzos.map(buzoId => ({
          equipo_id: newEquipo.id,
          usuario_id: buzoId,
          rol_equipo: 'buzo_principal',
          disponible: true
        }))
      ];

      const { error: miembrosError } = await supabase
        .from('equipo_buceo_miembros')
        .insert(miembros);

      if (miembrosError) throw miembrosError;

      // Asignar equipo a la operación
      const { error: operacionError } = await supabase
        .from('operacion')
        .update({ 
          equipo_buceo_id: newEquipo.id,
          supervisor_asignado_id: selectedSupervisorId
        })
        .eq('id', operacionId);

      if (operacionError) throw operacionError;

      toast({
        title: "Equipo creado y asignado",
        description: "El nuevo equipo ha sido creado y asignado exitosamente."
      });

      onComplete(newEquipo.id, selectedSupervisorId);
    } catch (error) {
      console.error('Error creating new team:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el nuevo equipo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Asignación de Equipo de Buceo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Toggle entre asignar equipo existente o crear nuevo */}
          <div className="flex gap-2">
            <Button
              variant={!isCreatingNewTeam ? "default" : "outline"}
              onClick={() => setIsCreatingNewTeam(false)}
              className="flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              Asignar Equipo Existente
            </Button>
            <Button
              variant={isCreatingNewTeam ? "default" : "outline"}
              onClick={() => setIsCreatingNewTeam(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Crear Nuevo Equipo
            </Button>
          </div>

          {!isCreatingNewTeam ? (
            // Asignar equipo existente
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Equipo de Buceo</Label>
                <Select value={selectedEquipoId} onValueChange={setSelectedEquipoId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar equipo de buceo" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipos?.filter(e => e.activo).map((equipo) => (
                      <SelectItem key={equipo.id} value={equipo.id}>
                        {equipo.nombre} - {equipo.descripcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Supervisor Asignado</Label>
                <Select value={selectedSupervisorId} onValueChange={setSelectedSupervisorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    {supervisores.map((supervisor) => (
                      <SelectItem key={supervisor.usuario_id} value={supervisor.usuario_id}>
                        {supervisor.nombre} {supervisor.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleAssignExistingTeam}
                disabled={!selectedEquipoId || !selectedSupervisorId || isSubmitting}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Asignando...' : 'Asignar Equipo'}
              </Button>
            </div>
          ) : (
            // Crear nuevo equipo
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre del Nuevo Equipo</Label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Ej: Equipo Alpha - Operación 2024"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="space-y-2">
                <Label>Supervisor</Label>
                <Select value={selectedSupervisorId} onValueChange={setSelectedSupervisorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    {supervisores.map((supervisor) => (
                      <SelectItem key={supervisor.usuario_id} value={supervisor.usuario_id}>
                        {supervisor.nombre} {supervisor.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Buzos del Equipo</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {buzos.map((buzo) => (
                    <label key={buzo.usuario_id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedBuzos.includes(buzo.usuario_id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBuzos([...selectedBuzos, buzo.usuario_id]);
                          } else {
                            setSelectedBuzos(selectedBuzos.filter(id => id !== buzo.usuario_id));
                          }
                        }}
                        className="rounded"
                      />
                      <span>{buzo.nombre} {buzo.apellido}</span>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Buzos seleccionados: {selectedBuzos.length}
                </p>
              </div>

              <Button 
                onClick={handleCreateNewTeam}
                disabled={!newTeamName || !selectedSupervisorId || selectedBuzos.length === 0 || isSubmitting}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Creando...' : 'Crear y Asignar Equipo'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
