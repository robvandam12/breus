
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, User, CheckCircle } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOperaciones } from '@/hooks/useOperaciones';
import { toast } from '@/hooks/use-toast';

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
  const [selectedEquipoId, setSelectedEquipoId] = useState(currentEquipoId || '');
  const [selectedSupervisorId, setSelectedSupervisorId] = useState(currentSupervisorId || '');
  const { assignEquipoAndSupervisor } = useOperaciones();

  // Obtener equipos de buceo
  const { data: equipos = [] } = useQuery({
    queryKey: ['equipos-buceo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipos_buceo')
        .select('*')
        .eq('activo', true);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Obtener miembros del equipo seleccionado
  const { data: miembrosEquipo = [] } = useQuery({
    queryKey: ['equipo-miembros', selectedEquipoId],
    queryFn: async () => {
      if (!selectedEquipoId) return [];
      
      const { data, error } = await supabase
        .from('equipo_buceo_miembros')
        .select(`
          *,
          usuario:usuario_id(
            usuario_id,
            nombre,
            apellido,
            rol,
            estado_buzo
          )
        `)
        .eq('equipo_id', selectedEquipoId)
        .eq('disponible', true);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedEquipoId
  });

  // Filtrar supervisores (roles que pueden supervisar)
  const supervisores = miembrosEquipo.filter(miembro => 
    miembro.usuario && 
    (miembro.usuario.rol === 'supervisor' || 
     miembro.usuario.rol === 'admin_servicio' ||
     miembro.rol_equipo === 'supervisor')
  );

  const handleSave = async () => {
    if (!selectedEquipoId || !selectedSupervisorId) {
      toast({
        title: "Datos incompletos",
        description: "Debe seleccionar un equipo y un supervisor",
        variant: "destructive"
      });
      return;
    }

    try {
      await assignEquipoAndSupervisor(operacionId, selectedEquipoId, selectedSupervisorId);
      onComplete(selectedEquipoId, selectedSupervisorId);
    } catch (error) {
      console.error('Error assigning equipo:', error);
      toast({
        title: "Error",
        description: "No se pudo asignar el equipo y supervisor",
        variant: "destructive"
      });
    }
  };

  const isCompleted = currentEquipoId && currentSupervisorId;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Asignación de Equipo de Buceo
          {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isCompleted && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">✓ Equipo y supervisor asignados correctamente</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Equipo de Buceo</Label>
            <Select value={selectedEquipoId} onValueChange={setSelectedEquipoId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar equipo de buceo" />
              </SelectTrigger>
              <SelectContent>
                {equipos.map((equipo) => (
                  <SelectItem key={equipo.id} value={equipo.id}>
                    <div className="flex items-center gap-2">
                      <span>{equipo.nombre}</span>
                      <Badge variant="secondary">{equipo.estado}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEquipoId && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Miembros del Equipo</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {miembrosEquipo.map((miembro) => (
                    <div key={miembro.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {miembro.usuario?.nombre} {miembro.usuario?.apellido}
                          </p>
                          <p className="text-sm text-gray-600">{miembro.rol_equipo}</p>
                        </div>
                        <Badge variant="outline">{miembro.usuario?.rol}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Supervisor</Label>
                <Select value={selectedSupervisorId} onValueChange={setSelectedSupervisorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    {supervisores.map((supervisor) => (
                      <SelectItem key={supervisor.usuario.usuario_id} value={supervisor.usuario.usuario_id}>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{supervisor.usuario.nombre} {supervisor.usuario.apellido}</span>
                          <Badge variant="secondary">{supervisor.usuario.rol}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {supervisores.length === 0 && selectedEquipoId && (
                  <p className="text-sm text-amber-600">
                    No hay supervisores disponibles en este equipo
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave}
            disabled={!selectedEquipoId || !selectedSupervisorId}
          >
            {isCompleted ? 'Actualizar Asignación' : 'Asignar Equipo'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
