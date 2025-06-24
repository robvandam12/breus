
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Edit, UserPlus, Search } from "lucide-react";
import { UserByCompany } from "@/hooks/useUsersByCompany";
import { UserSearchSelectEnhanced } from "@/components/usuarios/UserSearchSelectEnhanced";

interface PersonalPoolTableProps {
  usuarios: UserByCompany[];
  isLoading: boolean;
  onCreateUser: (userData: any) => Promise<void>;
  onUpdateUser: (id: string, userData: any) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
  empresaType: 'salmonera' | 'contratista';
  empresaId: string;
}

export const PersonalPoolTable: React.FC<PersonalPoolTableProps> = ({ 
  usuarios, 
  isLoading, 
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  empresaType,
  empresaId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<UserByCompany | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || usuario.rol === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getStatusBadge = (usuario: UserByCompany) => {
    const isCompleted = usuario.perfil_completado;
    if (isCompleted) {
      return <Badge className="bg-green-100 text-green-700">Activo</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-700">Pendiente</Badge>;
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

  const handleEditUser = (usuario: UserByCompany) => {
    setEditingUser(usuario);
    setShowEditDialog(true);
  };

  const handleUserSelect = async (user: any) => {
    await onCreateUser({
      usuario_id: user.usuario_id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol,
    });
    setShowInviteDialog(false);
  };

  const handleUserInvite = async (userData: any) => {
    await onCreateUser(userData);
    setShowInviteDialog(false);
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

  const allowedRoles = empresaType === 'salmonera' 
    ? ['admin_salmonera', 'supervisor', 'buzo']
    : ['admin_servicio', 'supervisor', 'buzo'];

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
            {allowedRoles.map(role => (
              <SelectItem key={role} value={role}>
                {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={() => setShowInviteDialog(true)} className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Agregar Personal
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
                  {usuario.rol.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </TableCell>
              <TableCell>
                {getStatusBadge(usuario)}
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
            <DialogTitle>Ver Usuario</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nombre Completo</label>
                <p className="text-sm text-gray-600">{editingUser.nombre} {editingUser.apellido}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-sm text-gray-600">{editingUser.email || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Rol</label>
                <p className="text-sm text-gray-600">
                  {editingUser.rol.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Estado</label>
                <p className="text-sm text-gray-600">
                  {editingUser.perfil_completado ? 'Perfil Completado' : 'Perfil Pendiente'}
                </p>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para agregar usuario */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Agregar Personal a la Empresa</DialogTitle>
          </DialogHeader>
          <UserSearchSelectEnhanced
            onUserSelect={handleUserSelect}
            onUserInvite={handleUserInvite}
            companyType={empresaType}
            companyId={empresaId}
            allowedRoles={allowedRoles}
            placeholder="Buscar usuario existente o invitar nuevo..."
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
