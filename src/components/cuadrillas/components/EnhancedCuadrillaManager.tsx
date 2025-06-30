
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Users, UserPlus, Trash2, Check, AlertTriangle } from "lucide-react";
import { UserSearchSelect } from "@/components/usuarios/UserSearchSelect";
import { useCuadrillas } from "@/hooks/useCuadrillas";
import { toast } from "@/hooks/use-toast";

interface EnhancedCuadrillaManagerProps {
  cuadrillaId?: string;
  cuadrillaNombre?: string;
  onClose: () => void;
  onCuadrillaCreated?: (cuadrillaId: string) => void;
  createMode?: boolean;
  centroId?: string;
}

// Mapeo de roles para mostrar al usuario
const ROLE_OPTIONS = [
  { value: 'supervisor', label: 'Supervisor', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'buzo', label: 'Buzo Principal', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'asistente', label: 'Buzo Asistente', color: 'bg-teal-100 text-teal-700 border-teal-200' },
];

export const EnhancedCuadrillaManager = ({ 
  cuadrillaId, 
  cuadrillaNombre, 
  onClose,
  onCuadrillaCreated,
  createMode = false,
  centroId
}: EnhancedCuadrillaManagerProps) => {
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState('buzo');
  const [newCuadrillaNombre, setNewCuadrillaNombre] = useState('');
  const [isCreatingCuadrilla, setIsCreatingCuadrilla] = useState(createMode);
  const [currentCuadrillaId, setCurrentCuadrillaId] = useState(cuadrillaId);
  
  const { 
    cuadrillas, 
    addMember, 
    removeMember, 
    createCuadrilla,
    isCreating
  } = useCuadrillas();

  const cuadrilla = cuadrillas.find(c => c.id === currentCuadrillaId);
  const miembros = cuadrilla?.miembros || [];

  const handleCreateCuadrilla = async () => {
    if (!newCuadrillaNombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la cuadrilla es requerido.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newCuadrilla = await createCuadrilla({
        nombre: newCuadrillaNombre,
        centro_id: centroId || null,
        estado: 'disponible',
        activo: true
      });
      
      if (newCuadrilla) {
        setCurrentCuadrillaId(newCuadrilla.id);
        setIsCreatingCuadrilla(false);
        onCuadrillaCreated?.(newCuadrilla.id);
        
        toast({
          title: "Cuadrilla creada",
          description: `Se ha creado la cuadrilla "${newCuadrillaNombre}". Ahora puede agregar miembros.`,
        });
      }
    } catch (error) {
      console.error('Error creating cuadrilla:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la cuadrilla.",
        variant: "destructive",
      });
    }
  };

  const handleAddMember = async (userData: any) => {
    console.log('Adding member with userData:', userData, 'selectedRole:', selectedRole);
    
    try {
      await addMember({
        cuadrillaId: currentCuadrillaId!,
        usuarioId: userData.usuario_id,
        rolEquipo: selectedRole // Usar el rol seleccionado directamente
      });
      setShowAddMemberDialog(false);
      setSelectedRole('buzo'); // Reset role
      toast({
        title: "Miembro agregado",
        description: `${userData.nombre} ha sido agregado a la cuadrilla.`,
      });
    } catch (error) {
      console.error('Error adding member:', error);
      // El error ya se maneja en useCuadrillas
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
    const roleOption = ROLE_OPTIONS.find(option => 
      option.value === rol || 
      (rol === 'buzo_principal' && option.value === 'buzo') ||
      (rol === 'buzo_asistente' && option.value === 'asistente')
    );
    return roleOption?.color || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getRoleLabel = (rol: string) => {
    switch (rol) {
      case 'supervisor': return 'Supervisor';
      case 'buzo_principal': return 'Buzo Principal';
      case 'buzo_asistente': return 'Buzo Asistente';
      case 'buzo': return 'Buzo Principal'; // Fallback
      case 'asistente': return 'Buzo Asistente'; // Fallback
      default: return rol;
    }
  };

  // Mapear roles permitidos para UserSearchSelect
  const getAllowedRolesForSearch = (selectedRole: string) => {
    switch (selectedRole) {
      case 'supervisor': return ['supervisor'];
      case 'buzo': return ['buzo'];
      case 'asistente': return ['buzo'];
      default: return ['buzo'];
    }
  };

  const efectiveCuadrillaNombre = cuadrillaNombre || cuadrilla?.nombre || 'Nueva Cuadrilla';

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              {isCreatingCuadrilla ? (
                <div className="space-y-2">
                  <div className="text-lg font-semibold">Crear Nueva Cuadrilla</div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Nombre de la cuadrilla"
                      value={newCuadrillaNombre}
                      onChange={(e) => setNewCuadrillaNombre(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button 
                      onClick={handleCreateCuadrilla}
                      size="sm"
                      disabled={isCreating || !newCuadrillaNombre.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isCreating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Creando...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Crear
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-lg font-semibold">{efectiveCuadrillaNombre}</div>
                  <Badge variant="outline" className="mt-1">
                    {miembros.length} miembros
                  </Badge>
                </div>
              )}
            </div>
          </CardTitle>
          <div className="flex gap-2">
            {!isCreatingCuadrilla && currentCuadrillaId && (
              <Button
                onClick={() => setShowAddMemberDialog(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Agregar Miembro
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
            >
              {isCreatingCuadrilla ? 'Cancelar' : 'Cerrar'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isCreatingCuadrilla ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Complete el nombre de la cuadrilla
            </h3>
            <p className="text-gray-500">
              Una vez creada, podrá agregar miembros a su cuadrilla
            </p>
          </div>
        ) : !currentCuadrillaId ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Cuadrilla no encontrada
            </h3>
            <p className="text-gray-500">
              La cuadrilla seleccionada no se pudo cargar
            </p>
          </div>
        ) : miembros.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sin miembros asignados
            </h3>
            <p className="text-gray-500 mb-6">
              Esta cuadrilla aún no tiene miembros. Agregue el primer miembro para comenzar.
            </p>
            <Button 
              onClick={() => setShowAddMemberDialog(true)} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar Primer Miembro
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Miembros de la Cuadrilla</h4>
              <Badge variant="secondary">{miembros.length} miembros</Badge>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              {miembros.map((miembro) => (
                <div
                  key={miembro.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {(miembro.nombre?.charAt(0) || 'U').toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {miembro.nombre} {miembro.apellido}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={getRoleBadgeColor(miembro.rol_equipo)}
                        >
                          {getRoleLabel(miembro.rol_equipo)}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {miembro.disponible ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              Disponible
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-600">
                              <div className="w-2 h-2 bg-red-500 rounded-full" />
                              No disponible
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveMember(miembro.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dialog para agregar miembro */}
        <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Miembro a la Cuadrilla</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-800">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">Cuadrilla: {efectiveCuadrillaNombre}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="role" className="text-base font-medium">
                  Rol en la Cuadrilla
                </Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((roleOption) => (
                      <SelectItem key={roleOption.value} value={roleOption.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            roleOption.value === 'supervisor' ? 'bg-purple-500' :
                            roleOption.value === 'buzo' ? 'bg-blue-500' : 'bg-teal-500'
                          }`} />
                          {roleOption.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <Label className="text-base font-medium mb-3 block">
                  Seleccionar Usuario
                </Label>
                <UserSearchSelect
                  onSelectUser={handleAddMember}
                  onInviteUser={handleAddMember}
                  allowedRoles={getAllowedRolesForSearch(selectedRole)}
                  placeholder="Buscar usuario por nombre, apellido o email..."
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
