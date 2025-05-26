
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Plus, UserCheck, AlertTriangle } from 'lucide-react';
import { useUserPool } from '@/hooks/useUserPool';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useAuth } from '@/hooks/useAuth';

export const GestionEquipos = () => {
  const { profile } = useAuth();
  const { poolUsers } = useUserPool(profile?.salmonera_id);
  const { operaciones } = useOperaciones();
  const { createTeam, isCreatingTeam } = useUserPool();

  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);
  const [selectedOperacion, setSelectedOperacion] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Array<{
    usuario_id: string;
    rol_equipo: 'supervisor' | 'buzo_principal' | 'buzo_asistente';
  }>>([]);

  const handleAddMember = (userId: string, rol: 'supervisor' | 'buzo_principal' | 'buzo_asistente') => {
    setSelectedMembers(prev => {
      const exists = prev.find(m => m.usuario_id === userId);
      if (exists) {
        return prev.map(m => m.usuario_id === userId ? { ...m, rol_equipo: rol } : m);
      } else {
        return [...prev, { usuario_id: userId, rol_equipo: rol }];
      }
    });
  };

  const handleRemoveMember = (userId: string) => {
    setSelectedMembers(prev => prev.filter(m => m.usuario_id !== userId));
  };

  const handleCreateTeam = async () => {
    if (!selectedOperacion || selectedMembers.length === 0) return;
    
    try {
      await createTeam({
        operacionId: selectedOperacion,
        miembros: selectedMembers
      });
      setIsCreateTeamDialogOpen(false);
      setSelectedOperacion('');
      setSelectedMembers([]);
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const validateTeam = () => {
    const hasSupervisor = selectedMembers.some(m => m.rol_equipo === 'supervisor');
    const hasBuzoPrincipal = selectedMembers.some(m => m.rol_equipo === 'buzo_principal');
    return hasSupervisor && hasBuzoPrincipal;
  };

  const getUserById = (userId: string) => {
    return poolUsers.find(u => u.id === userId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Gestión de Equipos</h2>
        </div>
        <Dialog open={isCreateTeamDialogOpen} onOpenChange={setIsCreateTeamDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Crear Equipo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Equipo de Buceo</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <Label htmlFor="operacion">Operación</Label>
                <Select value={selectedOperacion} onValueChange={setSelectedOperacion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar operación" />
                  </SelectTrigger>
                  <SelectContent>
                    {operaciones.map((op) => (
                      <SelectItem key={op.id} value={op.id}>
                        {op.nombre} ({op.codigo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pool de Usuarios Disponibles */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pool de Usuarios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Usuario</TableHead>
                          <TableHead>Rol</TableHead>
                          <TableHead>Acción</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {poolUsers.filter(user => user.disponible).map((user) => (
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
                              <Select onValueChange={(value: 'supervisor' | 'buzo_principal' | 'buzo_asistente') => handleAddMember(user.id, value)}>
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Agregar" />
                                </SelectTrigger>
                                <SelectContent>
                                  {user.rol === 'supervisor' && (
                                    <SelectItem value="supervisor">Supervisor</SelectItem>
                                  )}
                                  {user.rol === 'buzo' && (
                                    <>
                                      <SelectItem value="buzo_principal">Buzo Principal</SelectItem>
                                      <SelectItem value="buzo_asistente">Buzo Asistente</SelectItem>
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Equipo Seleccionado */}
                <Card>
                  <CardHeader>
                    <CardTitle>Equipo Seleccionado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedMembers.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No hay miembros seleccionados</p>
                      ) : (
                        <>
                          {selectedMembers.map((member) => {
                            const user = getUserById(member.usuario_id);
                            if (!user) return null;
                            
                            return (
                              <div key={member.usuario_id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <div className="font-medium">{user.nombre} {user.apellido}</div>
                                  <Badge variant="outline">
                                    {member.rol_equipo.replace('_', ' ')}
                                  </Badge>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveMember(member.usuario_id)}
                                >
                                  Remover
                                </Button>
                              </div>
                            );
                          })}
                          
                          {/* Validación del equipo */}
                          <div className="mt-4 p-3 rounded-lg bg-gray-50">
                            <div className="flex items-center gap-2">
                              {validateTeam() ? (
                                <UserCheck className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                              )}
                              <span className="font-medium">
                                {validateTeam() ? 'Equipo válido' : 'Equipo incompleto'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Se requiere al menos 1 supervisor y 1 buzo principal
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button 
                onClick={handleCreateTeam}
                disabled={isCreatingTeam || !selectedOperacion || !validateTeam()}
                className="w-full"
              >
                {isCreatingTeam ? 'Creando Equipo...' : 'Crear Equipo'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Equipos Existentes */}
      <Card>
        <CardHeader>
          <CardTitle>Equipos Activos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            Los equipos creados aparecerán aquí una vez implementada la funcionalidad completa
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
