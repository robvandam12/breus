
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import { UserSearchSelectEnhanced } from "@/components/usuarios/UserSearchSelectEnhanced";

interface CreateEquipoFormWizardProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const CreateEquipoFormWizard = ({ onSubmit, onCancel }: CreateEquipoFormWizardProps) => {
  const { user, profile } = useAuth();
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [equipoData, setEquipoData] = useState({
    nombre: '',
    descripcion: '',
    empresa_id: '',
    tipo_empresa: ''
  });
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);

  // Auto-detectar empresa del usuario admin
  const autoDetectEmpresa = () => {
    if (!profile) return;
    
    if (profile.role === 'admin_salmonera' && profile.salmonera_id) {
      setEquipoData(prev => ({
        ...prev,
        empresa_id: profile.salmonera_id,
        tipo_empresa: 'salmonera'
      }));
    } else if (profile.role === 'admin_servicio' && profile.servicio_id) {
      setEquipoData(prev => ({
        ...prev,
        empresa_id: profile.servicio_id,
        tipo_empresa: 'contratista'
      }));
    }
  };

  useEffect(() => {
    autoDetectEmpresa();
  }, [profile]);

  const isUserAdmin = profile?.role === 'admin_salmonera' || profile?.role === 'admin_servicio';

  const handleStep1Submit = () => {
    if (!equipoData.nombre || (!isUserAdmin && !equipoData.empresa_id)) return;
    setCurrentStep(2);
  };

  const handleAddMember = (usuarioData: any, rol: string) => {
    const member = {
      usuario_id: usuarioData.id,
      rol_equipo: rol,
      nombre_completo: `${usuarioData.nombre} ${usuarioData.apellido}`,
      email: usuarioData.email
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
      {/* Progress indicator */}
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
        <Badge variant="outline">Paso {currentStep} de 2</Badge>
      </div>

      {/* Step 1: Basic Info */}
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
                  onValueChange={(value) => setEquipoData(prev => ({ ...prev, tipo_empresa: value, empresa_id: '' }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de empresa" />
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
                    <SelectValue placeholder="Selecciona la empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipoData.tipo_empresa === 'salmonera' 
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
            )}

            {isUserAdmin && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Empresa:</strong> {profile?.role === 'admin_salmonera' 
                    ? salmoneras.find(s => s.id === profile.salmonera_id)?.nombre 
                    : contratistas.find(c => c.id === profile.servicio_id)?.nombre
                  }
                </p>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button 
                onClick={handleStep1Submit}
                disabled={!equipoData.nombre || (!isUserAdmin && !equipoData.empresa_id)}
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
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
              <Users className="w-5 h-5 text-blue-600" />
              Agregar Miembros al Equipo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <UserSearchSelectEnhanced
              onUserSelect={(user, role) => handleAddMember(user, role)}
              companyType={equipoData.tipo_empresa as 'salmonera' | 'contratista'}
              companyId={equipoData.empresa_id}
            />

            {selectedMembers.length > 0 && (
              <div className="space-y-2">
                <Label>Miembros Seleccionados ({selectedMembers.length})</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{member.nombre_completo}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                        <Badge variant="outline" className="mt-1">
                          {member.rol_equipo}
                        </Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveMember(index)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              <Button 
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
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
