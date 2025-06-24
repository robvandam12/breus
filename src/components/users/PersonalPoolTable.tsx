
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Edit, UserPlus, Search, Filter } from "lucide-react";
import { Usuario } from "@/types/usuario";
import { useUsuarios } from "@/hooks/useUsuarios";
import { toast } from "@/hooks/use-toast";

interface PersonalPoolTableProps {
  usuarios: Usuario[];
  isLoading: boolean;
}

export const PersonalPoolTable: React.FC<PersonalPoolTableProps> = ({ usuarios, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const { updateUsuario, inviteUsuario, deleteUsuario } = useUsuarios();

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || usuario.rol === roleFilter;
    const matchesStatus = statusFilter === 'all' || usuario.estado_buzo === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (estado: string) => {
    const colors = {
      'activo': 'bg-green-100 text-green-700',
      'disponible': 'bg-blue-100 text-blue-700',
      'inactivo': 'bg-gray-100 text-gray-700',
      'suspendido': 'bg-red-100 text-red-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getRoleBadge = (rol: string) => {
    const colors = {
      'buzo': 'bg-blue-100 text-blue-700',
      'supervisor': 'bg-purple-100 text-purple-700',
      'admin_servicio': 'bg-orange-100 text-orange-700',
      'admin_salmonera': 'bg-green-100 text-green-700'
    };
    return colors[rol as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const handleEditUser = (usuario: Usuario) => {
    setEditingUser(usuario);
    setShowEditDialog(true);
  };

  const handleUpdateUser = async (userData: any) => {
    if (!editingUser) return;
    
    try {
      await updateUsuario(editingUser.usuario_id, userData);
      setShowEditDialog(false);
      setEditingUser(null);
      toast({
        title: "Usuario actualizado",
        description: "Los datos del usuario han sido actualizados exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario.",
        variant: "destructive",
      });
    }
  };

  const handleInviteUser = async (userData: any) => {
    try {
      await inviteUsuario(userData);
      setShowInviteDialog(false);
      toast({
        title: "Invitación enviada",
        description: "La invitación ha sido enviada exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la invitación.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este usuario?')) return;
    
    try {
      await deleteUsuario(userId);
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros y acciones */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nombre, apellido o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            <SelectItem value="buzo">Buzo</SelectItem>
            <SelectItem value="supervisor">Supervisor</SelectItem>
            <SelectItem value="admin_servicio">Admin Servicio</SelectItem>
            <SelectItem value="admin_salmonera">Admin Salmonera</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="activo">Activo</SelectItem>
            <SelectItem value="disponible">Disponible</SelectItem>
            <SelectItem value="inactivo">Inactivo</SelectItem>
            <SelectItem value="suspendido">Suspendido</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => setShowInviteDialog(true)} className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Invitar Usuario
        </Button>
      </div>

      {/* Tabla de usuarios */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsuarios.map((usuario) => (
            <TableRow key={usuario.usuario_id}>
              <TableCell>
                <div>
                  <div className="font-medium">{usuario.nombre} {usuario.apellido}</div>
                  <div className="text-sm text-gray-500">ID: {usuario.usuario_id.slice(0, 8)}...</div>
                </div>
              </TableCell>
              <TableCell>{usuario.email || 'No especificado'}</TableCell>
              <TableCell>
                <Badge className={getRoleBadge(usuario.rol)}>
                  {usuario.rol.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusBadge(usuario.estado_buzo || 'inactivo')}>
                  {usuario.estado_buzo || 'inactivo'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {usuario.salmonera ? (
                    <span className="text-blue-600">{usuario.salmonera.nombre}</span>
                  ) : usuario.contratista ? (
                    <span className="text-orange-600">{usuario.contratista.nombre}</span>
                  ) : (
                    <span className="text-gray-500">Sin empresa</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditUser(usuario)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditUser(usuario)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredUsuarios.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No se encontraron usuarios que coincidan con los filtros.</p>
        </div>
      )}

      {/* Dialog para editar usuario */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nombre</label>
                <Input defaultValue={editingUser.nombre} />
              </div>
              <div>
                <label className="text-sm font-medium">Apellido</label>
                <Input defaultValue={editingUser.apellido} />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input defaultValue={editingUser.email || ''} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => handleUpdateUser({})}>
                  Guardar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para invitar usuario */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invitar Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input placeholder="email@ejemplo.com" />
            </div>
            <div>
              <label className="text-sm font-medium">Rol</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buzo">Buzo</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="admin_servicio">Admin Servicio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={() => handleInviteUser({})}>
                Enviar Invitación
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
