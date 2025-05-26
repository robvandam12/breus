
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, UserPlus, Edit, Trash2, Mail } from 'lucide-react';
import { CreateUserInviteForm } from '@/components/usuarios/CreateUserInviteForm';

// Simplified User interface for company management
export interface User {
  id: string;
  usuario_id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  estado: 'activo' | 'inactivo';
  created_at: string;
}

interface UserManagementProps {
  empresaType: 'salmonera' | 'servicio';
  empresaId: string;
  users: User[];
  onCreateUser: (userData: any) => Promise<void>;
  onUpdateUser: (id: string, userData: any) => Promise<void>;
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
  const [showInviteForm, setShowInviteForm] = useState(false);

  const getRoleBadgeColor = (rol: string) => {
    const colors: Record<string, string> = {
      admin_salmonera: 'bg-blue-100 text-blue-700',
      admin_servicio: 'bg-purple-100 text-purple-700',
      supervisor: 'bg-green-100 text-green-700',
      buzo: 'bg-orange-100 text-orange-700',
    };
    return colors[rol] || 'bg-gray-100 text-gray-700';
  };

  const handleInviteUser = async (data: {
    email: string;
    nombre: string;
    apellido: string;
    rol: string;
  }) => {
    await onCreateUser({
      ...data,
      empresa_id: empresaId,
      tipo_empresa: empresaType === 'servicio' ? 'contratista' : 'salmonera'
    });
    setShowInviteForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Personal de la Empresa</h3>
          <p className="text-sm text-zinc-500">
            Gestiona los usuarios que pertenecen a esta empresa
          </p>
        </div>
        <Button 
          onClick={() => setShowInviteForm(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Invitar Usuario
        </Button>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <User className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="font-medium text-zinc-900 mb-2">No hay personal asignado</h3>
            <p className="text-zinc-500 mb-4">
              Invite usuarios para que puedan acceder al sistema
            </p>
            <Button onClick={() => setShowInviteForm(true)} variant="outline">
              <UserPlus className="w-4 h-4 mr-2" />
              Invitar Primer Usuario
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
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
                    <div className="font-medium">{user.nombre} {user.apellido}</div>
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRoleBadgeColor(user.rol)}>
                      {user.rol.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.estado === 'activo' ? 'default' : 'secondary'}>
                      {user.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
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
        </Card>
      )}

      {/* Dialog para invitar usuarios */}
      <Dialog open={showInviteForm} onOpenChange={setShowInviteForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Invitar Usuario
            </DialogTitle>
          </DialogHeader>
          <CreateUserInviteForm
            onSubmit={handleInviteUser}
            onCancel={() => setShowInviteForm(false)}
            empresaType={empresaType === 'servicio' ? 'contratista' : 'salmonera'}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
