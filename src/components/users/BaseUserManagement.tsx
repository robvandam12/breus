import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Plus, Edit, Trash2, Shield, Search, Eye } from "lucide-react";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { UserDetailModal } from "./UserDetailModal";
import { InviteUserForm } from "./InviteUserForm";

export interface BaseUser {
  id: string;
  usuario_id?: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  estado?: 'activo' | 'inactivo' | 'pendiente';
  empresa_nombre?: string;
  empresa_tipo?: 'salmonera' | 'contratista';
  created_at: string;
  [key: string]: any;
}

export interface UserManagementConfig {
  title: string;
  showCreateButton?: boolean;
  showInviteButton?: boolean;
  showDeleteButton?: boolean;
  allowedRoles?: string[];
  showCompanyFilter?: boolean;
  showSearch?: boolean;
  customActions?: (user: BaseUser) => React.ReactNode;
  customStats?: React.ReactNode;
}

interface BaseUserManagementProps {
  users: BaseUser[];
  isLoading: boolean;
  config: UserManagementConfig;
  onCreateUser?: (userData: any) => Promise<void>;
  onUpdateUser?: (id: string, userData: any) => Promise<void>;
  onDeleteUser?: (id: string) => Promise<void>;
  onInviteUser?: (userData: any) => Promise<void>;
  CreateUserForm?: React.ComponentType<any>;
  EditUserForm?: React.ComponentType<any>;
  InviteUserForm?: React.ComponentType<any>;
}

export const BaseUserManagement = ({
  users,
  isLoading,
  config,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  onInviteUser,
  CreateUserForm,
  EditUserForm,
  InviteUserForm
}: BaseUserManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<BaseUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<BaseUser | null>(null);
  const [viewingUser, setViewingUser] = useState<BaseUser | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.rol === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (rol: string) => {
    const colorMap: Record<string, string> = {
      superuser: 'bg-red-100 text-red-700',
      admin_salmonera: 'bg-blue-100 text-blue-700',
      admin_servicio: 'bg-purple-100 text-purple-700',
      supervisor: 'bg-orange-100 text-orange-700',
      buzo: 'bg-teal-100 text-teal-700',
    };
    return colorMap[rol] || 'bg-gray-100 text-gray-700';
  };

  const getEstadoBadge = (estado?: string) => {
    if (!estado) return null;
    
    const colorMap: Record<string, string> = {
      activo: 'bg-green-100 text-green-700',
      inactivo: 'bg-gray-100 text-gray-700',
      pendiente: 'bg-yellow-100 text-yellow-700',
    };

    return (
      <Badge variant="outline" className={colorMap[estado] || 'bg-gray-100 text-gray-700'}>
        {estado}
      </Badge>
    );
  };

  const handleDeleteUser = async (user: BaseUser) => {
    console.log('Attempting to delete user:', user);
    if (onDeleteUser) {
      try {
        await onDeleteUser(user.id || user.usuario_id!);
        console.log('User deleted successfully');
        setDeletingUser(null);
      } catch (error) {
        console.error('Error deleting user:', error);
        // Don't close dialog on error, let user try again
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      {config.customStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {config.customStats}
        </div>
      )}

      {/* Header y Controles */}
      <Card className="ios-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              {config.title}
              <Badge variant="outline" className="ml-2">
                {users.length} usuarios
              </Badge>
            </CardTitle>
            <div className="flex gap-2">
              {config.showInviteButton && onInviteUser && (
                <Button 
                  variant="outline"
                  onClick={() => setShowInviteDialog(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Invitar Usuario
                </Button>
              )}
              {config.showCreateButton && onCreateUser && (
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Usuario
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {config.showSearch && (
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                <Input
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabla de Usuarios */}
      <Card className="ios-card">
        <CardContent className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <h3 className="font-medium text-zinc-900 mb-2">No hay usuarios</h3>
              <p className="text-zinc-500">No se encontraron usuarios con los filtros aplicados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id || user.usuario_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{user.nombre} {user.apellido}</div>
                          {user.usuario_id && (
                            <div className="text-xs text-zinc-500">ID: {user.usuario_id.slice(0, 8)}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-600">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRoleBadgeColor(user.rol)}>
                        {user.rol.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-600">
                      {user.empresa_nombre || 'Sin asignar'}
                    </TableCell>
                    <TableCell>
                      {getEstadoBadge(user.estado)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {config.customActions ? (
                          config.customActions(user)
                        ) : (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setViewingUser(user)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingUser(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {config.showDeleteButton !== false && onDeleteUser && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setDeletingUser(user)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {CreateUserForm && (
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            </DialogHeader>
            <CreateUserForm
              onSubmit={async (data: any) => {
                await onCreateUser?.(data);
                setShowCreateDialog(false);
              }}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog de Invitación */}
      {InviteUserForm && (
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Invitar Usuario</DialogTitle>
            </DialogHeader>
            <InviteUserForm
              onSubmit={async (data: any) => {
                await onInviteUser?.(data);
                setShowInviteDialog(false);
              }}
              onCancel={() => setShowInviteDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog de Edición */}
      {EditUserForm && editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
            </DialogHeader>
            <EditUserForm
              initialData={editingUser}
              onSubmit={async (data: any) => {
                await onUpdateUser?.(editingUser.id || editingUser.usuario_id!, data);
                setEditingUser(null);
              }}
              onCancel={() => setEditingUser(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Detalle de Usuario */}
      {viewingUser && (
        <UserDetailModal
          user={viewingUser}
          isOpen={!!viewingUser}
          onClose={() => setViewingUser(null)}
        />
      )}

      {/* Dialog de Eliminación */}
      <DeleteUserDialog
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={() => handleDeleteUser(deletingUser!)}
        user={deletingUser}
      />
    </div>
  );
};
