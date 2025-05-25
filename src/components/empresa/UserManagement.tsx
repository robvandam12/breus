
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Edit, Trash2, UserPlus, Mail } from "lucide-react";

interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
  created_at: string;
}

interface UserManagementProps {
  empresaType: 'salmonera' | 'servicio';
  empresaId: string;
  users: User[];
  onCreateUser: (userData: any) => Promise<void>;
  onUpdateUser: (id: string, data: any) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
}

export const UserManagement = ({ 
  empresaType, 
  empresaId, 
  users, 
  onCreateUser, 
  onUpdateUser, 
  onDeleteUser 
}: UserManagementProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    nombre: '',
    apellido: '',
    email: '',
    rol: empresaType === 'salmonera' ? 'admin_salmonera' : 'supervisor',
    telefono: ''
  });

  const handleCreateUser = async () => {
    try {
      await onCreateUser(newUser);
      setNewUser({
        nombre: '',
        apellido: '',
        email: '',
        rol: empresaType === 'salmonera' ? 'admin_salmonera' : 'supervisor',
        telefono: ''
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const getRoleOptions = () => {
    if (empresaType === 'salmonera') {
      return [
        { value: 'admin_salmonera', label: 'Administrador Salmonera' },
        { value: 'jefe_centro', label: 'Jefe de Centro' }
      ];
    } else {
      return [
        { value: 'admin_servicio', label: 'Administrador Servicio' },
        { value: 'supervisor', label: 'Supervisor' },
        { value: 'buzo', label: 'Buzo Profesional' }
      ];
    }
  };

  const getRoleBadgeColor = (rol: string) => {
    const colorMap: Record<string, string> = {
      admin_salmonera: 'bg-blue-100 text-blue-700',
      admin_servicio: 'bg-purple-100 text-purple-700',
      supervisor: 'bg-orange-100 text-orange-700',
      buzo: 'bg-teal-100 text-teal-700',
      jefe_centro: 'bg-green-100 text-green-700'
    };
    return colorMap[rol] || 'bg-gray-100 text-gray-700';
  };

  const getEstadoBadgeColor = (estado: string) => {
    const colorMap: Record<string, string> = {
      activo: 'bg-green-100 text-green-700',
      inactivo: 'bg-gray-100 text-gray-700',
      pendiente: 'bg-yellow-100 text-yellow-700'
    };
    return colorMap[estado] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card className="ios-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Gestión de Usuarios
            <Badge variant="outline" className="ml-2">
              {users.length} usuarios
            </Badge>
          </CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Invitar Usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  Invitar Nuevo Usuario
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={newUser.nombre}
                      onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                      placeholder="Juan"
                    />
                  </div>
                  <div>
                    <Label htmlFor="apellido">Apellido *</Label>
                    <Input
                      id="apellido"
                      value={newUser.apellido}
                      onChange={(e) => setNewUser({ ...newUser, apellido: e.target.value })}
                      placeholder="Pérez"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="juan.perez@empresa.cl"
                  />
                </div>

                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={newUser.telefono}
                    onChange={(e) => setNewUser({ ...newUser, telefono: e.target.value })}
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                <div>
                  <Label htmlFor="rol">Rol *</Label>
                  <Select value={newUser.rol} onValueChange={(value) => setNewUser({ ...newUser, rol: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol..." />
                    </SelectTrigger>
                    <SelectContent>
                      {getRoleOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleCreateUser} 
                    disabled={!newUser.nombre || !newUser.apellido || !newUser.email}
                    className="flex-1"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Invitación
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay usuarios registrados</h3>
            <p className="text-zinc-500 mb-4">Comience invitando al primer usuario a su equipo</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Invitar Usuario
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{user.nombre} {user.apellido}</div>
                        <div className="text-xs text-zinc-500">ID: {user.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRoleBadgeColor(user.rol)}>
                      {user.rol.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getEstadoBadgeColor(user.estado)}>
                      {user.estado.charAt(0).toUpperCase() + user.estado.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onDeleteUser(user.id)}
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
    </Card>
  );
};
