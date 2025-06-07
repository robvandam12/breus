
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, UserPlus, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { UserSearchSelect } from "@/components/usuarios/UserSearchSelect";

interface CreateEquipoFormWizardProps {
  onSubmit: (data: { equipoData: any; members: any[] }) => Promise<void>;
  onCancel: () => void;
}

export const CreateEquipoFormWizard = ({ onSubmit, onCancel }: CreateEquipoFormWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [equipoData, setEquipoData] = useState({
    nombre: '',
    descripcion: ''
  });
  const [members, setMembers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddMember = (userData: any, role: string) => {
    const newMember = {
      usuario_id: userData.usuario_id,
      nombre_completo: userData.nombre_completo || `${userData.nombre} ${userData.apellido}`,
      email: userData.email,
      rol_equipo: role,
      invitado: false
    };
    setMembers([...members, newMember]);
  };

  const handleInviteMember = (userData: any, role: string) => {
    const newMember = {
      usuario_id: null,
      nombre_completo: `${userData.nombre} ${userData.apellido}`,
      email: userData.email,
      rol_equipo: role,
      invitado: true
    };
    setMembers([...members, newMember]);
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!equipoData.nombre.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({ equipoData, members });
    } catch (error) {
      console.error('Error creating equipo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(2);
  const prevStep = () => setCurrentStep(1);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Crear Equipo de Buceo - Paso {currentStep} de 2
        </DialogTitle>
      </DialogHeader>
      
      {currentStep === 1 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre del Equipo *</Label>
            <Input
              id="nombre"
              value={equipoData.nombre}
              onChange={(e) => setEquipoData(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Nombre del equipo de buceo"
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

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={nextStep}
              disabled={!equipoData.nombre.trim()}
              className="flex-1"
            >
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Agregar Miembros al Equipo</h3>
            <p className="text-sm text-gray-600 mb-4">
              Busca y agrega miembros al equipo. Puedes invitar usuarios que no estén registrados.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-medium mb-3">Agregar Supervisor</h4>
                <UserSearchSelect
                  onSelectUser={(user) => handleAddMember(user, 'supervisor')}
                  onInviteUser={(user) => handleInviteMember(user, 'supervisor')}
                  allowedRoles={['supervisor']}
                  placeholder="Buscar supervisor..."
                />
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-3">Agregar Buzos</h4>
                <UserSearchSelect
                  onSelectUser={(user) => handleAddMember(user, 'buzo_principal')}
                  onInviteUser={(user) => handleInviteMember(user, 'buzo_principal')}
                  allowedRoles={['buzo']}
                  placeholder="Buscar buzos..."
                />
              </Card>
            </div>

            {members.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Miembros Agregados ({members.length})</h4>
                <div className="space-y-2">
                  {members.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-green-800">{member.nombre_completo}</p>
                          <p className="text-sm text-green-600">{member.email}</p>
                          {member.invitado && <Badge variant="outline" className="mt-1">Invitado</Badge>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-700">
                          {member.rol_equipo === 'supervisor' ? 'Supervisor' : 
                           member.rol_equipo === 'buzo_principal' ? 'Buzo Principal' : 'Buzo Asistente'}
                        </Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={prevStep}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Creando...' : 'Crear Equipo'}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
