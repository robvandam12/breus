
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, UserPlus, Trash2, AlertTriangle, Calendar } from "lucide-react";
import { useInmersionTeamManager } from "@/hooks/useInmersionTeamManager";
import { PersonalBuceoSelector } from "./PersonalBuceoSelector";
import { usePersonalConflictValidation } from "@/hooks/usePersonalConflictValidation";

interface InmersionTeamManagerEnhancedProps {
  inmersionId: string | null;
  onInviteUser?: (userData: any) => void;
  onTeamUpdate?: (teamMembers: any[]) => void;
  isCreatingNew?: boolean;
  targetDate?: string; // Nueva prop para la fecha objetivo
}

export const InmersionTeamManagerEnhanced = ({
  inmersionId,
  onInviteUser,
  onTeamUpdate,
  isCreatingNew = false,
  targetDate
}: InmersionTeamManagerEnhancedProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'supervisor' | 'buzo_principal' | 'buzo_asistente' | 'buzo_emergencia'>('buzo_principal');
  const [localTeamMembers, setLocalTeamMembers] = useState<any[]>([]);

  const { conflicts, checkUserConflict } = usePersonalConflictValidation(targetDate);

  const {
    teamMembers,
    isLoading,
    addTeamMember,
    removeTeamMember,
    isAddingMember,
    isRemovingMember
  } = useInmersionTeamManager(inmersionId || '');

  // Para inmersiones nuevas, usar estado local
  const currentTeamMembers = isCreatingNew ? localTeamMembers : teamMembers;

  // Notificar cambios al componente padre
  useEffect(() => {
    if (onTeamUpdate) {
      onTeamUpdate(currentTeamMembers);
    }
  }, [currentTeamMembers, onTeamUpdate]);

  const handleSelectUser = async (userData: any) => {
    const newMember = {
      id: `temp-${Date.now()}`,
      user_id: userData.usuario_id,
      role: selectedRole,
      is_emergency: selectedRole === 'buzo_emergencia',
      nombre: userData.nombre,
      apellido: userData.apellido,
      email: userData.email,
      isExisting: userData.isExisting || false
    };

    if (isCreatingNew) {
      // Para inmersiones nuevas, agregar al estado local
      setLocalTeamMembers(prev => [...prev, newMember]);
    } else {
      // Para inmersiones existentes, usar la función del hook
      try {
        await addTeamMember({
          user_id: userData.usuario_id,
          role: selectedRole,
          is_emergency: selectedRole === 'buzo_emergencia'
        });
      } catch (error) {
        console.error('Error adding team member:', error);
      }
    }
  };

  const handleInviteUser = (userData: any) => {
    if (onInviteUser) {
      onInviteUser({
        ...userData,
        role: selectedRole,
        is_emergency: selectedRole === 'buzo_emergencia'
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (isCreatingNew) {
      // Para inmersiones nuevas, remover del estado local
      setLocalTeamMembers(prev => prev.filter(member => member.id !== memberId));
    } else {
      // Para inmersiones existentes, usar la función del hook
      try {
        await removeTeamMember(memberId);
      } catch (error) {
        console.error('Error removing team member:', error);
      }
    }
  };

  const openAddDialog = (role: 'supervisor' | 'buzo_principal' | 'buzo_asistente' | 'buzo_emergencia') => {
    setSelectedRole(role);
    setIsAddDialogOpen(true);
  };

  const getRoleBadgeColor = (role: string, isEmergency?: boolean) => {
    if (isEmergency || role === 'buzo_emergencia') {
      return 'bg-orange-100 text-orange-700 border-orange-300';
    }
    
    const colors: Record<string, string> = {
      supervisor: 'bg-purple-100 text-purple-700',
      buzo_principal: 'bg-blue-100 text-blue-700',
      buzo_asistente: 'bg-teal-100 text-teal-700',
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
  };

  const getRoleLabel = (role: string, isEmergency?: boolean) => {
    if (isEmergency || role === 'buzo_emergencia') {
      return 'Buzo Emergencia';
    }
    
    const labels: Record<string, string> = {
      supervisor: 'Supervisor',
      buzo_principal: 'Buzo Principal',
      buzo_asistente: 'Buzo Asistente',
    };
    return labels[role] || role;
  };

  const emergencyDivers = currentTeamMembers.filter(member => member.is_emergency || member.role === 'buzo_emergencia');
  const activeDivers = currentTeamMembers.filter(member => !member.is_emergency && member.role !== 'buzo_emergencia');

  if (isLoading && !isCreatingNew) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Cargando equipo...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

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
            {targetDate && (
              <Badge variant="outline" className="bg-blue-100 text-blue-700">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(targetDate).toLocaleDateString('es-CL')}
              </Badge>
            )}
          </CardTitle>
        </div>

        {/* Botones de acción rápida */}
        <div className="flex gap-2 mt-4">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => openAddDialog('supervisor')}
            disabled={isAddingMember}
          >
            + Supervisor
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => openAddDialog('buzo_principal')}
            disabled={isAddingMember}
          >
            + Buzo Principal
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => openAddDialog('buzo_asistente')}
            disabled={isAddingMember}
          >
            + Buzo Asistente
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => openAddDialog('buzo_emergencia')}
            disabled={isAddingMember}
          >
            + Emergencia
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {currentTeamMembers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay miembros asignados</h3>
            <p className="text-zinc-500 mb-4">Agregue miembros al equipo de esta inmersión</p>
            <Button onClick={() => openAddDialog('supervisor')} variant="outline">
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
                  {activeDivers.map((member) => {
                    const conflict = targetDate ? checkUserConflict(member.user_id) : null;
                    
                    return (
                      <div
                        key={member.id}
                        className={`flex items-center justify-between p-3 border rounded-lg ${
                          conflict ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{member.nombre} {member.apellido}</div>
                            <div className="text-sm text-zinc-500">{member.email}</div>
                            {member.isExisting && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                Personal Registrado
                              </Badge>
                            )}
                            {conflict && (
                              <Alert className="mt-2 max-w-xs">
                                <AlertTriangle className="w-4 h-4" />
                                <AlertDescription className="text-xs">
                                  Conflicto: Ya asignado a {conflict.inmersion_code}
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getRoleBadgeColor(member.role, member.is_emergency)}>
                            {getRoleLabel(member.role, member.is_emergency)}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                            disabled={isRemovingMember}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
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
                        <Badge variant="outline" className={getRoleBadgeColor(member.role, member.is_emergency)}>
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {getRoleLabel(member.role, member.is_emergency)}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          disabled={isRemovingMember}
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

        <PersonalBuceoSelector
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSelectUser={handleSelectUser}
          onInviteUser={handleInviteUser}
          selectedRole={selectedRole}
          targetDate={targetDate}
        />
      </CardContent>
    </Card>
  );
};
