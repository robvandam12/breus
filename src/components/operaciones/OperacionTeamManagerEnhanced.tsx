
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Edit, User, Trash2, UserPlus } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useEquipoBuceo } from "@/hooks/useEquipoBuceo";
import { CreateEquipoFormWizard } from "@/components/equipos/CreateEquipoFormWizard";
import { toast } from "@/hooks/use-toast";

interface OperacionTeamManagerEnhancedProps {
  operacionId: string;
  salmoneraId?: string;
  contratistaId?: string;
}

export const OperacionTeamManagerEnhanced = ({ 
  operacionId, 
  salmoneraId, 
  contratistaId 
}: OperacionTeamManagerEnhancedProps) => {
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showEditTeam, setShowEditTeam] = useState(false);
  
  const { operaciones, assignEquipoToOperacion } = useOperaciones();
  const { equipos, createEquipo, updateEquipo, deleteEquipo } = useEquipoBuceo();

  const operacion = operaciones.find(op => op.id === operacionId);
  
  // Obtener el equipo asignado a la operación
  const equipoAsignado = operacion?.equipo_buceo_id 
    ? equipos.find(equipo => equipo.id === operacion.equipo_buceo_id)
    : null;

  const handleAssignTeam = async (equipoId: string) => {
    try {
      await assignEquipoToOperacion({ operacionId, equipoId });
      toast({
        title: "Equipo asignado",
        description: "El equipo ha sido asignado a la operación exitosamente.",
      });
    } catch (error) {
      console.error('Error assigning team:', error);
      toast({
        title: "Error",
        description: "No se pudo asignar el equipo a la operación.",
        variant: "destructive",
      });
    }
  };

  const handleCreateTeam = async (teamData: any) => {
    try {
      const newTeam = await createEquipo(teamData);
      setShowCreateTeam(false);
      
      // Auto-asignar el equipo recién creado a la operación
      if (newTeam?.id) {
        await handleAssignTeam(newTeam.id);
      }
      
      toast({
        title: "Equipo creado y asignado",
        description: "El equipo ha sido creado y asignado a la operación exitosamente.",
      });
    } catch (error) {
      console.error('Error creating team:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el equipo.",
        variant: "destructive",
      });
    }
  };

  const handleEditTeam = async (teamData: any) => {
    try {
      if (equipoAsignado) {
        await updateEquipo({ id: equipoAsignado.id, data: teamData });
        setShowEditTeam(false);
        toast({
          title: "Equipo actualizado",
          description: "El equipo ha sido actualizado exitosamente.",
        });
      }
    } catch (error) {
      console.error('Error updating team:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el equipo.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveTeam = async () => {
    try {
      await assignEquipoToOperacion({ operacionId, equipoId: '' });
      toast({
        title: "Equipo removido",
        description: "El equipo ha sido removido de la operación.",
      });
    } catch (error) {
      console.error('Error removing team:', error);
      toast({
        title: "Error",
        description: "No se pudo remover el equipo.",
        variant: "destructive",
      });
    }
  };

  const equiposDisponibles = equipos.filter(equipo => 
    equipo.empresa_id === salmoneraId || equipo.empresa_id === contratistaId
  );

  const getRolBadgeColor = (rol: string) => {
    const colorMap: Record<string, string> = {
      supervisor: 'bg-purple-100 text-purple-700 border-purple-300',
      buzo_principal: 'bg-blue-100 text-blue-700 border-blue-300',
      buzo_asistente: 'bg-teal-100 text-teal-700 border-teal-300',
    };
    return colorMap[rol] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getRolLabel = (rol: string) => {
    const labelMap: Record<string, string> = {
      supervisor: 'Supervisor',
      buzo_principal: 'Buzo Principal',
      buzo_asistente: 'Buzo Asistente',
    };
    return labelMap[rol] || rol;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Equipo de Buceo Asignado
          </CardTitle>
          <div className="flex items-center gap-2">
            {equipoAsignado && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditTeam(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Equipo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveTeam}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remover
                </Button>
              </>
            )}
            {!equipoAsignado && (
              <Button onClick={() => setShowCreateTeam(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Crear Equipo
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {equipoAsignado ? (
          <div className="space-y-6">
            {/* Información del Equipo */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">{equipoAsignado.nombre}</h3>
                  <p className="text-sm text-blue-700">{equipoAsignado.descripcion}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {equipoAsignado.miembros?.length || 0} miembros
                </Badge>
                <Badge variant="outline" className="border-blue-300 text-blue-700">
                  {equipoAsignado.tipo_empresa === 'salmonera' ? 'Salmonera' : 'Contratista'}
                </Badge>
              </div>
            </div>

            {/* Tabla de Miembros */}
            {equipoAsignado.miembros && equipoAsignado.miembros.length > 0 ? (
              <div>
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Miembros del Equipo
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Miembro</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipoAsignado.miembros.map((miembro) => (
                      <TableRow key={miembro.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium">{miembro.nombre_completo}</p>
                              <p className="text-sm text-gray-500">{miembro.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={getRolBadgeColor(miembro.rol_equipo)}
                          >
                            {getRolLabel(miembro.rol_equipo)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {miembro.telefono && (
                            <div className="text-sm text-gray-600">{miembro.telefono}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          {miembro.matricula ? (
                            <span className="text-sm font-mono">{miembro.matricula}</span>
                          ) : (
                            <span className="text-sm text-gray-400">Sin matrícula</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Disponible
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-6">
                <User className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No hay miembros asignados a este equipo</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">
              No hay equipo asignado
            </h3>
            <p className="text-zinc-500 mb-4">
              Asigna un equipo de buceo a esta operación
            </p>
            
            {equiposDisponibles.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-zinc-600 mb-3">Equipos disponibles:</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {equiposDisponibles.map((equipo) => (
                    <div key={equipo.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{equipo.nombre}</p>
                        <p className="text-sm text-zinc-500">
                          {equipo.miembros?.length || 0} miembros
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAssignTeam(equipo.id)}
                      >
                        Asignar
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Button onClick={() => setShowCreateTeam(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Nuevo Equipo
              </Button>
            )}
          </div>
        )}

        {/* Modal para crear equipo */}
        <Dialog open={showCreateTeam} onOpenChange={setShowCreateTeam}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <CreateEquipoFormWizard
              onSubmit={handleCreateTeam}
              onCancel={() => setShowCreateTeam(false)}
              salmoneraId={salmoneraId}
              contratistaId={contratistaId}
            />
          </DialogContent>
        </Dialog>

        {/* Modal para editar equipo */}
        <Dialog open={showEditTeam} onOpenChange={setShowEditTeam}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {equipoAsignado && (
              <CreateEquipoFormWizard
                onSubmit={handleEditTeam}
                onCancel={() => setShowEditTeam(false)}
                salmoneraId={equipoAsignado.tipo_empresa === 'salmonera' ? equipoAsignado.empresa_id : undefined}
                contratistaId={equipoAsignado.tipo_empresa === 'contratista' ? equipoAsignado.empresa_id : undefined}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
