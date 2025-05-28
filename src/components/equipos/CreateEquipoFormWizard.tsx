
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import { useUsuarios } from "@/hooks/useUsuarios";

interface CreateEquipoFormWizardProps {
  onSubmit: (equipoData: any) => Promise<void>;
  onCancel: () => void;
}

export const CreateEquipoFormWizard = ({ onSubmit, onCancel }: CreateEquipoFormWizardProps) => {
  const { user, userProfile } = useAuth();
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();
  const { usuarios } = useUsuarios();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [equipoData, setEquipoData] = useState({
    nombre: '',
    descripcion: '',
    empresa_id: '',
    tipo_empresa: ''
  });
  
  const [selectedMembers, setSelectedMembers] = useState<Array<{
    usuario_id: string;
    rol_equipo: string;
    nombre_completo: string;
  }>>([]);

  // Auto-detectar empresa del usuario admin
  const autoDetectEmpresa = () => {
    if (!userProfile) return;
    
    if (userProfile.rol === 'admin_salmonero' && userProfile.salmonera_id) {
      setEquipoData(prev => ({
        ...prev,
        empresa_id: userProfile.salmonera_id,
        tipo_empresa: 'salmonera'
      }));
    } else if (userProfile.rol === 'admin_contratista' && userProfile.servicio_id) {
      setEquipoData(prev => ({
        ...prev,
        empresa_id: userProfile.servicio_id,
        tipo_empresa: 'contratista'
      }));
    }
  };

  useState(() => {
    autoDetectEmpresa();
  }, [userProfile]);

  const isUserAdmin = userProfile?.rol === 'admin_salmonero' || userProfile?.rol === 'admin_contratista';
  const availableUsers = usuarios.filter(u => u.rol === 'supervisor' || u.rol === 'buzo');

  const handleStep1Submit = () => {
    if (!equipoData.nombre || (!isUserAdmin && !equipoData.empresa_id)) return;
    setCurrentStep(2);
  };

  const handleAddMember = (usuarioId: string, rol: string) => {
    const usuario = usuarios.find(u => u.usuario_id === usuarioId);
    if (!usuario) return;

    const member = {
      usuario_id: usuarioId,
      rol_equipo: rol,
      nombre_completo: `${usuario.nombre} ${usuario.apellido}`
    };

    setSelectedMembers(prev => [...prev, member]);
  };

  const handleRemoveMember = (index: number) => {
    setSelectedMembers(prev => prev.filter((_, i) => i !== index));
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        equipoData,
        members: selectedMembers
      });
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}>
            {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
          </div>
          <div className="h-px bg-gray-300 w-16" />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}>
            2
          </div>
        </div>
        <Badge variant="outline">
          Paso {currentStep} de 2
        </Badge>
      </div>

      {/* Step 1: Create Team */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Crear Equipo de Buceo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre del Equipo *</Label>
              <Input
                id="nombre"
                value={equipoData.nombre}
                onChange={(e) => setEquipoData(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Ej: Equipo Centro Norte"
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

            {!isUserAdmin && (
              <div>
                <Label>Tipo de Empresa *</Label>
                <Select
                  value={equipoData.tipo_empresa}
                  onValueChange={(value) => setEquipoData(prev => ({ ...prev, tipo_empresa: value }))}
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
            )}

            {!isUserAdmin && equipoData.tipo_empresa && (
              <div>
                <Label>Empresa *</Label>
                <Select
                  value={equipoData.empresa_id}
                  onValueChange={(value) => setEquipoData(prev => ({ ...prev, empresa_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empresa..." />
                  </SelectTrigger>
                  <SelectContent>
                    {equipoData.tipo_empresa === 'salmonera' 
                      ? salmoneras.map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.nombre}</SelectItem>
                        ))
                      : contratistas.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
                        ))
                    }
                  </SelectContent>
                </Select>
              </div>
            )}

            {isUserAdmin && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Empresa detectada automáticamente:</strong>{' '}
                  {userProfile?.rol === 'admin_salmonero' 
                    ? salmoneras.find(s => s.id === userProfile.salmonera_id)?.nombre
                    : contratistas.find(c => c.id === userProfile.servicio_id)?.nombre
                  }
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleStep1Submit}
                disabled={!equipoData.nombre || (!isUserAdmin && !equipoData.empresa_id)}
                className="flex-1"
              >
                Siguiente: Agregar Miembros
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Add Members */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Agregar Miembros al Equipo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                <strong>Equipo:</strong> {equipoData.nombre}
              </p>
            </div>

            {/* Add Member Form */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Agregar Nuevo Miembro</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Select onValueChange={(value) => {
                  const [usuarioId, rol] = value.split('|');
                  handleAddMember(usuarioId, rol);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar usuario y rol..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map(usuario => (
                      <optgroup key={usuario.usuario_id} label={`${usuario.nombre} ${usuario.apellido}`}>
                        <SelectItem value={`${usuario.usuario_id}|supervisor`}>
                          Como Supervisor
                        </SelectItem>
                        <SelectItem value={`${usuario.usuario_id}|buzo_principal`}>
                          Como Buzo Principal
                        </SelectItem>
                        <SelectItem value={`${usuario.usuario_id}|buzo_asistente`}>
                          Como Buzo Asistente
                        </SelectItem>
                      </optgroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Selected Members */}
            {selectedMembers.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Miembros Seleccionados ({selectedMembers.length})</h4>
                {selectedMembers.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{member.nombre_completo}</span>
                      <Badge variant="outline" className="ml-2">
                        {member.rol_equipo.replace('_', ' ')}
                      </Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveMember(index)}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => setCurrentStep(1)}
                variant="outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              <Button 
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Creando...' : 'Crear Equipo'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
