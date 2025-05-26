
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, UserPlus, Mail, CheckCircle, Clock, X } from 'lucide-react';
import { useUserPool } from '@/hooks/useUserPool';
import { useAuth } from '@/hooks/useAuth';

interface PoolUsuariosProps {
  salmoneraId?: string;
}

export const PoolUsuarios = ({ salmoneraId }: PoolUsuariosProps) => {
  const { profile } = useAuth();
  const {
    poolUsers,
    invitaciones,
    loadingPool,
    loadingInvitaciones,
    inviteNewUser,
    isInvitingNew
  } = useUserPool(salmoneraId || profile?.salmonera_id);

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    nombre: '',
    apellido: '',
    rol: 'buzo' as 'supervisor' | 'buzo'
  });

  const handleInviteUser = async () => {
    try {
      await inviteNewUser(inviteForm);
      setIsInviteDialogOpen(false);
      setInviteForm({ email: '', nombre: '', apellido: '', rol: 'buzo' });
    } catch (error) {
      console.error('Error inviting user:', error);
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
      case 'aceptada':
        return <Badge variant="default" className="text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Activo</Badge>;
      case 'rechazada':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Rechazada</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  if (loadingPool) {
    return <div className="p-4">Cargando pool de usuarios...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Pool de Usuarios</h2>
        </div>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
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
                  />
                </div>
                <div>
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    value={inviteForm.apellido}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, apellido: e.target.value }))}
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
                />
              </div>
              <div>
                <Label htmlFor="rol">Rol</Label>
                <Select value={inviteForm.rol} onValueChange={(value: 'supervisor' | 'buzo') => setInviteForm(prev => ({ ...prev, rol: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="buzo">Buzo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleInviteUser} 
                disabled={isInvitingNew || !inviteForm.email || !inviteForm.nombre || !inviteForm.apellido}
                className="w-full"
              >
                {isInvitingNew ? 'Enviando...' : 'Enviar Invitación'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pool Activo */}
        <Card>
          <CardHeader>
            <CardTitle>Usuarios Activos ({poolUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {poolUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.nombre} {user.apellido}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.rol === 'supervisor' ? 'default' : 'secondary'}>
                        {user.rol}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.disponible ? 'default' : 'secondary'}>
                        {user.disponible ? 'Disponible' : 'No disponible'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Invitaciones Pendientes */}
        <Card>
          <CardHeader>
            <CardTitle>Invitaciones Pendientes ({invitaciones.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitaciones.map((invitacion) => (
                  <TableRow key={invitacion.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invitacion.nombre} {invitacion.apellido}</div>
                        <div className="text-sm text-gray-500">{invitacion.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={invitacion.rol === 'supervisor' ? 'default' : 'secondary'}>
                        {invitacion.rol}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(invitacion.estado)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
