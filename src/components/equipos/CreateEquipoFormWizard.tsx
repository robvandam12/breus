
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { UserSearchSelect } from "@/components/usuarios/UserSearchSelect";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";

interface CreateEquipoFormWizardProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  salmoneraId?: string;
}

interface EquipoMember {
  id: string;
  usuario_id?: string;
  nombre_completo: string;
  email: string;
  rol_equipo: string;
  invitado: boolean;
}

export const CreateEquipoFormWizard = ({ onSubmit, onCancel, salmoneraId }: CreateEquipoFormWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [equipoData, setEquipoData] = useState({
    nombre: '',
    descripcion: '',
    empresa_id: salmoneraId || ''
  });
  const [members, setMembers] = useState<EquipoMember[]>([]);
  
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();

  const handleAddMember = async (user: any) => {
    const newMember: EquipoMember = {
      id: `temp-${Date.now()}`,
      usuario_id: user.usuario_id,
      nombre_completo: `${user.nombre} ${user.apellido}`,
      email: user.email,
      rol_equipo: 'buzo_principal',
      invitado: false
    };
    setMembers([...members, newMember]);
  };

  const handleInviteMember = async (data: any) => {
    const newMember: EquipoMember = {
      id: `temp-invite-${Date.now()}`,
      nombre_completo: `${data.nombre} ${data.apellido}`,
      email: data.email,
      rol_equipo: data.rol || 'buzo_principal',
      invitado: true
    };
    setMembers([...members, newMember]);
  };

  const updateMemberRole = (memberId: string, newRole: string) => {
    setMembers(members.map(member => 
      member.id === memberId ? { ...member, rol_equipo: newRole } : member
    ));
  };

  const removeMember = (memberId: string) => {
    setMembers(members.filter(member => member.id !== memberId));
  };

  const handleNext = () => {
    if (currentStep === 1 && equipoData.nombre && equipoData.empresa_id) {
      setCurrentStep(2);
    }
  };

  const handleSubmit = () => {
    const finalData = {
      ...equipoData,
      miembros: members
    };
    onSubmit(finalData);
  };

  const getRoleBadgeColor = (rol: string) => {
    const colors: Record<string, string> = {
      supervisor: 'bg-purple-100 text-purple-700',
      buzo_principal: 'bg-blue-100 text-blue-700',
      buzo_asistente: 'bg-teal-100 text-teal-700',
    };
    return colors[rol] || 'bg-gray-100 text-gray-700';
  };

  const getRoleLabel = (rol: string) => {
    const labels: Record<string, string> = {
      supervisor: 'Supervisor',
      buzo_principal: 'Buzo Principal',
      buzo_asistente: 'Buzo Asistente',
    };
    return labels[rol] || rol;
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Crear Nuevo Equipo de Buceo
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
            </div>
            <div className={`w-12 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              2
            </div>
          </div>
        </div>
        <p className="text-sm text-zinc-500">
          {currentStep === 1 ? 'Paso 1: Información del Equipo' : 'Paso 2: Agregar Miembros'}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {currentStep === 1 && (
          <>
            <div>
              <Label htmlFor="nombre">Nombre del Equipo *</Label>
              <Input
                id="nombre"
                value={equipoData.nombre}
                onChange={(e) => setEquipoData(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Ej: Equipo Centro Norte"
                required
              />
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={equipoData.descripcion}
                onChange={(e) => setEquipoData(prev => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Descripción del equipo..."
                rows={3}
              />
            </div>

            {!salmoneraId && (
              <div>
                <Label htmlFor="empresa">Salmonera *</Label>
                <Select
                  value={equipoData.empresa_id}
                  onValueChange={(value) => setEquipoData(prev => ({ ...prev, empresa_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar salmonera..." />
                  </SelectTrigger>
                  <SelectContent>
                    {salmoneras.map((salmonera) => (
                      <SelectItem key={salmonera.id} value={salmonera.id}>
                        {salmonera.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">Agregar Miembros al Equipo</Label>
              <UserSearchSelect
                onSelectUser={handleAddMember}
                onInviteUser={handleInviteMember}
                allowedRoles={['supervisor', 'buzo']}
                placeholder="Buscar usuario para agregar al equipo..."
              />
            </div>

            {members.length > 0 && (
              <div>
                <Label className="text-base font-medium mb-3 block">
                  Miembros del Equipo ({members.length})
                </Label>
                <div className="space-y-3">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{member.nombre_completo}</div>
                          <div className="text-sm text-zinc-500">{member.email}</div>
                          {member.invitado && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              Invitado
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Select
                          value={member.rol_equipo}
                          onValueChange={(value) => updateMemberRole(member.id, value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="supervisor">Supervisor</SelectItem>
                            <SelectItem value="buzo_principal">Buzo Principal</SelectItem>
                            <SelectItem value="buzo_asistente">Buzo Asistente</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeMember(member.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between pt-4">
          <div>
            {currentStep === 2 && (
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            
            {currentStep === 1 ? (
              <Button 
                onClick={handleNext}
                disabled={!equipoData.nombre || !equipoData.empresa_id}
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                Crear Equipo
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
