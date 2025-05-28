
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Edit, User } from "lucide-react";
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
  
  const { operaciones, assignEquipoToOperacion } = useOperaciones();
  const { equipos, createEquipo } = useEquipoBuceo();

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

  const equiposDisponibles = equipos.filter(equipo => 
    equipo.empresa_id === salmoneraId || equipo.empresa_id === contratistaId
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Equipo de Buceo Asignado
          </CardTitle>
          {!equipoAsignado && (
            <Button onClick={() => setShowCreateTeam(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Crear Equipo
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {equipoAsignado ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{equipoAsignado.nombre}</h3>
                  <p className="text-sm text-zinc-500">{equipoAsignado.descripcion}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {equipoAsignado.miembros?.length || 0} miembros
                </Badge>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>

            {/* Mostrar miembros del equipo */}
            {equipoAsignado.miembros && equipoAsignado.miembros.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Miembros del Equipo</h4>
                <div className="space-y-2">
                  {equipoAsignado.miembros.map((miembro) => (
                    <div key={miembro.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-600" />
                        <div>
                          <p className="font-medium">{miembro.nombre_completo}</p>
                          <p className="text-sm text-gray-500">{miembro.email}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline"
                        className={
                          miembro.rol_equipo === 'supervisor' ? 'border-purple-300 text-purple-700' :
                          miembro.rol_equipo === 'buzo_principal' ? 'border-blue-300 text-blue-700' :
                          'border-teal-300 text-teal-700'
                        }
                      >
                        {miembro.rol_equipo === 'supervisor' ? 'Supervisor' :
                         miembro.rol_equipo === 'buzo_principal' ? 'Buzo Principal' :
                         'Buzo Asistente'}
                      </Badge>
                    </div>
                  ))}
                </div>
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
              <div className="space-y-2">
                <p className="text-sm text-zinc-600 mb-3">Equipos disponibles:</p>
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
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
