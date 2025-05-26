
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, UserPlus, Edit, Trash2 } from "lucide-react";
import { UserSearchSelect } from "@/components/usuarios/UserSearchSelect";

interface TeamMember {
  id: string;
  usuario_id: string;
  nombre: string;
  apellido: string;
  rol: 'supervisor' | 'buzo_principal' | 'buzo_asistente';
  email: string;
}

interface InmersionTeamManagerProps {
  inmersionId: string;
  team: TeamMember[];
  onAddMember: (member: Omit<TeamMember, 'id'>) => void;
  onRemoveMember: (memberId: string) => void;
  onInviteUser: (userData: any) => void;
}

export const InmersionTeamManager = ({
  inmersionId,
  team,
  onAddMember,
  onRemoveMember,
  onInviteUser
}: InmersionTeamManagerProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'supervisor' | 'buzo_principal' | 'buzo_asistente'>('buzo_principal');

  const handleSelectUser = (user: any) => {
    onAddMember({
      usuario_id: user.usuario_id,
      nombre: user.nombre,
      apellido: user.apellido,
      rol: selectedRole,
      email: user.email
    });
    setIsAddDialogOpen(false);
  };

  const handleInviteUser = (userData: any) => {
    onInviteUser({
      ...userData,
      rol: selectedRole
    });
    setIsAddDialogOpen(false);
  };

  const getRoleBadgeColor = (rol: string) => {
    const colors: Record<string, string> = {
      supervisor: 'bg-purple-100 text-purple-700',
      buzo_principal: 'bg-blue-100 text-blue-700',
      buzo_asistente: 'bg-teal-100 text-teal-700',
    };
    return colors[rol] || 'bg-gray-100 text-gray-700';
  };

  const getRoleLabel = (rol: string) => {
    const labels: Record<string, string> = {
      supervisor: 'Supervisor',
      buzo_principal: 'Buzo Principal',
      buzo_asistente: 'Buzo Asistente',
    };
    return labels[rol] || rol;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Equipo de Inmersión
            <Badge variant="outline" className="ml-2">
              {team.length} miembros
            </Badge>
          </CardTitle>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Agregar Miembro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Agregar Miembro al Equipo</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rol en la Inmersión</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as any)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="supervisor">Supervisor</option>
                    <option value="buzo_principal">Buzo Principal</option>
                    <option value="buzo_asistente">Buzo Asistente</option>
                  </select>
                </div>

                <UserSearchSelect
                  onSelectUser={handleSelectUser}
                  onInviteUser={handleInviteUser}
                  allowedRoles={selectedRole === 'supervisor' ? ['supervisor'] : ['buzo']}
                  placeholder="Buscar usuario para agregar al equipo..."
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {team.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay miembros asignados</h3>
            <p className="text-zinc-500 mb-4">Agregue miembros al equipo de esta inmersión</p>
            <Button onClick={() => setIsAddDialogOpen(true)} variant="outline">
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar Primer Miembro
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {team.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{member.nombre} {member.apellido}</div>
                    <div className="text-sm text-zinc-500">{member.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getRoleBadgeColor(member.rol)}>
                    {getRoleLabel(member.rol)}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveMember(member.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
