
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, User, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CuadrillaCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCuadrillaCreated: (cuadrilla: any) => void;
  enterpriseContext?: any;
  fechaInmersion?: string;
}

interface CuadrillaMember {
  id: string;
  usuario_id: string;
  rol_equipo: string;
  nombre?: string;
  apellido?: string;
}

interface Usuario {
  usuario_id: string;
  nombre: string;
  apellido: string;
  rol: string;
}

export const CuadrillaCreationWizard = ({
  isOpen,
  onClose,
  onCuadrillaCreated,
  enterpriseContext,
  fechaInmersion
}: CuadrillaCreationWizardProps) => {
  const { profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<Usuario[]>([]);

  const [cuadrillaData, setCuadrillaData] = useState({
    nombre: '',
    descripcion: '',
    centro_id: ''
  });

  const [members, setMembers] = useState<CuadrillaMember[]>([]);
  const [centros, setCentros] = useState<any[]>([]);

  React.useEffect(() => {
    if (isOpen) {
      loadCentros();
      loadAvailableUsers();
    }
  }, [isOpen, enterpriseContext]);

  const loadCentros = async () => {
    try {
      if (!enterpriseContext) return;

      const empresaId = enterpriseContext.salmonera_id || enterpriseContext.contratista_id;
      if (!empresaId) return;

      const { data } = await supabase
        .from('centros')
        .select('id, nombre')
        .eq('salmonera_id', empresaId)
        .eq('estado', 'activo')
        .order('nombre');

      setCentros(data || []);
    } catch (error) {
      console.error('Error loading centros:', error);
    }
  };

  const loadAvailableUsers = async () => {
    try {
      if (!enterpriseContext) return;

      const empresaId = enterpriseContext.salmonera_id || enterpriseContext.contratista_id;
      const empresaTipo = enterpriseContext.salmonera_id ? 'salmonera_id' : 'servicio_id';

      const { data } = await supabase
        .from('usuario')
        .select('usuario_id, nombre, apellido, rol')
        .eq(empresaTipo, empresaId)
        .in('rol', ['supervisor', 'buzo'])
        .order('nombre');

      setAvailableUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const addMember = () => {
    const newMember: CuadrillaMember = {
      id: `temp-${Date.now()}`,
      usuario_id: '',
      rol_equipo: 'buzo',
      nombre: '',
      apellido: ''
    };
    setMembers([...members, newMember]);
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const updateMember = (id: string, field: string, value: string) => {
    setMembers(members.map(m => {
      if (m.id === id) {
        const updated = { ...m, [field]: value };
        
        // Si cambió el usuario, actualizar nombre y apellido
        if (field === 'usuario_id') {
          const selectedUser = availableUsers.find(u => u.usuario_id === value);
          if (selectedUser) {
            updated.nombre = selectedUser.nombre;
            updated.apellido = selectedUser.apellido;
          }
        }
        
        return updated;
      }
      return m;
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(cuadrillaData.nombre.trim());
      case 2:
        return members.length > 0 && members.every(m => m.usuario_id && m.rol_equipo);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const empresaId = enterpriseContext?.salmonera_id || enterpriseContext?.contratista_id;
      const tipoEmpresa = enterpriseContext?.salmonera_id ? 'salmonera' : 'contratista';

      // Crear cuadrilla
      const { data: cuadrilla, error: cuadrillaError } = await supabase
        .from('cuadrillas_buceo')
        .insert([{
          nombre: cuadrillaData.nombre,
          descripcion: cuadrillaData.descripcion,
          empresa_id: empresaId,
          tipo_empresa: tipoEmpresa,
          centro_id: cuadrillaData.centro_id || null,
          estado: 'disponible',
          activo: true
        }])
        .select()
        .single();

      if (cuadrillaError) throw cuadrillaError;

      // Agregar miembros
      if (members.length > 0) {
        const membersData = members.map(member => ({
          cuadrilla_id: cuadrilla.id,
          usuario_id: member.usuario_id,
          rol_equipo: member.rol_equipo,
          disponible: true
        }));

        const { error: membersError } = await supabase
          .from('cuadrilla_miembros')
          .insert(membersData);

        if (membersError) throw membersError;
      }

      toast({
        title: "Cuadrilla creada",
        description: `La cuadrilla "${cuadrillaData.nombre}" ha sido creada exitosamente con ${members.length} miembros.`,
      });

      onCuadrillaCreated(cuadrilla);
      onClose();

      // Reset form
      setCuadrillaData({ nombre: '', descripcion: '', centro_id: '' });
      setMembers([]);
      setCurrentStep(1);
    } catch (error) {
      console.error('Error creating cuadrilla:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la cuadrilla",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const progress = (currentStep / 2) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Nueva Cuadrilla de Buceo
          </DialogTitle>
          <Progress value={progress} className="w-full" />
          <div className="text-sm text-gray-500">
            Paso {currentStep} de 2
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre de la Cuadrilla *</Label>
                  <Input
                    id="nombre"
                    value={cuadrillaData.nombre}
                    onChange={(e) => setCuadrillaData(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Ej: Cuadrilla Alpha, Equipo Norte..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={cuadrillaData.descripcion}
                    onChange={(e) => setCuadrillaData(prev => ({ ...prev, descripcion: e.target.value }))}
                    placeholder="Descripción de la cuadrilla, especialidades, etc..."
                    rows={3}
                  />
                </div>

                {centros.length > 0 && (
                  <div>
                    <Label htmlFor="centro">Centro Preferido (Opcional)</Label>
                    <Select
                      value={cuadrillaData.centro_id}
                      onValueChange={(value) => setCuadrillaData(prev => ({ ...prev, centro_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar centro" />
                      </SelectTrigger>
                      <SelectContent>
                        {centros.map(centro => (
                          <SelectItem key={centro.id} value={centro.id}>
                            {centro.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {fechaInmersion && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      📅 Esta cuadrilla será asignada para la inmersión del {fechaInmersion}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Miembros de la Cuadrilla</CardTitle>
                  <Button onClick={addMember} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Miembro
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {members.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No hay miembros agregados</p>
                    <p className="text-sm">Haga clic en "Agregar Miembro" para comenzar</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {members.map((member, index) => (
                      <div key={member.id} className="flex gap-3 items-end p-3 border rounded-lg">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Usuario *</Label>
                            <Select
                              value={member.usuario_id}
                              onValueChange={(value) => updateMember(member.id, 'usuario_id', value)}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Seleccionar usuario" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableUsers
                                  .filter(user => !members.some(m => m.usuario_id === user.usuario_id && m.id !== member.id))
                                  .map(user => (
                                  <SelectItem key={user.usuario_id} value={user.usuario_id}>
                                    {user.nombre} {user.apellido} ({user.rol})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-xs">Rol en el Equipo *</Label>
                            <Select
                              value={member.rol_equipo}
                              onValueChange={(value) => updateMember(member.id, 'rol_equipo', value)}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="supervisor">Supervisor</SelectItem>
                                <SelectItem value="buzo_principal">Buzo Principal</SelectItem>
                                <SelectItem value="buzo_asistente">Buzo Asistente</SelectItem>
                                <SelectItem value="buzo">Buzo</SelectItem>
                                <SelectItem value="apoyo_superficie">Apoyo Superficie</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Button
                          onClick={() => removeMember(member.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    💡 <strong>Consejo:</strong> Asegúrese de incluir al menos un supervisor y los buzos necesarios para la operación.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            <Button
              onClick={prevStep}
              disabled={currentStep === 1}
              variant="outline"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            {currentStep < 2 ? (
              <Button onClick={nextStep}>
                Siguiente
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Creando...' : 'Crear Cuadrilla'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
