
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Edit, Trash2, UserPlus } from "lucide-react";
import { useEquipoBuceo } from "@/hooks/useEquipoBuceo";
import { useOperaciones } from "@/hooks/useOperaciones";
import { UserSearchSelect } from "@/components/usuarios/UserSearchSelect";
import { CreateEquipoFormWizard } from "@/components/equipos/CreateEquipoFormWizard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";

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
  const [isCreateEquipoOpen, setIsCreateEquipoOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [selectedEquipo, setSelectedEquipo] = useState<any>(null);
  
  const { equipos, isLoading, createEquipo } = useEquipoBuceo();
  const { operaciones, assignEquipoToOperacion } = useOperaciones();
  const { toast } = useToast();
  
  // Obtener la operación actual
  const operacion = operaciones.find(op => op.id === operacionId);
  
  // Obtener equipos asignados a esta operación
  const equiposAsignados = equipos.filter(equipo => 
    operacion?.equipo_buceo_ids?.includes(equipo.id)
  );

  const handleCreateEquipo = async (data: any) => {
    try {
      const newEquipo = await createEquipo(data);
      // Asignar automáticamente el equipo a la operación
      if (newEquipo && newEquipo.id) {
        await assignEquipoToOperacion(operacionId, newEquipo.id);
        toast({
          title: "Equipo creado y asignado",
          description: "El equipo ha sido creado y asignado a la operación.",
        });
      }
      setIsCreateEquipoOpen(false);
    } catch (error) {
      console.error('Error creating equipo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el equipo.",
        variant: "destructive",
      });
    }
  };

  const handleAddMember = async (user: any) => {
    if (!selectedEquipo) return;
    
    try {
      // TODO: Implementar agregar miembro al equipo
      toast({
        title: "Miembro agregado",
        description: "El miembro ha sido agregado al equipo.",
      });
      setIsAddMemberOpen(false);
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el miembro.",
        variant: "destructive",
      });
    }
  };

  const handleInviteMember = async (data: any) => {
    if (!selectedEquipo) return;
    
    try {
      // TODO: Implementar invitar miembro
      toast({
        title: "Invitación enviada",
        description: "Se ha enviado la invitación al usuario.",
      });
      setIsAddMemberOpen(false);
    } catch (error) {
      console.error('Error inviting member:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la invitación.",
        variant: "destructive",
      });
    }
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

  if (isLoading) {
    return <LoadingSpinner text="Cargando equipos de buceo..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold">Equipos de Buceo Asignados</h2>
            <p className="text-zinc-500">
              {equiposAsignados.length > 0 
                ? `${equiposAsignados.length} equipo(s) asignado(s) a esta operación`
                : "No hay equipos asignados a esta operación"
              }
            </p>
          </div>
        </div>
        
        <Dialog open={isCreateEquipoOpen} onOpenChange={setIsCreateEquipoOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Crear y Asignar Equipo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <CreateEquipoFormWizard
              onSubmit={handleCreateEquipo}
              onCancel={() => setIsCreateEquipoOpen(false)}
              salmoneraId={salmoneraId}
            />
          </DialogContent>
        </Dialog>
      </div>

      {equiposAsignados.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">
              No hay equipos asignados
            </h3>
            <p className="text-zinc-500 mb-4">
              Crea un nuevo equipo para esta operación o asigna uno existente
            </p>
            <Button 
              onClick={() => setIsCreateEquipoOpen(true)} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Equipo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {equiposAsignados.map((equipo) => (
            <Card key={equipo.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    {equipo.nombre}
                    <Badge variant="outline">
                      {equipo.miembros?.length || 0} miembros
                    </Badge>
                  </CardTitle>
                  
                  <div className="flex gap-2">
                    <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedEquipo(equipo)}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Agregar Miembro
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Agregar Miembro al Equipo</DialogTitle>
                        </DialogHeader>
                        <UserSearchSelect
                          onSelectUser={handleAddMember}
                          onInviteUser={handleInviteMember}
                          allowedRoles={['supervisor', 'buzo']}
                          placeholder="Buscar usuario para agregar al equipo..."
                        />
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {equipo.descripcion && (
                  <p className="text-sm text-zinc-600">{equipo.descripcion}</p>
                )}
              </CardHeader>
              
              <CardContent>
                {equipo.miembros && equipo.miembros.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Miembro</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {equipo.miembros.map((miembro: any) => (
                        <TableRow key={miembro.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">{miembro.nombre_completo}</div>
                                {miembro.matricula && (
                                  <div className="text-sm text-zinc-500">Matrícula: {miembro.matricula}</div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getRoleBadgeColor(miembro.rol_equipo)}>
                              {getRoleLabel(miembro.rol_equipo)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-100 text-green-700">
                              Activo
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {miembro.email && (
                              <div className="text-sm text-zinc-600">{miembro.email}</div>
                            )}
                            {miembro.telefono && (
                              <div className="text-sm text-zinc-600">{miembro.telefono}</div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-zinc-500">
                    No hay miembros en este equipo
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
