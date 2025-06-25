
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus } from "lucide-react";
import { UserByCompany } from "@/hooks/useUsersByCompany";

interface UsersListProps {
  usuarios: UserByCompany[];
  onInviteUser: () => void;
}

export const UsersList = ({ usuarios, onInviteUser }: UsersListProps) => {
  const getRoleBadgeColor = (rol: string) => {
    switch (rol) {
      case 'admin_salmonera':
        return 'bg-blue-100 text-blue-800';
      case 'admin_servicio':
        return 'bg-green-100 text-green-800';
      case 'supervisor':
        return 'bg-yellow-100 text-yellow-800';
      case 'buzo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (rol: string) => {
    switch (rol) {
      case 'admin_salmonera':
        return 'Admin Salmonera';
      case 'admin_servicio':
        return 'Admin Servicio';
      case 'supervisor':
        return 'Supervisor';
      case 'buzo':
        return 'Buzo';
      default:
        return rol;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Usuarios</CardTitle>
        <CardDescription>
          Todos los usuarios asociados a tu empresa
        </CardDescription>
      </CardHeader>
      <CardContent>
        {usuarios.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay usuarios registrados
            </h3>
            <p className="text-gray-600 mb-4">
              Comienza invitando usuarios a tu empresa.
            </p>
            <Button 
              className="flex items-center gap-2 mx-auto"
              onClick={onInviteUser}
            >
              <UserPlus className="w-4 h-4" />
              Invitar Primer Usuario
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {usuarios.map((usuario) => (
              <div
                key={usuario.usuario_id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {usuario.nombre.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      {usuario.nombre} {usuario.apellido}
                    </h4>
                    <p className="text-sm text-gray-600">{usuario.email}</p>
                    {usuario.empresa_nombre && (
                      <p className="text-xs text-gray-500">
                        {usuario.empresa_nombre}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getRoleBadgeColor(usuario.rol)}>
                    {getRoleDisplayName(usuario.rol)}
                  </Badge>
                  <Badge variant={usuario.perfil_completado ? "default" : "secondary"}>
                    {usuario.perfil_completado ? "Activo" : "Pendiente"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
