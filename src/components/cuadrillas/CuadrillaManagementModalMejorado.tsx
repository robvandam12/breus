
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, UserMinus, Shield, AlertCircle } from "lucide-react";
import { useCuadrillas } from '@/hooks/useCuadrillas';
import { useUsuarios } from '@/hooks/useUsuarios';
import { toast } from "@/hooks/use-toast";

interface CuadrillaManagementModalMejoradoProps {
  isOpen: boolean;
  onClose: () => void;
  cuadrillaId: string;
  onCuadrillaUpdated: (cuadrilla: any) => void;
}

export const CuadrillaManagementModalMejorado = ({ 
  isOpen, 
  onClose, 
  cuadrillaId, 
  onCuadrillaUpdated 
}: CuadrillaManagementModalMejoradoProps) => {
  const { cuadrillas, updateCuadrilla, addMember, removeMember } = useCuadrillas();
  const { usuarios } = useUsuarios();
  
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState('buzo_principal');
  const [isLoading, setIsLoading] = useState(false);

  const cuadrilla = cuadrillas.find(c => c.id === cuadrillaId);

  // Obtener usuarios disponibles (que no están ya en la cuadrilla)
  const availableUsers = usuarios.filter(usuario => {
    const isAlreadyMember = cuadrilla?.miembros?.some(miembro => 
      miembro.usuario_id === usuario.usuario_id
    );
    return !isAlreadyMember && (usuario.rol === 'supervisor' || usuario.rol === 'buzo');
  });

  const handleAddMember = async () => {
    if (!selectedUserId || !cuadrilla) return;

    // Verificar nuevamente que el usuario no esté ya en la cuadrilla
    const isAlreadyMember = cuadrilla.miembros?.some(miembro => 
      miembro.usuario_id === selectedUserId
    );

    if (isAlreadyMember) {
      toast({
        title: "Usuario ya agregado",
        description: "Este usuario ya es miembro de la cuadrilla.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await addMember({
        cuadrillaId: cuadrilla.id,
        usuarioId: selectedUserId,
        rolEquipo: selectedRole
      });
      
      setSelectedUserId('');
      setSelectedRole('buzo_principal');
      onCuadrillaUpdated(cuadrilla);
      
      toast({
        title: "Miembro agregado",
        description: "El miembro ha sido agregado exitosamente.",
      });
    } catch (error) {
      console.error('Error adding member:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!cuadrilla) return;
    
    setIsLoading(true);
    try {
      await removeMember(memberId);
      onCuadrillaUpdated(cuadrilla);
      
      toast({
        title: "Miembro removido",
        description: "El miembro ha sido removido exitosamente.",
      });
    } catch (error) {
      console.error('Error removing member:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeColor = (rol: string) => {
    const colors = {
      'supervisor': 'bg-blue-100 text-blue-700 border-blue-200',
      'buzo_principal': 'bg-green-100 text-green-700 border-green-200',
      'buzo_asistente': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    };
    return colors[rol as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  if (!cuadrilla) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Gestionar Cuadrilla: {cuadrilla.nombre}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información de la cuadrilla */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Nombre</Label>
                  <p className="text-gray-900">{cuadrilla.nombre}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Estado</Label>
                  <Badge variant="outline" className="ml-2">
                    {cuadrilla.estado}
                  </Badge>
                </div>
              </div>
              {cuadrilla.descripcion && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Descripción</Label>
                  <p className="text-gray-900">{cuadrilla.descripcion}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Agregar nuevo miembro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserPlus className="w-5 h-5 text-green-600" />
                Agregar Miembro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableUsers.length === 0 ? (
                <div className="flex items-center gap-2 p-4 bg-yellow-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <p className="text-yellow-800">No hay usuarios disponibles para agregar</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="user-select">Usuario</Label>
                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar usuario" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableUsers.map(usuario => (
                          <SelectItem key={usuario.usuario_id} value={usuario.usuario_id}>
                            {usuario.nombre} {usuario.apellido} ({usuario.rol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="role-select">Rol en el equipo</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="buzo_principal">Buzo Principal</SelectItem>
                        <SelectItem value="buzo_asistente">Buzo Asistente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      onClick={handleAddMember}
                      disabled={!selectedUserId || isLoading}
                      className="w-full"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Agregar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lista de miembros actuales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-purple-600" />
                Miembros Actuales ({cuadrilla.miembros?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!cuadrilla.miembros || cuadrilla.miembros.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay miembros en esta cuadrilla</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cuadrilla.miembros.map((miembro) => (
                    <div key={miembro.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {miembro.nombre && miembro.apellido 
                              ? `${miembro.nombre} ${miembro.apellido}`
                              : 'Usuario no encontrado'
                            }
                          </div>
                          <Badge variant="outline" className={getRoleBadgeColor(miembro.rol_equipo)}>
                            {miembro.rol_equipo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveMember(miembro.id)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <UserMinus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
