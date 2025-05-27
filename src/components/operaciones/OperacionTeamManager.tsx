import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Users, Plus, X, UserPlus } from "lucide-react";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface OperacionTeamManagerProps {
  operacionId: string;
  salmoneraId?: string;
  onClose?: () => void;
}

export const OperacionTeamManager = ({ operacionId, salmoneraId, onClose }: OperacionTeamManagerProps) => {
  const { equipos } = useEquiposBuceoEnhanced();
  const { operaciones } = useOperaciones();
  const queryClient = useQueryClient();
  
  const [selectedEquipoId, setSelectedEquipoId] = useState('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  
  const operacion = operaciones.find(op => op.id === operacionId);
  const availableEquipos = equipos.filter(e => e.empresa_id === salmoneraId);
  const selectedEquipo = equipos.find(e => e.id === selectedEquipoId);
  
  // Get current assigned team from operacion
  const assignedTeam = operacion?.equipo_buceo_id 
    ? equipos.find(e => e.id === operacion.equipo_buceo_id)
    : null;

  const updateOperacionTeam = useMutation({
    mutationFn: async (equipoId: string) => {
      const { data, error } = await supabase
        .from('operacion')
        .update({ equipo_buceo_id: equipoId })
        .eq('id', operacionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: 'Equipo asignado',
        description: 'El equipo de buceo ha sido asignado a la operación.',
      });
    },
    onError: (error) => {
      console.error('Error assigning team:', error);
      toast({
        title: 'Error',
        description: 'No se pudo asignar el equipo a la operación.',
        variant: 'destructive',
      });
    },
  });

  const removeOperacionTeam = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('operacion')
        .update({ equipo_buceo_id: null })
        .eq('id', operacionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: 'Equipo removido',
        description: 'El equipo de buceo ha sido removido de la operación.',
      });
    },
    onError: (error) => {
      console.error('Error removing team:', error);
      toast({
        title: 'Error',
        description: 'No se pudo remover el equipo de la operación.',
        variant: 'destructive',
      });
    },
  });

  const handleAssignTeam = () => {
    if (selectedEquipoId) {
      updateOperacionTeam.mutate(selectedEquipoId);
      setIsAssignDialogOpen(false);
      setSelectedEquipoId('');
    }
  };

  const handleRemoveTeam = () => {
    removeOperacionTeam.mutate();
  };

  const getRolBadgeColor = (rol: string) => {
    const colorMap: Record<string, string> = {
      supervisor: 'bg-blue-100 text-blue-700',
      buzo_principal: 'bg-green-100 text-green-700',
      buzo_asistente: 'bg-yellow-100 text-yellow-700',
    };
    return colorMap[rol] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card className="ios-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Equipo Asignado
            <Badge variant="outline">
              {assignedTeam?.miembros?.length || 0} miembros
            </Badge>
          </CardTitle>
          <div className="flex gap-2">
            {assignedTeam && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveTeam}
                disabled={removeOperacionTeam.isPending}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4 mr-2" />
                Remover Equipo
              </Button>
            )}
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  {assignedTeam ? 'Cambiar Equipo' : 'Asignar Equipo'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Asignar Equipo de Buceo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Equipo de Buceo</Label>
                    <Select value={selectedEquipoId} onValueChange={setSelectedEquipoId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar equipo..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableEquipos.map((equipo) => (
                          <SelectItem key={equipo.id} value={equipo.id}>
                            {equipo.nombre} ({equipo.miembros?.length || 0} miembros)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedEquipo && selectedEquipo.miembros && (
                    <div className="space-y-2">
                      <Label>Miembros del Equipo:</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedEquipo.miembros.map((miembro) => (
                          <div key={miembro.id} className="flex items-center justify-between p-2 bg-zinc-50 rounded">
                            <div>
                              <span className="font-medium">{miembro.nombre_completo}</span>
                              <Badge variant="outline" className={`ml-2 ${getRolBadgeColor(miembro.rol)}`}>
                                {miembro.rol.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleAssignTeam}
                      disabled={!selectedEquipoId || updateOperacionTeam.isPending}
                      className="flex-1"
                    >
                      {updateOperacionTeam.isPending ? 'Asignando...' : 'Asignar Equipo'}
                    </Button>
                    <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!assignedTeam ? (
          <div className="text-center py-8 text-zinc-500">
            <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="font-medium text-zinc-900 mb-2">No hay equipo asignado</h3>
            <p className="text-sm text-zinc-500 mb-4">
              Asigne un equipo de buceo para esta operación
            </p>
            <Button onClick={() => setIsAssignDialogOpen(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Asignar Equipo
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <h4 className="font-medium text-blue-900">{assignedTeam.nombre}</h4>
                {assignedTeam.descripcion && (
                  <p className="text-sm text-blue-700">{assignedTeam.descripcion}</p>
                )}
              </div>
              <Badge variant="outline" className="bg-blue-100 text-blue-700">
                Equipo Asignado
              </Badge>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Miembro</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Contacto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedTeam.miembros?.map((miembro) => (
                  <TableRow key={miembro.id}>
                    <TableCell>
                      <div className="font-medium">{miembro.nombre_completo}</div>
                      {miembro.matricula && (
                        <div className="text-sm text-zinc-500">Matrícula: {miembro.matricula}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRolBadgeColor(miembro.rol)}>
                        {miembro.rol.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        Disponible
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {miembro.email && (
                        <div className="text-sm text-zinc-600">{miembro.email}</div>
                      )}
                      {miembro.telefono && (
                        <div className="text-sm text-zinc-600">{miembro.telefono}</div>
                      )}
                    </TableCell>
                  </TableRow>
                )) || (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-zinc-500">
                      No hay miembros en este equipo
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
