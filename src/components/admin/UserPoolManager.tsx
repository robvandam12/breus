
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Mail, UserPlus, Search } from 'lucide-react';
import { useUserPool } from '@/hooks/useUserPool';
import { useAuth } from '@/hooks/useAuth';

export const UserPoolManager = () => {
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    nombre: '',
    apellido: '',
    rol: 'buzo' as 'supervisor' | 'buzo',
  });

  const {
    poolUsers,
    invitaciones,
    loadingPool,
    inviteNewUser,
    isInvitingNew,
  } = useUserPool(profile?.salmonera_id);

  const filteredUsers = poolUsers.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInviteUser = async () => {
    try {
      await inviteNewUser(inviteForm);
      setIsInviteDialogOpen(false);
      setInviteForm({ email: '', nombre: '', apellido: '', rol: 'buzo' });
    } catch (error) {
      console.error('Error inviting user:', error);
    }
  };

  const getRoleBadge = (rol: string) => {
    const colors = {
      supervisor: 'bg-blue-100 text-blue-800',
      buzo: 'bg-green-100 text-green-800',
    };
    return colors[rol as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold">Pool de Usuarios</h2>
            <p className="text-sm text-gray-500">Gestiona supervisores y buzos de tu salmonera</p>
          </div>
        </div>
        
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Invitar Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invitar Nuevo Usuario</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={inviteForm.nombre}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Nombre"
                  />
                </div>
                <div>
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    value={inviteForm.apellido}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, apellido: e.target.value }))}
                    placeholder="Apellido"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="usuario@ejemplo.com"
                />
              </div>
              
              <div>
                <Label htmlFor="rol">Rol</Label>
                <Select
                  value={inviteForm.rol}
                  onValueChange={(value) => setInviteForm(prev => ({ ...prev, rol: value as 'supervisor' | 'buzo' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="buzo">Buzo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleInviteUser} disabled={isInvitingNew}>
                  {isInvitingNew ? 'Enviando...' : 'Enviar Invitación'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">
              {poolUsers.filter(u => u.rol === 'supervisor').length}
            </div>
            <div className="text-sm text-gray-500">Supervisores</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              {poolUsers.filter(u => u.rol === 'buzo').length}
            </div>
            <div className="text-sm text-gray-500">Buzos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-yellow-600">
              {invitaciones.length}
            </div>
            <div className="text-sm text-gray-500">Invitaciones Pendientes</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios del Pool</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Ingreso</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.nombre} {user.apellido}</div>
                      {user.matricula && (
                        <div className="text-xs text-gray-500">Matrícula: {user.matricula}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadge(user.rol)}>
                      {user.rol === 'supervisor' ? 'Supervisor' : 'Buzo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={user.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {user.disponible ? 'Disponible' : 'No Disponible'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Ver Perfil
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invitaciones Pendientes */}
      {invitaciones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Invitaciones Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Fecha Invitación</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitaciones.map((invitacion) => (
                  <TableRow key={invitacion.id}>
                    <TableCell>{invitacion.nombre} {invitacion.apellido}</TableCell>
                    <TableCell>{invitacion.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadge(invitacion.rol)}>
                        {invitacion.rol === 'supervisor' ? 'Supervisor' : 'Buzo'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(invitacion.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Pendiente
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
