
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserPlus, Trash2, Edit } from "lucide-react";
import { UserSearchSelect } from "@/components/usuarios/UserSearchSelect";
import { useCuadrillas } from "@/hooks/useCuadrillas";
import { toast } from "@/hooks/use-toast";

interface CuadrillaTeamManagerProps {
  cuadrillaId: string;
  cuadrillaNombre: string;
  onClose: () => void;
}

export const CuadrillaTeamManager = ({ cuadrillaId, cuadrillaNombre, onClose }: CuadrillaTeamManagerProps) => {
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState('buzo');
  const { cuadrillas, addMember, removeMember } = useCuadrillas();

  const cuadrilla = cuadrillas.find(c => c.id === cuadrillaId);
  const miembros = cuadrilla?.miembros || [];

  const handleAddMember = async (userData: any) => {
    try {
      await addMember({
        cuadrillaId,
        usuarioId: userData.usuario_id,
        rolEquipo: selectedRole
      });
      setShowAddMemberDialog(false);
      toast({
        title: "Miembro agregado",
        description: `${userData.nombre} ha sido agregado a la cuadrilla.`,
      });
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el miembro a la cuadrilla.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (miembroId: string) => {
    try {
      await removeMember(miembroId);
      toast({
        title: "Miembro removido",
        description: "El miembro ha sido removido de la cuadrilla.",
      });
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "No se pudo remover el miembro.",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (rol: string) => {
    const colors: Record<string, string> = {
      supervisor: 'bg-purple-100 text-purple-700',
      buzo: 'bg-blue-100 text-blue-700',
      asistente: 'bg-teal-100 text-teal-700',
    };
    return colors[rol] || 'bg-gray-100 text-gray-700';
  };

  const getRoleLabel = (rol: string) => {
    const labels: Record<string, string> = {
      supervisor: 'Supervisor',
      buzo: 'Buzo',
      asistente: 'Asistente',
    };
    return labels[rol] || rol;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Gestionar Cuadrilla: {cuadrillaNombre}
            <Badge variant="outline">{miembros.length} miembros</Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAddMemberDialog(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar Miembro
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {miembros.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay miembros asignados</h3>
            <p className="text-gray-500 mb-4">Agregue miembros a esta cuadrilla</p>
            <Button 
              onClick={() => setShowAddMemberDialog(true)} 
              variant="outline"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar Primer Miembro
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {miembros.map((miembro) => (
              <div
                key={miembro.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{miembro.nombre} {miembro.apellido}</div>
                    <div className="text-sm text-gray-500">
                      Disponible: {miembro.disponible ? 'Sí' : 'No'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getRoleBadgeColor(miembro.rol_equipo)}>
                    {getRoleLabel(miembro.rol_equipo)}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveMember(miembro.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dialog para agregar miembro */}
        <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Miembro a la Cuadrilla</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="role">Rol en la Cuadrilla</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="buzo">Buzo</SelectItem>
                    <SelectItem value="asistente">Asistente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <UserSearchSelect
                onSelectUser={handleAddMember}
                onInviteUser={handleAddMember}
                allowedRoles={selectedRole === 'supervisor' ? ['supervisor'] : ['buzo']}
                placeholder="Buscar usuario para agregar a la cuadrilla..."
              />
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
