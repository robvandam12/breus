
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserPlus, Edit, Trash2, AlertTriangle, Search } from "lucide-react";
import { UserSearchSelect } from "@/components/usuarios/UserSearchSelect";
import { useToast } from "@/hooks/use-toast";

interface PersonalManagerProps {
  title: string;
  description?: string;
  personal: any[];
  onAddMember: (memberData: any) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
  onUpdateRole?: (memberId: string, newRole: string) => Promise<void>;
  allowedRoles?: string[];
  showRoleManagement?: boolean;
  emptyStateMessage?: string;
  addButtonText?: string;
}

export const PersonalManager = ({
  title,
  description,
  personal,
  onAddMember,
  onRemoveMember,
  onUpdateRole,
  allowedRoles = ['supervisor', 'buzo_principal', 'buzo_asistente'],
  showRoleManagement = true,
  emptyStateMessage = "No hay personal asignado",
  addButtonText = "Agregar Personal"
}: PersonalManagerProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [newRole, setNewRole] = useState<string>('');
  const { toast } = useToast();

  const handleAddMember = async (memberData: any) => {
    try {
      await onAddMember(memberData);
      setShowAddDialog(false);
      toast({
        title: "Personal agregado",
        description: "El miembro ha sido agregado exitosamente.",
      });
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el miembro.",
        variant: "destructive",
      });
    }
  };

  const handleEditRole = async () => {
    if (!selectedMember || !newRole || !onUpdateRole) return;
    
    try {
      await onUpdateRole(selectedMember.id, newRole);
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
      await onRemoveMember(selectedMember.id);
      setShowRemoveDialog(false);
      setSelectedMember(null);
      
      toast({
        title: "Personal removido",
        description: "El miembro ha sido removido exitosamente.",
      });
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "No se pudo remover el miembro.",
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

  const getRoleDisplayName = (rol: string) => {
    const names: Record<string, string> = {
      supervisor: 'Supervisor',
      buzo_principal: 'Buzo Principal',
      buzo_asistente: 'Buzo Asistente',
    };
    return names[rol] || rol;
  };

  return (
    <Card className="ios-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              {title}
              <Badge variant="outline">{personal.length} miembros</Badge>
            </CardTitle>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
          
          <Button 
            onClick={() => setShowAddDialog(true)} 
            className="ios-button bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {addButtonText}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {personal.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">{emptyStateMessage}</h3>
            <p className="text-zinc-500 mb-4">Agregue personal a este equipo</p>
            <Button 
              onClick={() => setShowAddDialog(true)} 
              variant="outline"
              className="ios-button"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar Primer Miembro
            </Button>
          </div>
        ) : (
          <div className="ios-table-container">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Miembro</TableHead>
                  {showRoleManagement && <TableHead>Rol</TableHead>}
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {personal.map((miembro: any) => (
                  <TableRow key={miembro.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{miembro.nombre_completo || miembro.nombre}</div>
                        <div className="text-sm text-gray-500">{miembro.email}</div>
                      </div>
                    </TableCell>
                    {showRoleManagement && (
                      <TableCell>
                        <Badge className={getRoleBadgeColor(miembro.rol || miembro.rol_equipo)}>
                          {getRoleDisplayName(miembro.rol || miembro.rol_equipo)}
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge variant={miembro.disponible !== false ? 'default' : 'secondary'}>
                        {miembro.disponible !== false ? 'Disponible' : 'No disponible'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {showRoleManagement && onUpdateRole && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="ios-button-sm"
                            onClick={() => {
                              setSelectedMember(miembro);
                              setNewRole(miembro.rol || miembro.rol_equipo);
                              setShowEditDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="ios-button-sm text-red-600 hover:text-red-700"
                          onClick={() => {
                            setSelectedMember(miembro);
                            setShowRemoveDialog(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Dialog para agregar miembro */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Agregar Personal</DialogTitle>
            <p className="text-sm text-gray-600 mt-2">
              Busque un usuario existente por email o invite uno nuevo escribiendo su email completo.
            </p>
          </DialogHeader>
          <UserSearchSelect
            onSelectUser={handleAddMember}
            onInviteUser={handleAddMember}
            allowedRoles={allowedRoles}
            placeholder="Escriba el email del usuario para buscar o invitar..."
          />
        </DialogContent>
      </Dialog>

      {/* Dialog para editar rol */}
      {showRoleManagement && onUpdateRole && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cambiar Rol de Miembro</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Miembro: <strong>{selectedMember?.nombre_completo || selectedMember?.nombre}</strong>
                </p>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger className="ios-input">
                    <SelectValue placeholder="Seleccionar nuevo rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {allowedRoles.map(role => (
                      <SelectItem key={role} value={role}>
                        {getRoleDisplayName(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowEditDialog(false)}
                  className="ios-button"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleEditRole} 
                  disabled={!newRole || newRole === (selectedMember?.rol || selectedMember?.rol_equipo)}
                  className="ios-button"
                >
                  Actualizar Rol
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog para remover miembro */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Personal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">¿Está seguro?</p>
                <p className="text-sm text-yellow-700">
                  Se removerá a <strong>{selectedMember?.nombre_completo || selectedMember?.nombre}</strong> del equipo.
                  Esta acción quedará registrada para trazabilidad.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowRemoveDialog(false)}
                className="ios-button"
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleRemoveMember}
                className="ios-button"
              >
                Remover Personal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
