
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, X } from 'lucide-react';
import { useUserPool } from '@/hooks/useUserPool';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useAuth } from '@/hooks/useAuth';

interface TeamMemberSelection {
  usuario_id: string;
  rol_equipo: 'supervisor' | 'buzo_principal' | 'buzo_asistente';
  usuario?: any;
}

export const TeamBuilder = () => {
  const { profile } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOperacion, setSelectedOperacion] = useState<string>('');
  const [teamMembers, setTeamMembers] = useState<TeamMemberSelection[]>([]);

  const { poolUsers } = useUserPool(profile?.salmonera_id);
  const { operaciones } = useOperaciones();
  const { createTeam, isCreatingTeam } = useUserPool(profile?.salmonera_id);

  const availableUsers = poolUsers.filter(user => 
    !teamMembers.some(member => member.usuario_id === user.id)
  );

  const addTeamMember = (userId: string, role: 'supervisor' | 'buzo_principal' | 'buzo_asistente') => {
    const usuario = poolUsers.find(u => u.id === userId);
    if (usuario) {
      setTeamMembers(prev => [...prev, {
        usuario_id: userId,
        rol_equipo: role,
        usuario
      }]);
    }
  };

  const removeTeamMember = (userId: string) => {
    setTeamMembers(prev => prev.filter(member => member.usuario_id !== userId));
  };

  const handleCreateTeam = async () => {
    if (!selectedOperacion || teamMembers.length === 0) return;

    try {
      await createTeam({
        operacionId: selectedOperacion,
        miembros: teamMembers.map(member => ({
          usuario_id: member.usuario_id,
          rol_equipo: member.rol_equipo
        }))
      });
      
      setIsCreateDialogOpen(false);
      setSelectedOperacion('');
      setTeamMembers([]);
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const getRoleBadge = (rol: string) => {
    const colors = {
      supervisor: 'bg-blue-100 text-blue-800',
      buzo_principal: 'bg-green-100 text-green-800',
      buzo_asistente: 'bg-yellow-100 text-yellow-800',
    };
    return colors[rol as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (rol: string) => {
    const labels = {
      supervisor: 'Supervisor',
      buzo_principal: 'Buzo Principal',
      buzo_asistente: 'Buzo Asistente',
    };
    return labels[rol as keyof typeof labels] || rol;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-purple-600" />
          <div>
            <h2 className="text-xl font-semibold">Equipos de Buceo</h2>
            <p className="text-sm text-gray-500">Crea y gestiona equipos para las operaciones</p>
          </div>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Crear Equipo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Equipo de Buceo</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Seleccionar Operación */}
              <div>
                <label className="text-sm font-medium mb-2 block">Operación</label>
                <Select value={selectedOperacion} onValueChange={setSelectedOperacion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar operación..." />
                  </SelectTrigger>
                  <SelectContent>
                    {operaciones.map((op) => (
                      <SelectItem key={op.id} value={op.id}>
                        {op.codigo} - {op.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Miembros del Equipo */}
              <div>
                <label className="text-sm font-medium mb-2 block">Miembros del Equipo</label>
                
                {/* Lista de miembros seleccionados */}
                {teamMembers.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {teamMembers.map((member) => (
                      <div key={member.usuario_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium">
                              {member.usuario?.nombre} {member.usuario?.apellido}
                            </div>
                            <div className="text-sm text-gray-500">{member.usuario?.email}</div>
                          </div>
                          <Badge className={getRoleBadge(member.rol_equipo)}>
                            {getRoleLabel(member.rol_equipo)}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTeamMember(member.usuario_id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Agregar miembros */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Usuario</label>
                    <Select
                      onValueChange={(userId) => {
                        // Temporal: agregar como buzo, luego cambiar rol
                        if (userId && !teamMembers.find(m => m.usuario_id === userId)) {
                          addTeamMember(userId, 'buzo_principal');
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar usuario..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.nombre} {user.apellido} ({user.rol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Validación de equipo */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Composición del Equipo</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Supervisores:</span>
                    <span className="ml-1 font-medium">
                      {teamMembers.filter(m => m.rol_equipo === 'supervisor').length}
                    </span>
                  </div>
                  <div>
                    <span className="text-green-700">Buzo Principal:</span>
                    <span className="ml-1 font-medium">
                      {teamMembers.filter(m => m.rol_equipo === 'buzo_principal').length}
                    </span>
                  </div>
                  <div>
                    <span className="text-yellow-700">Buzo Asistente:</span>
                    <span className="ml-1 font-medium">
                      {teamMembers.filter(m => m.rol_equipo === 'buzo_asistente').length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateTeam} 
                  disabled={!selectedOperacion || teamMembers.length === 0 || isCreatingTeam}
                >
                  {isCreatingTeam ? 'Creando...' : 'Crear Equipo'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Equipos existentes */}
      <Card>
        <CardHeader>
          <CardTitle>Equipos Activos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No hay equipos creados aún</p>
            <p className="text-sm">Crea tu primer equipo de buceo</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
