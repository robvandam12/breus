
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Shield, CheckCircle2, AlertTriangle } from "lucide-react";
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

  const { data: equipos = [], isLoading: loadingEquipos } = useQuery({
    queryKey: ['equipos-buceo-disponibles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipos_buceo')
        .select(`
          *,
          miembros:equipo_buceo_miembros(
            *,
            usuario:usuario_id(nombre, apellido, rol)
          )
        `)
        .eq('estado', 'disponible')
        .eq('activo', true)
        .order('nombre');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: supervisores = [], isLoading: loadingSupervisores } = useQuery({
    queryKey: ['supervisores-disponibles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usuario')
        .select('usuario_id, nombre, apellido, email')
        .in('rol', ['supervisor', 'admin_servicio', 'superuser'])
        .order('nombre');
      
      if (error) throw error;
      return data;
    }
  });

  const selectedEquipoData = equipos.find(e => e.id === selectedEquipo);

  const handleAssignEquipo = async () => {
    if (!selectedEquipo || !selectedSupervisor) {
      toast({
        title: "Error",
        description: "Debe seleccionar tanto el equipo como el supervisor",
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
        title: "Equipo asignado",
        description: "El equipo y supervisor han sido asignados exitosamente"
      });

      onComplete(selectedEquipo, selectedSupervisor);
    } catch (error) {
      console.error('Error assigning equipo:', error);
      toast({
        title: "Error",
        description: "No se pudo asignar el equipo",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Asignar Equipo de Buceo y Supervisor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {(currentEquipoId && currentSupervisorId) && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800">Equipo y supervisor ya asignados</span>
          </div>
        )}

        {/* Selección de Equipo */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Users className="w-4 h-4" />
            Equipo de Buceo
          </label>
          <Select value={selectedEquipo} onValueChange={setSelectedEquipo} disabled={loadingEquipos}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un equipo..." />
            </SelectTrigger>
            <SelectContent>
              {equipos.map((equipo) => (
                <SelectItem key={equipo.id} value={equipo.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{equipo.nombre}</span>
                    <span className="text-xs text-gray-500">
                      {equipo.miembros?.length || 0} miembros - {equipo.tipo_empresa}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Información del equipo seleccionado */}
        {selectedEquipoData && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Miembros del Equipo</h4>
            <div className="space-y-1">
              {selectedEquipoData.miembros?.map((miembro: any) => (
                <div key={miembro.id} className="text-sm text-blue-800 flex justify-between">
                  <span>{miembro.usuario?.nombre} {miembro.usuario?.apellido}</span>
                  <span className="font-medium">{miembro.rol_equipo}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selección de Supervisor */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Supervisor Asignado
          </label>
          <Select value={selectedSupervisor} onValueChange={setSelectedSupervisor} disabled={loadingSupervisores}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un supervisor..." />
            </SelectTrigger>
            <SelectContent>
              {supervisores.map((supervisor) => (
                <SelectItem key={supervisor.usuario_id} value={supervisor.usuario_id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{supervisor.nombre} {supervisor.apellido}</span>
                    <span className="text-xs text-gray-500">{supervisor.email}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleAssignEquipo} 
          disabled={!selectedEquipo || !selectedSupervisor || isAssigning}
          className="w-full"
        >
          {isAssigning ? 'Asignando...' : (currentEquipoId && currentSupervisorId) ? 'Cambiar Asignación' : 'Asignar Equipo y Supervisor'}
        </Button>
      </CardContent>
    </Card>
  );
};
