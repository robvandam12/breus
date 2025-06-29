
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
import { UserSearchSelect } from '@/components/usuarios/UserSearchSelect';

interface CuadrillaCreationWizardEnhancedProps {
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
  email?: string;
}

export const CuadrillaCreationWizardEnhanced = ({
  isOpen,
  onClose,
  onCuadrillaCreated,
  enterpriseContext,
  fechaInmersion
}: CuadrillaCreationWizardEnhancedProps) => {
  const { profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

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

  const handleUserSelect = (user: any) => {
    const newMember: CuadrillaMember = {
      id: `temp-${Date.now()}`,
      usuario_id: user.usuario_id,
      rol_equipo: 'buzo',
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email
    };
    setMembers([...members, newMember]);
  };

  const handleUserInvite = (userData: any) => {
    const newMember: CuadrillaMember = {
      id: `temp-${Date.now()}`,
      usuario_id: '', // Será null para invitados
      rol_equipo: 'buzo',
      nombre: userData.nombre,
      apellido: userData.apellido,
      email: userData.email
    };
    setMembers([...members, newMember]);
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const updateMemberRole = (id: string, rol: string) => {
    setMembers(members.map(m => 
      m.id === id ? { ...m, rol_equipo: rol } : m
    ));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(cuadrillaData.nombre.trim());
      case 2:
        return members.length > 0 && members.every(m => m.rol_equipo);
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

      // Agregar miembros solo si tienen usuario_id válido
      const validMembers = members.filter(member => member.usuario_id);
      if (validMembers.length > 0) {
        const membersData = validMembers.map(member => ({
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
        description: `La cuadrilla "${cuadrillaData.nombre}" ha sido creada exitosamente con ${validMembers.length} miembros.`,
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
                <CardTitle>Miembros de la Cuadrilla</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* UserSearchSelect para agregar miembros */}
                <div>
                  <Label className="block text-sm font-medium mb-2">
                    Buscar y Agregar Miembros
                  </Label>
                  <UserSearchSelect
                    onSelectUser={handleUserSelect}
                    onInviteUser={handleUserInvite}
                    allowedRoles={['supervisor', 'buzo']}
                    placeholder="Buscar usuario para agregar a la cuadrilla..."
                  />
                </div>

                {/* Lista de miembros agregados */}
                {members.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No hay miembros agregados</p>
                    <p className="text-sm">Use el buscador de arriba para agregar miembros</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-gray-700">
                      Miembros Agregados ({members.length})
                    </h4>
                    {members.map((member, index) => (
                      <div key={member.id} className="flex gap-3 items-center p-3 border rounded-lg bg-gray-50">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {member.nombre} {member.apellido}
                          </div>
                          <div className="text-xs text-gray-500">
                            {member.email}
                          </div>
                        </div>

                        <div className="w-40">
                          <Select
                            value={member.rol_equipo}
                            onValueChange={(value) => updateMemberRole(member.id, value)}
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
