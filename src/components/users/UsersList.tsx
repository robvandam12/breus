
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserMinus, Users } from "lucide-react";

interface UsersListProps {
  usuarios: any[];
  onInviteUser: () => void;
  showRemoveAction?: boolean;
  onRemoveUser?: (user: any) => void;
}

export const UsersList = ({ 
  usuarios, 
  onInviteUser, 
  showRemoveAction = false, 
  onRemoveUser 
}: UsersListProps) => {
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

  const getEstadoBadge = (estado: boolean) => {
    return estado ? (
      <Badge className="bg-green-100 text-green-700">Activo</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-700">Pendiente</Badge>
    );
  };

  if (usuarios.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="font-medium text-zinc-900 mb-2">No hay usuarios</h3>
            <p className="text-zinc-500 mb-4">
              No tienes usuarios en tu empresa aún. Invita a tu primer usuario.
            </p>
            <Button onClick={onInviteUser}>
              Invitar Usuario
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Usuarios de la Empresa
          <Badge variant="outline" className="ml-2">
            {usuarios.length} usuarios
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              {showRemoveAction && <TableHead className="text-right">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((user) => (
              <TableRow key={user.usuario_id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{user.nombre} {user.apellido}</div>
                      <div className="text-xs text-zinc-500">ID: {user.usuario_id.slice(0, 8)}</div>
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
                  {getEstadoBadge(user.perfil_completado)}
                </TableCell>
                {showRemoveAction && (
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onRemoveUser?.(user)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
