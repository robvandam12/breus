
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Trash2 } from "lucide-react";
import { UserSearchSelect } from "@/components/usuarios/UserSearchSelect";
import { BitacoraFormBase } from '@/components/forms/BitacoraFormBase';
import { BitacoraWizardProgress } from '@/components/forms/BitacoraWizardProgress';
import { BitacoraFormActions } from '@/components/forms/BitacoraFormActions';

interface CreateEquipoFormWizardProps {
  onSubmit: (data: { equipoData: any; members: any[] }) => Promise<void>;
  onCancel: () => void;
}

const WIZARD_STEPS = [
  { title: 'Info Equipo' },
  { title: 'Miembros' }
];

export const CreateEquipoFormWizard = ({ onSubmit, onCancel }: CreateEquipoFormWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [equipoData, setEquipoData] = useState({
    nombre: '',
    descripcion: ''
  });
  const [members, setMembers] = useState<any[]>([]);

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

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(2);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(1);
    }
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

  const canGoNext = currentStep === 1 ? equipoData.nombre.trim().length > 0 : false;

  const renderStep = () => {
    if (currentStep === 1) {
      return (
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
        </div>
      );
    }

    return (
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
      </div>
    );
  };

  return (
    <BitacoraFormBase
      title="Crear Equipo de Buceo"
      subtitle="Configuración de equipo y miembros"
      icon={Users}
      variant="dialog"
      isLoading={isSubmitting}
    >
      <BitacoraWizardProgress
        currentStep={currentStep}
        totalSteps={2}
        steps={WIZARD_STEPS}
        className="mb-6"
      />

      <div className="min-h-[400px]">
        {renderStep()}
      </div>

      <BitacoraFormActions
        type="wizard"
        onCancel={onCancel}
        onSubmit={handleSubmit}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isLoading={isSubmitting}
        canGoNext={canGoNext}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === 2}
        className="mt-6"
      />
    </BitacoraFormBase>
  );
};
