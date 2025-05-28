
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, UserPlus, Edit, MapPin, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { OperacionTeamManagerEnhanced } from "@/components/operaciones/OperacionTeamManagerEnhanced";
import { PersonnelManager } from "@/components/shared/PersonnelManager";

interface OperacionTeamTabProps {
  operacionId: string;
  operacion?: any;
}

export const OperacionTeamTab = ({ operacionId, operacion }: OperacionTeamTabProps) => {
  const [showTeamManager, setShowTeamManager] = useState(false);
  const [showPersonnelManager, setShowPersonnelManager] = useState(false);
  const { equipos } = useEquiposBuceoEnhanced();

  // Obtener equipo asignado
  const equipoAsignado = operacion?.equipo_buceo_id 
    ? equipos.find(eq => eq.id === operacion.equipo_buceo_id)
    : null;

  const handleAddMember = (member: any) => {
    // Lógica para agregar miembro al equipo
    console.log('Adding member to team:', member);
  };

  const handleRemoveMember = (memberId: string) => {
    // Lógica para remover miembro del equipo
    console.log('Removing member from team:', memberId);
  };

  const handleInviteUser = (inviteData: any) => {
    // Lógica para invitar usuario
    console.log('Inviting user:', inviteData);
  };

  return (
    <div className="space-y-6">
      {/* Información sutil de la Operación */}
      {operacion && (
        <div className="bg-blue-50/50 border border-blue-200/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-blue-700 font-medium">Operación:</span>
            <span className="text-blue-800">{operacion.codigo}</span>
            <span className="text-blue-600">•</span>
            <span className="text-blue-700">{operacion.salmoneras?.nombre}</span>
            <Badge variant="outline" className="bg-blue-100/50 text-blue-700 border-blue-200">
              {operacion.estado}
            </Badge>
          </div>
        </div>
      )}

      {/* Equipo de Buceo Asignado */}
      <Card className="bg-white shadow-sm rounded-xl border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Users className="w-5 h-5 text-blue-600" />
              Equipo de Buceo Asignado
            </CardTitle>
            <Button
              onClick={() => setShowTeamManager(true)}
              variant="outline"
              className="flex items-center gap-2 border-gray-200 hover:bg-gray-50"
            >
              <Edit className="w-4 h-4" />
              {equipoAsignado ? 'Cambiar Equipo' : 'Asignar Equipo'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {equipoAsignado ? (
            <div className="space-y-4">
              <div className="p-4 border border-green-200 rounded-xl bg-green-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-green-800">{equipoAsignado.nombre}</h3>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Equipo Asignado
                  </Badge>
                </div>
                {equipoAsignado.descripcion && (
                  <p className="text-sm text-green-700 mb-3">{equipoAsignado.descripcion}</p>
                )}
                
                {/* Miembros del equipo */}
                {equipoAsignado.miembros && equipoAsignado.miembros.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-green-800">
                        Miembros del Equipo ({equipoAsignado.miembros.length})
                      </h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowPersonnelManager(true)}
                        className="text-green-700 border-green-300 hover:bg-green-100"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Gestionar Miembros
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {equipoAsignado.miembros.map((miembro, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-medium text-sm">
                                {miembro.nombre_completo.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-green-800">{miembro.nombre_completo}</p>
                              <p className="text-xs text-green-600">{miembro.rol}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {miembro.disponible ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            )}
                            <span className="text-xs text-green-600">
                              {miembro.disponible ? 'Disponible' : 'No Disponible'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-yellow-800">
                        Este equipo no tiene miembros asignados. Es necesario agregar miembros para poder crear documentos de operación.
                      </AlertDescription>
                    </Alert>
                    <div className="mt-4">
                      <Button
                        onClick={() => setShowPersonnelManager(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Agregar Miembros al Equipo
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Alert className="border-red-200 bg-red-50 mb-6">
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  <strong>Sin equipo asignado:</strong> Debe asignar un equipo de buceo a esta operación antes de crear documentos (HPT, Anexo Bravo) o inmersiones.
                </AlertDescription>
              </Alert>
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No hay equipo de buceo asignado</p>
              <p className="text-sm text-gray-400 mb-6">Asigne un equipo de buceo para esta operación</p>
              <Button 
                onClick={() => setShowTeamManager(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Asignar Equipo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para gestión de equipo */}
      <Dialog open={showTeamManager} onOpenChange={setShowTeamManager}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Gestionar Equipo de Buceo</DialogTitle>
          </DialogHeader>
          <OperacionTeamManagerEnhanced
            operacionId={operacionId}
            salmoneraId={operacion?.salmonera_id}
            contratistaId={operacion?.contratista_id}
            onClose={() => setShowTeamManager(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog para gestión de personal usando PersonnelManager generalizado */}
      <Dialog open={showPersonnelManager} onOpenChange={setShowPersonnelManager}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Gestionar Miembros del Equipo</DialogTitle>
          </DialogHeader>
          <PersonnelManager
            title="Miembros del Equipo de Buceo"
            description="Busque personal existente por email o invite nuevos usuarios. Escriba el email completo para invitar a alguien nuevo."
            currentMembers={equipoAsignado?.miembros || []}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
            onInviteUser={handleInviteUser}
            memberRoleField="rol"
            searchPlaceholder="Escriba el email completo del usuario..."
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
