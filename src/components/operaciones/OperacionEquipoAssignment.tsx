
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle2, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface OperacionEquipoAssignmentProps {
  operacionId: string;
  currentEquipoId?: string;
  currentSupervisorId?: string;
  onComplete: (equipoId: string, supervisorId: string) => void;
}

export const OperacionEquipoAssignment = ({ 
  operacionId, 
  currentEquipoId, 
  currentSupervisorId,
  onComplete 
}: OperacionEquipoAssignmentProps) => {
  const [selectedEquipo, setSelectedEquipo] = useState(currentEquipoId || '');
  const [selectedSupervisor, setSelectedSupervisor] = useState(currentSupervisorId || '');
  const [isAssigning, setIsAssigning] = useState(false);

  // Obtener equipos disponibles
  const { data: equipos = [], isLoading: equiposLoading } = useQuery({
    queryKey: ['equipos-disponibles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipos_buceo')
        .select('*')
        .eq('activo', true)
        .order('nombre');
      
      if (error) throw error;
      return data;
    }
  });

  // Obtener supervisores disponibles
  const { data: supervisores = [], isLoading: supervisoresLoading } = useQuery({
    queryKey: ['supervisores-disponibles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuario')
        .select('usuario_id, nombre, apellido, rol')
        .in('rol', ['admin_servicio', 'superuser'])
        .order('nombre');
      
      if (error) throw error;
      return data;
    }
  });

  // Obtener miembros del equipo seleccionado
  const { data: miembrosEquipo = [] } = useQuery({
    queryKey: ['miembros-equipo', selectedEquipo],
    queryFn: async () => {
      if (!selectedEquipo) return [];
      
      const { data, error } = await supabase
        .from('equipo_buceo_miembros')
        .select(`
          id,
          rol_equipo,
          disponible,
          usuario:usuario_id(
            usuario_id,
            nombre,
            apellido,
            rol
          )
        `)
        .eq('equipo_id', selectedEquipo)
        .eq('disponible', true);
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedEquipo
  });

  const handleAssignEquipo = async () => {
    if (!selectedEquipo || !selectedSupervisor) {
      toast({
        title: "Error",
        description: "Debe seleccionar tanto un equipo como un supervisor",
        variant: "destructive"
      });
      return;
    }

    setIsAssigning(true);
    try {
      const { error } = await supabase
        .from('operacion')
        .update({ 
          equipo_buceo_id: selectedEquipo,
          supervisor_asignado_id: selectedSupervisor
        })
        .eq('id', operacionId);

      if (error) throw error;

      toast({
        title: "Equipo y supervisor asignados",
        description: "El equipo de buceo y supervisor han sido asignados exitosamente"
      });

      onComplete(selectedEquipo, selectedSupervisor);
    } catch (error) {
      console.error('Error assigning team:', error);
      toast({
        title: "Error",
        description: "No se pudo asignar el equipo y supervisor",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const equipoSeleccionado = equipos.find(e => e.id === selectedEquipo);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Asignar Equipo de Buceo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(currentEquipoId || currentSupervisorId) && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800">
                {currentEquipoId && currentSupervisorId 
                  ? 'Equipo y supervisor ya asignados' 
                  : 'Asignación parcial completada'
                }
              </span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Seleccionar Equipo de Buceo</label>
            <Select value={selectedEquipo} onValueChange={setSelectedEquipo} disabled={equiposLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un equipo..." />
              </SelectTrigger>
              <SelectContent>
                {equipos.map((equipo) => (
                  <SelectItem key={equipo.id} value={equipo.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{equipo.nombre}</span>
                      <span className="text-xs text-gray-500">
                        {equipo.tipo_empresa} - {equipo.estado}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEquipo && miembrosEquipo.length > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Miembros del Equipo</h4>
              <div className="space-y-2">
                {miembrosEquipo.map((miembro) => (
                  <div key={miembro.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">
                        {miembro.usuario?.nombre} {miembro.usuario?.apellido}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {miembro.rol_equipo}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Seleccionar Supervisor</label>
            <Select value={selectedSupervisor} onValueChange={setSelectedSupervisor} disabled={supervisoresLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un supervisor..." />
              </SelectTrigger>
              <SelectContent>
                {supervisores.map((supervisor) => (
                  <SelectItem key={supervisor.usuario_id} value={supervisor.usuario_id}>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {supervisor.nombre} {supervisor.apellido}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {supervisor.rol.replace('_', ' ')}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {equipoSeleccionado && selectedSupervisor && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Resumen de Asignación</h4>
              <div className="text-sm text-green-800 space-y-1">
                <p><strong>Equipo:</strong> {equipoSeleccionado.nombre}</p>
                <p><strong>Supervisor:</strong> {
                  supervisores.find(s => s.usuario_id === selectedSupervisor)?.nombre
                } {
                  supervisores.find(s => s.usuario_id === selectedSupervisor)?.apellido
                }</p>
                <p><strong>Miembros:</strong> {miembrosEquipo.length} disponibles</p>
              </div>
            </div>
          )}

          <Button 
            onClick={handleAssignEquipo} 
            disabled={!selectedEquipo || !selectedSupervisor || isAssigning}
            className="w-full"
          >
            {isAssigning ? 'Asignando...' : 
             (currentEquipoId && currentSupervisorId) ? 'Cambiar Asignación' : 'Asignar Equipo y Supervisor'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
