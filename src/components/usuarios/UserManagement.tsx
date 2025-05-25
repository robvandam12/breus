
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Edit, Trash2, Shield, UserCheck, UserX } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface User {
  usuario_id: string;
  email: string | null;
  nombre: string;
  apellido: string;
  rol: 'superuser' | 'admin_salmonera' | 'admin_servicio' | 'supervisor' | 'buzo';
  salmonera_id?: string | null;
  servicio_id?: string | null;
  created_at: string;
  updated_at: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const roles = [
    { value: 'superuser', label: 'Super Usuario', color: 'bg-red-100 text-red-700' },
    { value: 'admin_salmonera', label: 'Admin Salmonera', color: 'bg-blue-100 text-blue-700' },
    { value: 'admin_servicio', label: 'Admin Servicio', color: 'bg-green-100 text-green-700' },
    { value: 'supervisor', label: 'Supervisor', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'buzo', label: 'Buzo', color: 'bg-gray-100 text-gray-700' }
  ];

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Asegurar el tipado correcto de los datos de la base de datos
      const typedUsers: User[] = (data || []).map(user => ({
        ...user,
        rol: user.rol as 'superuser' | 'admin_salmonera' | 'admin_servicio' | 'supervisor' | 'buzo'
      }));
      
      setUsers(typedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = selectedRole === 'all' || user.rol === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (rol: string) => {
    const roleInfo = roles.find(r => r.value === rol);
    return (
      <Badge className={roleInfo?.color || 'bg-gray-100 text-gray-700'}>
        {roleInfo?.label || rol}
      </Badge>
    );
  };

  const handleCreateUser = async (userData: Omit<User, 'usuario_id' | 'created_at' | 'updated_at'>) => {
    try {
      // Asegurar que los campos requeridos estén presentes
      const userToCreate = {
        usuario_id: crypto.randomUUID(), // En producción, esto vendría de Auth
        nombre: userData.nombre || 'Sin nombre',
        apellido: userData.apellido || 'Sin apellido',
        email: userData.email,
        rol: userData.rol,
        salmonera_id: userData.salmonera_id,
        servicio_id: userData.servicio_id
      };

      const { data, error } = await supabase
        .from('usuario')
        .insert([userToCreate])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Usuario Creado",
        description: "El usuario ha sido creado exitosamente"
      });

      fetchUsers();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el usuario",
        variant: "destructive"
      });
    }
  };

  const handleUpdateUser = async (userId: string, userData: Partial<User>) => {
    try {
      const { error } = await supabase
        .from('usuario')
        .update(userData)
        .eq('usuario_id', userId);

      if (error) throw error;

      toast({
        title: "Usuario Actualizado",
        description: "Los datos del usuario han sido actualizados"
      });

      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este usuario?')) return;

    try {
      const { error } = await supabase
        .from('usuario')
        .delete()
        .eq('usuario_id', userId);

      if (error) throw error;

      toast({
        title: "Usuario Eliminado",
        description: "El usuario ha sido eliminado del sistema"
      });

      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header y Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Gestión de Usuarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Nuevo Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                </DialogHeader>
                <UserForm
                  onSubmit={handleCreateUser}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Usuarios */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Cargando usuarios...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Organización</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.usuario_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserCheck className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{user.nombre} {user.apellido}</div>
                          <div className="text-xs text-gray-500">ID: {user.usuario_id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{user.email || 'Sin email'}</TableCell>
                    <TableCell>
                      {getRoleBadge(user.rol)}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {user.salmonera_id ? 'Salmonera' : user.servicio_id ? 'Servicio' : 'Sin asignar'}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(user.created_at).toLocaleDateString('es-CL')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingUser(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.usuario_id)}
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

      {/* Dialog de Edición */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <UserForm
              initialData={editingUser}
              onSubmit={(data) => handleUpdateUser(editingUser.usuario_id, data)}
              onCancel={() => setEditingUser(null)}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {roles.map(role => {
          const count = users.filter(u => u.rol === role.value).length;
          return (
            <Card key={role.value}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">{role.label}</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// Componente de formulario para crear/editar usuarios
interface UserFormProps {
  initialData?: Partial<User>;
  onSubmit: (data: Omit<User, 'usuario_id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    apellido: initialData?.apellido || '',
    email: initialData?.email || '',
    rol: (initialData?.rol || 'buzo') as 'superuser' | 'admin_salmonera' | 'admin_servicio' | 'supervisor' | 'buzo',
    salmonera_id: initialData?.salmonera_id || null,
    servicio_id: initialData?.servicio_id || null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="apellido">Apellido</Label>
        <Input
          id="apellido"
          value={formData.apellido}
          onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={isEditing}
        />
      </div>

      <div>
        <Label htmlFor="rol">Rol</Label>
        <Select value={formData.rol} onValueChange={(value) => setFormData({ ...formData, rol: value as any })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="superuser">Super Usuario</SelectItem>
            <SelectItem value="admin_salmonera">Admin Salmonera</SelectItem>
            <SelectItem value="admin_servicio">Admin Servicio</SelectItem>
            <SelectItem value="supervisor">Supervisor</SelectItem>
            <SelectItem value="buzo">Buzo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {isEditing ? 'Actualizar' : 'Crear'} Usuario
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};
