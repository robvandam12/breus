
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, UserPlus, Edit, Building, MapPin, Shield, CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { OperacionTeamManagerEnhanced } from "@/components/operaciones/OperacionTeamManagerEnhanced";
import { PersonalManager } from "@/components/shared/PersonalManager";

interface OperacionTeamTabProps {
  operacionId: string;
  operacion?: any;
}

export const OperacionTeamTab = ({ operacionId, operacion }: OperacionTeamTabProps) => {
  const [showTeamManager, setShowTeamManager] = useState(false);
  const [showOperacionInfo, setShowOperacionInfo] = useState(false);
  const { equipos, addMiembro, removeMiembro, updateMiembroRole } = useEquiposBuceoEnhanced();

  // Obtener equipo asignado
  const equipoAsignado = operacion?.equipo_buceo_id 
    ? equipos.find(eq => eq.id === operacion.equipo_buceo_id)
    : null;

  const handleAddMember = async (memberData: any) => {
    if (!equipoAsignado) return;
    
    await addMiembro({
      equipo_id: equipoAsignado.id,
      usuario_id: memberData.usuario_id,
      rol_equipo: memberData.rol_equipo,
      nombre_completo: memberData.nombre_completo,
      email: memberData.email,
      invitado: memberData.invitado || false
    });
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!equipoAsignado) return;
    
    await removeMiembro({
      miembro_id: memberId,
      equipo_id: equipoAsignado.id
    });
  };

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    if (!equipoAsignado) return;
    
    await updateMiembroRole({
      miembro_id: memberId,
      nuevo_rol: newRole,
      equipo_id: equipoAsignado.id
    });
  };

  return (
    <div className="space-y-6">
      {/* Información de la Operación - Sutil y Colapsible */}
      {operacion && (
        <Card className="border-blue-100 bg-blue-25">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                <CardTitle className="text-base text-blue-800">
                  {operacion.codigo} - {operacion.nombre}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOperacionInfo(!showOperacionInfo)}
                className="text-blue-600 hover:text-blue-700 p-1"
              >
                {showOperacionInfo ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {showOperacionInfo && (
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs font-medium text-blue-600">Estado</p>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                    {operacion.estado}
                  </Badge>
                </div>
                {operacion.salmoneras && (
                  <div>
                    <p className="text-xs font-medium text-blue-600">Salmonera</p>
                    <p className="text-blue-800 text-sm">{operacion.salmoneras.nombre}</p>
                  </div>
                )}
                {operacion.sitios && (
                  <div>
                    <p className="text-xs font-medium text-blue-600">Sitio</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-500" />
                      <p className="text-blue-800 text-sm">{operacion.sitios.nombre}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Personal de Buceo Asignado */}
      <Card className="ios-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Personal de Buceo Asignado
            </CardTitle>
            <Button
              onClick={() => setShowTeamManager(true)}
              variant="outline"
              className="ios-button flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              {equipoAsignado ? 'Cambiar Personal' : 'Asignar Personal'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {equipoAsignado ? (
            <div className="space-y-4">
              <div className="p-3 border rounded-lg bg-green-25 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-green-800">{equipoAsignado.nombre}</h3>
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Personal Asignado
                  </Badge>
                </div>
                {equipoAsignado.descripcion && (
                  <p className="text-sm text-green-700 mb-3">{equipoAsignado.descripcion}</p>
                )}
              </div>
              
              {/* Gestión de Miembros del Personal */}
              {equipoAsignado.miembros && equipoAsignado.miembros.length > 0 ? (
                <PersonalManager
                  title="Miembros del Personal"
                  description="Gestione los miembros asignados a este personal de buceo"
                  personal={equipoAsignado.miembros}
                  onAddMember={handleAddMember}
                  onRemoveMember={handleRemoveMember}
                  onUpdateRole={handleUpdateRole}
                  allowedRoles={['supervisor', 'buzo_principal', 'buzo_asistente']}
                  emptyStateMessage="Este personal no tiene miembros asignados"
                  addButtonText="Agregar Miembro al Personal"
                />
              ) : (
                <div className="border rounded-lg p-6">
                  <Alert className="border-yellow-200 bg-yellow-50 mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-yellow-800">
                      <strong>Sin miembros asignados:</strong> Este personal no tiene miembros. Agregue miembros para poder crear documentos de operación (HPT, Anexo Bravo) o inmersiones.
                    </AlertDescription>
                  </Alert>
                  
                  <PersonalManager
                    title="Agregar Miembros al Personal"
                    description="Este personal necesita miembros para funcionar"
                    personal={[]}
                    onAddMember={handleAddMember}
                    onRemoveMember={handleRemoveMember}
                    onUpdateRole={handleUpdateRole}
                    allowedRoles={['supervisor', 'buzo_principal', 'buzo_asistente']}
                    emptyStateMessage="Este personal no tiene miembros asignados"
                    addButtonText="Agregar Primer Miembro"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Alert className="border-red-200 bg-red-50 mb-4">
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  <strong>Sin personal asignado:</strong> Debe asignar personal de buceo a esta operación antes de crear documentos (HPT, Anexo Bravo) o inmersiones.
                </AlertDescription>
              </Alert>
              <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <p className="text-zinc-500 mb-2">No hay personal de buceo asignado</p>
              <p className="text-sm text-zinc-400">Asigne personal de buceo para esta operación</p>
              <Button 
                onClick={() => setShowTeamManager(true)}
                className="ios-button mt-4 bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Asignar Personal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para gestión de personal */}
      <Dialog open={showTeamManager} onOpenChange={setShowTeamManager}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Gestionar Personal de Buceo</DialogTitle>
          </DialogHeader>
          <OperacionTeamManagerEnhanced
            operacionId={operacionId}
            salmoneraId={operacion?.salmonera_id}
            contratistaId={operacion?.contratista_id}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
