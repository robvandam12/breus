import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Users, UserPlus, Edit, Trash2, History, AlertTriangle } from "lucide-react";
import { UserSearchSelect } from "@/components/usuarios/UserSearchSelect";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { toast } from "@/hooks/use-toast";

interface EquipoBuceoMemberManagerProps {
  equipoId: string;
  equipo: any;
}

export const EquipoBuceoMemberManager = ({ equipoId, equipo }: EquipoBuceoMemberManagerProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [newRole, setNewRole] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('buzo_principal');
  
  const { addMiembro, removeMiembro, updateMiembroRole } = useEquiposBuceoEnhanced();

  const handleAddMember = async (memberData: any) => {
    try {
      // Asegurar que el rol_equipo esté presente
      const finalMemberData = {
        equipo_id: equipoId,
        usuario_id: memberData.usuario_id,
        rol_equipo: selectedRole, // Usar el rol seleccionado del estado local
        nombre_completo: memberData.nombre_completo,
        email: memberData.email,
        invitado: memberData.invitado || false
      };

      console.log('Adding member with data:', finalMemberData);
      
      await addMiembro(finalMemberData);
      
      setShowAddDialog(false);
      toast({
        title: "Miembro agregado",
        description: "El miembro ha sido agregado al equipo exitosamente.",
      });
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el miembro al equipo.",
        variant: "destructive",
      });
    }
  };

  const handleSelectUser = (user: any) => {
    const memberData = {
      usuario_id: user.usuario_id,
      nombre_completo: user.nombre_completo || `${user.nombre} ${user.apellido}`,
      email: user.email,
      invitado: false
    };
    handleAddMember(memberData);
  };

  const handleInviteUser = (userData: any) => {
    const memberData = {
      usuario_id: null,
      nombre_completo: `${userData.nombre} ${userData.apellido}`,
      email: userData.email,
      invitado: true
    };
    handleAddMember(memberData);
  };

  const handleEditRole = async () => {
    if (!selectedMember || !newRole) return;
    
    try {
      await updateMiembroRole({
        miembro_id: selectedMember.id,
        nuevo_rol: newRole,
        equipo_id: equipoId
      });
      
      setShowEditDialog(false);
      setSelectedMember(null);
      setNewRole('');
      
      toast({
        title: "Rol actualizado",
        description: "El rol del miembro ha sido actualizado exitosamente.",
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol del miembro.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedMember) return;
    
    try {
      await removeMiembro({
        miembro_id: selectedMember.id,
        equipo_id: equipoId
      });
      
      setShowRemoveDialog(false);
      setSelectedMember(null);
      
      toast({
        title: "Miembro removido",
        description: "El miembro ha sido removido del equipo exitosamente.",
      });
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "No se pudo remover el miembro del equipo.",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (rol: string) => {
    const colors: Record<string, string> = {
      supervisor: 'bg-purple-100 text-purple-700',
      buzo_principal: 'bg-blue-100 text-blue-700',
      buzo_asistente: 'bg-teal-100 text-teal-700',
    };
    return colors[rol] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Gestión de Miembros
            <Badge variant="outline">{equipo.miembros?.length || 0} miembros</Badge>
          </CardTitle>
          
          <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Agregar Miembro
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {!equipo.miembros || equipo.miembros.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay miembros asignados</h3>
            <p className="text-zinc-500 mb-4">Agregue miembros a este equipo de buceo</p>
            <Button onClick={() => setShowAddDialog(true)} variant="outline">
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
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipo.miembros.map((miembro: any) => (
                <TableRow key={miembro.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{miembro.nombre_completo}</div>
                      <div className="text-sm text-gray-500">{miembro.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(miembro.rol)}>
                      {miembro.rol}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={miembro.disponible ? 'default' : 'secondary'}>
                      {miembro.disponible ? 'Disponible' : 'No disponible'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedMember(miembro);
                          setNewRole(miembro.rol);
                          setShowEditDialog(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedMember(miembro);
                          setShowRemoveDialog(true);
                        }}
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
      </CardContent>

      {/* Dialog para agregar miembro */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Agregar Miembro al Equipo</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-2">Rol en el Equipo</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="buzo_principal">Buzo Principal</SelectItem>
                  <SelectItem value="buzo_asistente">Buzo Asistente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <UserSearchSelect
              onSelectUser={handleSelectUser}
              onInviteUser={handleInviteUser}
              allowedRoles={['supervisor', 'buzo']}
              placeholder="Buscar usuario para agregar al equipo..."
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar rol */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Rol de Miembro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Miembro: <strong>{selectedMember?.nombre_completo}</strong>
              </p>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar nuevo rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="buzo_principal">Buzo Principal</SelectItem>
                  <SelectItem value="buzo_asistente">Buzo Asistente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditRole} disabled={!newRole || newRole === selectedMember?.rol}>
                Actualizar Rol
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para remover miembro */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Miembro del Equipo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">¿Está seguro?</p>
                <p className="text-sm text-yellow-700">
                  Se removerá a <strong>{selectedMember?.nombre_completo}</strong> del equipo.
                  Esta acción quedará registrada para trazabilidad.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRemoveDialog(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleRemoveMember}>
                Remover Miembro
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
