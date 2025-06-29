
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, X, CheckCircle, AlertTriangle, Users } from "lucide-react";
import { useCuadrillas } from '@/hooks/useCuadrillas';
import { UserSearchSelect } from '@/components/usuarios/UserSearchSelect';
import { toast } from '@/hooks/use-toast';

interface Member {
  usuario_id: string;
  rol_equipo: string;
  nombre?: string;
  apellido?: string;
}

interface CuadrillaCreationWizardEnhancedProps {
  isOpen: boolean;
  onClose: () => void;
  onCuadrillaCreated: (cuadrilla: any) => void;
  enterpriseContext?: any;
  fechaInmersion?: string;
}

interface CuadrillaFormData {
  nombre: string;
  descripcion: string;
  centro_id: string;
  estado: 'disponible' | 'ocupada' | 'mantenimiento';
  empresa_id?: string;
  tipo_empresa?: 'salmonera' | 'contratista';
}

export const CuadrillaCreationWizardEnhanced = ({
  isOpen,
  onClose,
  onCuadrillaCreated,
  enterpriseContext,
  fechaInmersion
}: CuadrillaCreationWizardEnhancedProps) => {
  const { createCuadrilla, addMember, isCreating } = useCuadrillas();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<CuadrillaFormData>({
    nombre: '',
    descripcion: '',
    centro_id: '',
    estado: 'disponible'
  });
  
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState('buzo_principal');

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData({
        nombre: '',
        descripcion: '',
        centro_id: '',
        estado: 'disponible'
      });
      setMembers([]);
      setSelectedUserId('');
      setSelectedRole('buzo_principal');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleAddMember = (userData: any) => {
    console.log('Adding member with userData:', userData);
    
    if (!userData.usuario_id) {
      toast({
        title: "Error",
        description: "No se pudo obtener el ID del usuario",
        variant: "destructive",
      });
      return;
    }

    // Verificar que no esté ya en la cuadrilla
    if (members.some(m => m.usuario_id === userData.usuario_id)) {
      toast({
        title: "Error",
        description: "Este usuario ya está en la cuadrilla",
        variant: "destructive",
      });
      return;
    }

    // Verificar que no haya más de un supervisor
    if (selectedRole === 'supervisor' && members.some(m => m.rol_equipo === 'supervisor')) {
      toast({
        title: "Error",
        description: "Solo puede haber un supervisor por cuadrilla",
        variant: "destructive",
      });
      return;
    }

    const newMember: Member = {
      usuario_id: userData.usuario_id,
      rol_equipo: selectedRole,
      nombre: userData.nombre,
      apellido: userData.apellido
    };

    setMembers(prev => [...prev, newMember]);
    setSelectedUserId('');
    
    toast({
      title: "Miembro agregado",
      description: `${userData.nombre} ${userData.apellido} agregado como ${selectedRole}`,
    });
  };

  const handleRemoveMember = (usuarioId: string) => {
    setMembers(prev => prev.filter(m => m.usuario_id !== usuarioId));
  };

  const validateStep1 = () => {
    if (!formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la cuadrilla es requerido",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (members.length === 0) {
      toast({
        title: "Error",
        description: "Debe agregar al menos un miembro a la cuadrilla",
        variant: "destructive",
      });
      return false;
    }

    // Verificar que haya al menos un supervisor
    if (!members.some(m => m.rol_equipo === 'supervisor')) {
      toast({
        title: "Error",
        description: "Debe haber al menos un supervisor en la cuadrilla",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setIsSubmitting(true);
    try {
      console.log('Creating cuadrilla with data:', formData);
      console.log('Enterprise context:', enterpriseContext);

      let cuadrillaData = {
        ...formData,
        activo: true
      };

      // Si hay contexto empresarial, usarlo
      if (enterpriseContext) {
        if (enterpriseContext.salmonera_id) {
          cuadrillaData.empresa_id = enterpriseContext.salmonera_id;
          cuadrillaData.tipo_empresa = 'salmonera';
        } else if (enterpriseContext.contratista_id) {
          cuadrillaData.empresa_id = enterpriseContext.contratista_id;
          cuadrillaData.tipo_empresa = 'contratista';
        }
      }

      const newCuadrilla = await createCuadrilla(cuadrillaData);
      console.log('Cuadrilla created:', newCuadrilla);

      // Agregar miembros uno por uno con mejor manejo de errores
      for (const member of members) {
        console.log('Adding member:', member);
        try {
          await addMember({
            cuadrillaId: newCuadrilla.id,
            usuarioId: member.usuario_id,
            rolEquipo: member.rol_equipo
          });
        } catch (memberError) {
          console.error('Error adding member:', member, memberError);
          toast({
            title: "Advertencia",
            description: `Error al agregar miembro ${member.nombre} ${member.apellido}`,
            variant: "destructive",
          });
        }
      }

      // Llamar callback con la cuadrilla creada
      onCuadrillaCreated(newCuadrilla);
      
      toast({
        title: "Éxito",
        description: `Cuadrilla "${formData.nombre}" creada exitosamente con ${members.length} miembros`,
      });

      onClose();
    } catch (error) {
      console.error('Error creating cuadrilla:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la cuadrilla. Inténtelo nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap = {
      'supervisor': 'Supervisor',
      'buzo_principal': 'Buzo Principal',
      'buzo_asistente': 'Buzo Asistente'
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  const canProceed = step === 1 ? formData.nombre.trim() : members.length > 0 && members.some(m => m.rol_equipo === 'supervisor');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Nueva Cuadrilla de Buceo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                {step > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
              </div>
              <span className="text-sm font-medium">Información Básica</span>
            </div>
            <div className={`w-8 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="text-sm font-medium">Miembros</span>
            </div>
          </div>

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información de la Cuadrilla</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre de la Cuadrilla *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Ej: Equipo Alpha, Cuadrilla Norte..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                    placeholder="Descripción opcional de la cuadrilla..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado Inicial</Label>
                  <Select
                    value={formData.estado}
                    onValueChange={(value: 'disponible' | 'ocupada' | 'mantenimiento') => 
                      setFormData(prev => ({ ...prev, estado: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disponible">Disponible</SelectItem>
                      <SelectItem value="ocupada">Ocupada</SelectItem>
                      <SelectItem value="mantenimiento">En Mantenimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {fechaInmersion && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Fecha de inmersión:</strong> {fechaInmersion}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      La cuadrilla será asignada automáticamente a esta fecha.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Members */}
          {step === 2 && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Agregar Miembros</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Seleccionar Usuario</Label>
                      <UserSearchSelect
                        onSelectUser={handleAddMember}
                        onInviteUser={() => {}}
                        allowedRoles={['supervisor', 'buzo']}
                        placeholder="Buscar usuario..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Rol en la Cuadrilla</Label>
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
                  </div>
                </CardContent>
              </Card>

              {/* Members list */}
              {members.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Miembros de la Cuadrilla ({members.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {members.map((member, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="font-medium">
                                {member.nombre} {member.apellido}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {getRoleDisplayName(member.rol_equipo)}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleRemoveMember(member.usuario_id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Validation messages */}
              {members.length === 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      Debe agregar al menos un miembro a la cuadrilla.
                    </p>
                  </div>
                </div>
              )}

              {members.length > 0 && !members.some(m => m.rol_equipo === 'supervisor') && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      Debe haber al menos un supervisor en la cuadrilla.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4 border-t">
            <div>
              {step === 2 && (
                <Button onClick={handleBack} variant="outline">
                  Anterior
                </Button>
              )}
            </div>
            
            <div className="space-x-2">
              <Button onClick={onClose} variant="outline">
                Cancelar
              </Button>
              
              {step === 1 ? (
                <Button 
                  onClick={handleNext} 
                  disabled={!canProceed}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Siguiente
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={!canProceed || isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 'Creando...' : 'Crear Cuadrilla'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
