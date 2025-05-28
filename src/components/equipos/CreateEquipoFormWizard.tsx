
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Trash2, ArrowRight, ArrowLeft, CheckCircle, User } from "lucide-react";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import { useUsuarios } from "@/hooks/useUsuarios";
import { supabase } from "@/integrations/supabase/client";

interface TeamMember {
  id?: string;
  usuario_id: string;
  rol_equipo: 'supervisor' | 'buzo_principal' | 'buzo_asistente';
  nombre_completo: string;
  email: string;
  telefono?: string;
  matricula?: string;
}

interface CreateEquipoFormWizardProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  salmoneraId?: string;
  contratistaId?: string;
}

export const CreateEquipoFormWizard = ({ 
  onSubmit, 
  onCancel, 
  salmoneraId, 
  contratistaId 
}: CreateEquipoFormWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [teamData, setTeamData] = useState({
    nombre: '',
    descripcion: '',
    empresa_id: salmoneraId || contratistaId || '',
    tipo_empresa: salmoneraId ? 'salmonera' : contratistaId ? 'contratista' : 'salmonera'
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();
  const { usuarios } = useUsuarios();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('usuario')
          .select('*')
          .eq('usuario_id', user.id)
          .single();
        
        if (userData) {
          setCurrentUser(userData);
          
          // Auto-detectar empresa del usuario
          if (userData.salmonera_id && !salmoneraId) {
            setTeamData(prev => ({
              ...prev,
              empresa_id: userData.salmonera_id,
              tipo_empresa: 'salmonera'
            }));
          } else if (userData.servicio_id && !contratistaId) {
            setTeamData(prev => ({
              ...prev,
              empresa_id: userData.servicio_id,
              tipo_empresa: 'contratista'
            }));
          }
        }
      }
    };

    fetchCurrentUser();
  }, [salmoneraId, contratistaId]);

  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, {
      usuario_id: '',
      rol_equipo: 'buzo_asistente',
      nombre_completo: '',
      email: '',
      telefono: '',
      matricula: ''
    }]);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const newMembers = [...teamMembers];
    newMembers[index] = { ...newMembers[index], [field]: value };
    
    // Si se selecciona un usuario, auto-completar datos
    if (field === 'usuario_id' && value) {
      const selectedUser = usuarios.find(u => u.usuario_id === value);
      if (selectedUser) {
        newMembers[index].nombre_completo = `${selectedUser.nombre} ${selectedUser.apellido}`;
        newMembers[index].email = selectedUser.email || '';
        newMembers[index].telefono = selectedUser.perfil_buzo?.telefono || '';
        newMembers[index].matricula = selectedUser.perfil_buzo?.matricula || '';
      }
    }
    
    setTeamMembers(newMembers);
  };

  const handleSubmit = () => {
    const finalData = {
      ...teamData,
      miembros: teamMembers.filter(member => member.usuario_id)
    };
    onSubmit(finalData);
  };

  // Check if user is admin with company - add proper null checks
  const isUserAdminWithCompany = currentUser && 
    ((currentUser.rol === 'admin_salmonera' && currentUser.salmonera_id) ||
    (currentUser.rol === 'admin_contratista' && currentUser.servicio_id));

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Crear Nuevo Equipo de Buceo
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
          </div>
          <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            {currentStep >= 2 ? <CheckCircle className="w-4 h-4" /> : '2'}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Información del Equipo</h3>
              <p className="text-gray-600">Configura los datos básicos del equipo de buceo</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre del Equipo *</Label>
                <Input
                  id="nombre"
                  value={teamData.nombre}
                  onChange={(e) => setTeamData(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Ej: Equipo Alpha"
                  required
                />
              </div>

              {!isUserAdminWithCompany && (
                <>
                  <div>
                    <Label htmlFor="tipo_empresa">Tipo de Empresa *</Label>
                    <Select
                      value={teamData.tipo_empresa}
                      onValueChange={(value: 'salmonera' | 'contratista') => 
                        setTeamData(prev => ({ ...prev, tipo_empresa: value, empresa_id: '' }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salmonera">Salmonera</SelectItem>
                        <SelectItem value="contratista">Contratista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="empresa">
                      {teamData.tipo_empresa === 'salmonera' ? 'Salmonera' : 'Contratista'} *
                    </Label>
                    <Select
                      value={teamData.empresa_id}
                      onValueChange={(value) => setTeamData(prev => ({ ...prev, empresa_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar empresa..." />
                      </SelectTrigger>
                      <SelectContent>
                        {teamData.tipo_empresa === 'salmonera' 
                          ? salmoneras.map((salmonera) => (
                              <SelectItem key={salmonera.id} value={salmonera.id}>
                                {salmonera.nombre}
                              </SelectItem>
                            ))
                          : contratistas.map((contratista) => (
                              <SelectItem key={contratista.id} value={contratista.id}>
                                {contratista.nombre}
                              </SelectItem>
                            ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {isUserAdminWithCompany && currentUser && (
                <div>
                  <Label>Empresa Asignada</Label>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="font-medium text-blue-900">
                      {currentUser.salmonera_id ? 'Salmonera' : 'Contratista'} (Auto-asignado)
                    </p>
                    <p className="text-sm text-blue-700">
                      {currentUser.salmonera_id 
                        ? salmoneras.find(s => s.id === currentUser.salmonera_id)?.nombre
                        : contratistas.find(c => c.id === currentUser.servicio_id)?.nombre
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={teamData.descripcion}
                onChange={(e) => setTeamData(prev => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Descripción del equipo y sus especialidades..."
                rows={3}
              />
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleNextStep}
                disabled={!teamData.nombre || !teamData.empresa_id}
                className="flex items-center gap-2"
              >
                Siguiente: Asignar Miembros
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Miembros del Equipo</h3>
              <p className="text-gray-600">Asigna buzos y supervisores al equipo</p>
            </div>

            {teamMembers.length === 0 ? (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No hay miembros asignados al equipo</p>
                <Button onClick={addTeamMember} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Agregar Primer Miembro
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Miembro {index + 1}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeTeamMember(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Usuario *</Label>
                        <Select
                          value={member.usuario_id}
                          onValueChange={(value) => updateTeamMember(index, 'usuario_id', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar usuario..." />
                          </SelectTrigger>
                          <SelectContent>
                            {usuarios.filter(u => u.rol === 'buzo' || u.rol === 'supervisor').map((usuario) => (
                              <SelectItem key={usuario.usuario_id} value={usuario.usuario_id}>
                                {usuario.nombre} {usuario.apellido}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Rol en el Equipo *</Label>
                        <Select
                          value={member.rol_equipo}
                          onValueChange={(value: 'supervisor' | 'buzo_principal' | 'buzo_asistente') => 
                            updateTeamMember(index, 'rol_equipo', value)
                          }
                        >
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

                      <div>
                        <Label>Matrícula</Label>
                        <Input
                          value={member.matricula || ''}
                          onChange={(e) => updateTeamMember(index, 'matricula', e.target.value)}
                          placeholder="Número de matrícula"
                        />
                      </div>
                    </div>

                    {member.usuario_id && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Nombre:</span> {member.nombre_completo}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span> {member.email}
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}

                <Button 
                  onClick={addTeamMember} 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Otro Miembro
                </Button>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handlePrevStep} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Crear Equipo
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
