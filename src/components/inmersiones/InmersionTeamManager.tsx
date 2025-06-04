
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, UserPlus, Edit, Trash2, AlertTriangle } from "lucide-react";
import { UserSearchSelect } from "@/components/usuarios/UserSearchSelect";

interface TeamMember {
  id: string;
  usuario_id: string;
  nombre: string;
  apellido: string;
  rol: 'supervisor' | 'buzo_principal' | 'buzo_asistente' | 'buzo_emergencia';
  email: string;
  es_emergencia?: boolean;
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
  const [selectedRole, setSelectedRole] = useState<'supervisor' | 'buzo_principal' | 'buzo_asistente' | 'buzo_emergencia'>('buzo_principal');

  const handleSelectUser = (user: any) => {
    onAddMember({
      usuario_id: user.usuario_id,
      nombre: user.nombre,
      apellido: user.apellido,
      rol: selectedRole,
      email: user.email,
      es_emergencia: selectedRole === 'buzo_emergencia'
    });
    setIsAddDialogOpen(false);
  };

  const handleInviteUser = (userData: any) => {
    onInviteUser({
      ...userData,
      rol: selectedRole,
      es_emergencia: selectedRole === 'buzo_emergencia'
    });
    setIsAddDialogOpen(false);
  };

  const getRoleBadgeColor = (rol: string, esEmergencia?: boolean) => {
    if (esEmergencia || rol === 'buzo_emergencia') {
      return 'bg-orange-100 text-orange-700 border-orange-300';
    }
    
    const colors: Record<string, string> = {
      supervisor: 'bg-purple-100 text-purple-700',
      buzo_principal: 'bg-blue-100 text-blue-700',
      buzo_asistente: 'bg-teal-100 text-teal-700',
    };
    return colors[rol] || 'bg-gray-100 text-gray-700';
  };

  const getRoleLabel = (rol: string, esEmergencia?: boolean) => {
    if (esEmergencia || rol === 'buzo_emergencia') {
      return 'Buzo Emergencia';
    }
    
    const labels: Record<string, string> = {
      supervisor: 'Supervisor',
      buzo_principal: 'Buzo Principal',
      buzo_asistente: 'Buzo Asistente',
    };
    return labels[rol] || rol;
  };

  const emergencyDivers = team.filter(member => member.es_emergencia || member.rol === 'buzo_emergencia');
  const activeDivers = team.filter(member => !member.es_emergencia && member.rol !== 'buzo_emergencia');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Equipo de Inmersión
            <Badge variant="outline" className="ml-2">
              {activeDivers.length} activos
            </Badge>
            {emergencyDivers.length > 0 && (
              <Badge variant="outline" className="bg-orange-100 text-orange-700">
                {emergencyDivers.length} emergencia
              </Badge>
            )}
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
                    <option value="buzo_emergencia">Buzo de Emergencia</option>
                  </select>
                  {selectedRole === 'buzo_emergencia' && (
                    <Alert className="mt-2 border-orange-200 bg-orange-50">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <AlertDescription className="text-orange-800 text-xs">
                        El buzo de emergencia no realiza inmersión efectiva y no generará bitácora individual.
                      </AlertDescription>
                    </Alert>
                  )}
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
          <div className="space-y-4">
            {/* Active Team Members */}
            {activeDivers.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-3">Equipo Activo</h4>
                <div className="space-y-3">
                  {activeDivers.map((member) => (
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
                        <Badge variant="outline" className={getRoleBadgeColor(member.rol, member.es_emergencia)}>
                          {getRoleLabel(member.rol, member.es_emergencia)}
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
              </div>
            )}

            {/* Emergency Team Members */}
            {emergencyDivers.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-orange-700 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Buzos de Emergencia
                </h4>
                <div className="space-y-3">
                  {emergencyDivers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 border border-orange-200 bg-orange-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-medium">{member.nombre} {member.apellido}</div>
                          <div className="text-sm text-orange-600">{member.email}</div>
                          <div className="text-xs text-orange-700">No realiza inmersión - Solo registro</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getRoleBadgeColor(member.rol, member.es_emergencia)}>
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {getRoleLabel(member.rol, member.es_emergencia)}
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
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
