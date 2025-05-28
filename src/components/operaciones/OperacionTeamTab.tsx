
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, UserPlus, Edit, Building, MapPin, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { OperacionTeamManagerEnhanced } from "@/components/operaciones/OperacionTeamManagerEnhanced";
import { PersonnelManager } from "@/components/shared/PersonnelManager";

interface OperacionTeamTabProps {
  operacionId: string;
  operacion?: any;
}

export const OperacionTeamTab = ({ operacionId, operacion }: OperacionTeamTabProps) => {
  const [showTeamManager, setShowTeamManager] = useState(false);
  const { equipos, addMemberToEquipo, removeMemberFromEquipo } = useEquiposBuceoEnhanced();

  // Obtener equipo asignado
  const equipoAsignado = operacion?.equipo_buceo_id 
    ? equipos.find(eq => eq.id === operacion.equipo_buceo_id)
    : null;

  const handleAddMember = async (memberData: any) => {
    if (!equipoAsignado) return;
    
    try {
      await addMemberToEquipo(equipoAsignado.id, memberData);
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!equipoAsignado) return;
    
    try {
      await removeMemberFromEquipo(equipoAsignado.id, memberId);
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const availableRoles = [
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'buzo_principal', label: 'Buzo Principal' },
    { value: 'buzo_asistente', label: 'Buzo Asistente' },
    { value: 'apoyo_superficie', label: 'Apoyo en Superficie' }
  ];

  return (
    <div className="space-y-6">
      {/* Información de la Operación - Más sutil */}
      {operacion && (
        <Card className="border border-blue-100 bg-blue-50/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-blue-900">{operacion.codigo}</span>
                  <span className="text-blue-600">•</span>
                  <span className="text-blue-800">{operacion.nombre}</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                    {operacion.estado}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-blue-600">
                  {operacion.salmoneras && <span>{operacion.salmoneras.nombre}</span>}
                  {operacion.sitios && (
                    <>
                      <span>•</span>
                      <span>{operacion.sitios.nombre}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Equipo de Buceo Asignado */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Equipo de Buceo Asignado
            </CardTitle>
            <Button
              onClick={() => setShowTeamManager(true)}
              variant="outline"
              className="flex items-center gap-2 border-gray-200"
            >
              <Edit className="w-4 h-4" />
              {equipoAsignado ? 'Cambiar Equipo' : 'Asignar Equipo'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {equipoAsignado ? (
            <div className="space-y-6">
              <div className="p-4 border rounded-lg bg-green-50/50 border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-green-800">{equipoAsignado.nombre}</h3>
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Equipo Asignado
                  </Badge>
                </div>
                {equipoAsignado.descripcion && (
                  <p className="text-sm text-green-700 mb-3">{equipoAsignado.descripcion}</p>
                )}
              </div>

              {/* Gestión de miembros usando el componente generalizado */}
              {equipoAsignado.miembros && equipoAsignado.miembros.length > 0 ? (
                <PersonnelManager
                  title={`Miembros del Equipo (${equipoAsignado.miembros.length})`}
                  description="Gestione los miembros asignados a este equipo de buceo"
                  currentMembers={equipoAsignado.miembros}
                  availableRoles={availableRoles}
                  onAddMember={handleAddMember}
                  onRemoveMember={handleRemoveMember}
                  showInviteOption={true}
                />
              ) : (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-yellow-800">
                    <strong>Equipo sin miembros:</strong> Este equipo no tiene miembros asignados. Agregue miembros para poder crear documentos de operación.
                  </AlertDescription>
                  <div className="mt-3">
                    <PersonnelManager
                      title="Agregar Miembros al Equipo"
                      description="Agregue miembros para poder proceder con los documentos"
                      currentMembers={[]}
                      availableRoles={availableRoles}
                      onAddMember={handleAddMember}
                      onRemoveMember={handleRemoveMember}
                      showInviteOption={true}
                      className="mt-4"
                    />
                  </div>
                </Alert>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Alert className="border-red-200 bg-red-50 mb-4">
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  <strong>Sin equipo asignado:</strong> Debe asignar un equipo de buceo a esta operación antes de crear documentos (HPT, Anexo Bravo) o inmersiones.
                </AlertDescription>
              </Alert>
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No hay equipo de buceo asignado</p>
              <p className="text-sm text-gray-400">Asigne un equipo de buceo para esta operación</p>
              <Button 
                onClick={() => setShowTeamManager(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
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
    </div>
  );
};
