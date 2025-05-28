
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, UserPlus, Edit, Trash2, AlertTriangle } from "lucide-react";
import { UserSearchSelect } from "@/components/usuarios/UserSearchSelect";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface TeamMember {
  id: string;
  usuario_id: string;
  nombre_completo: string;
  rol_equipo: string;
  email: string;
  disponible: boolean;
}

interface TeamMemberManagerProps {
  equipoId: string;
  miembros: TeamMember[];
  equipoNombre: string;
}

export const TeamMemberManager = ({ equipoId, miembros, equipoNombre }: TeamMemberManagerProps) => {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('buzo_principal');
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Registrar cambios para trazabilidad
  const logMemberChange = async (action: string, memberData: any, details?: string) => {
    try {
      await supabase.from('usuario_actividad').insert({
        usuario_id: (await supabase.auth.getUser()).data.user?.id,
        accion: action,
        entidad_tipo: 'equipo_buceo_miembro',
        entidad_id: equipoId,
        detalle: `${action} miembro ${memberData.nombre_completo} en equipo ${equipoNombre}. ${details || ''}`
      });
    } catch (error) {
      console.error('Error logging member change:', error);
    }
  };

  const addMemberMutation = useMutation({
    mutationFn: async (memberData: {
      usuario_id: string;
      rol_equipo: string;
      nombre_completo: string;
      email: string;
    }) => {
      const { data, error } = await supabase
        .from('equipo_buceo_miembros')
        .insert({
          equipo_id: equipoId,
          usuario_id: memberData.usuario_id,
          rol_equipo: memberData.rol_equipo,
          disponible: true
        })
        .select()
        .single();

      if (error) throw error;

      await logMemberChange('AGREGAR_MIEMBRO', memberData, `Rol: ${memberData.rol_equipo}`);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      toast({
        title: "Miembro agregado",
        description: "El miembro ha sido agregado exitosamente al equipo.",
      });
      setIsAddDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "No se pudo agregar el miembro al equipo.",
        variant: "destructive",
      });
    },
  });

  const updateMemberMutation = useMutation({
    mutationFn: async (data: { memberId: string; newRole: string; memberName: string }) => {
      const { error } = await supabase
        .from('equipo_buceo_miembros')
        .update({ rol_equipo: data.newRole })
        .eq('id', data.memberId);

      if (error) throw error;

      await logMemberChange('CAMBIAR_ROL', { nombre_completo: data.memberName }, 
        `Nuevo rol: ${data.newRole}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      toast({
        title: "Rol actualizado",
        description: "El rol del miembro ha sido actualizado exitosamente.",
      });
      setIsEditDialogOpen(false);
      setEditingMember(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol del miembro.",
        variant: "destructive",
      });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (member: TeamMember) => {
      // Verificar si el miembro está en operaciones activas
      const { data: operacionesActivas } = await supabase
        .from('operacion')
        .select('id, nombre, codigo')
        .eq('equipo_buceo_id', equipoId)
        .eq('estado', 'activa');

      if (operacionesActivas && operacionesActivas.length > 0) {
        throw new Error(`No se puede eliminar el miembro porque el equipo está asignado a ${operacionesActivas.length} operación(es) activa(s)`);
      }

      const { error } = await supabase
        .from('equipo_buceo_miembros')
        .delete()
        .eq('id', member.id);

      if (error) throw error;

      await logMemberChange('REMOVER_MIEMBRO', member, `Rol anterior: ${member.rol_equipo}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      toast({
        title: "Miembro removido",
        description: "El miembro ha sido removido exitosamente del equipo.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo remover el miembro del equipo.",
        variant: "destructive",
      });
    },
  });

  const handleAddMember = (userData: any) => {
    addMemberMutation.mutate({
      usuario_id: userData.usuario_id,
      rol_equipo: selectedRole,
      nombre_completo: userData.nombre_completo,
      email: userData.email
    });
  };

  const handleEditRole = (member: TeamMember) => {
    setEditingMember(member);
    setSelectedRole(member.rol_equipo);
    setIsEditDialogOpen(true);
  };

  const handleUpdateRole = () => {
    if (!editingMember) return;
    
    updateMemberMutation.mutate({
      memberId: editingMember.id,
      newRole: selectedRole,
      memberName: editingMember.nombre_completo
    });
  };

  const getRoleBadgeColor = (rol: string) => {
    const colors: Record<string, string> = {
      supervisor: 'bg-purple-100 text-purple-700',
      buzo_principal: 'bg-blue-100 text-blue-700',
      buzo_asistente: 'bg-teal-100 text-teal-700',
    };
    return colors[rol] || 'bg-gray-100 text-gray-700';
  };

  const getRoleLabel = (rol: string) => {
    const labels: Record<string, string> = {
      supervisor: 'Supervisor',
      buzo_principal: 'Buzo Principal',
      buzo_asistente: 'Buzo Asistente',
    };
    return labels[rol] || rol;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Gestión de Miembros
            <Badge variant="outline" className="ml-2">
              {miembros.length} miembros
            </Badge>
          </CardTitle>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Agregar Miembro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Agregar Miembro al Equipo</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rol en el Equipo</label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="buzo_principal">Buzo Principal</SelectItem>
                      <SelectItem value="buzo_asistente">Buzo Asistente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <UserSearchSelect
                  onSelectUser={handleAddMember}
                  onInviteUser={handleAddMember}
                  allowedRoles={selectedRole === 'supervisor' ? ['supervisor'] : ['buzo']}
                  placeholder="Buscar usuario para agregar al equipo..."
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {miembros.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay miembros asignados</h3>
            <p className="text-zinc-500 mb-4">Agregue miembros a este equipo</p>
            <Button onClick={() => setIsAddDialogOpen(true)} variant="outline">
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar Primer Miembro
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Miembro</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {miembros.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="font-medium">{member.nombre_completo}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRoleBadgeColor(member.rol_equipo)}>
                      {getRoleLabel(member.rol_equipo)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.disponible ? 'default' : 'secondary'}>
                      {member.disponible ? 'Disponible' : 'No disponible'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-zinc-600">{member.email}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRole(member)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeMemberMutation.mutate(member)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Edit Role Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Rol del Miembro</DialogTitle>
            </DialogHeader>
            
            {editingMember && (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-900">{editingMember.nombre_completo}</div>
                  <div className="text-sm text-blue-700">{editingMember.email}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Nuevo Rol</label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="buzo_principal">Buzo Principal</SelectItem>
                      <SelectItem value="buzo_asistente">Buzo Asistente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleUpdateRole}
                    disabled={updateMemberMutation.isPending}
                    className="flex-1"
                  >
                    {updateMemberMutation.isPending ? 'Actualizando...' : 'Actualizar Rol'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setEditingMember(null);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
