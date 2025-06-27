
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Users, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface CreateCuadrillaFormWizardProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const CreateCuadrillaFormWizard = ({ onSubmit, onCancel }: CreateCuadrillaFormWizardProps) => {
  const { profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    empresa_id: profile?.salmonera_id || profile?.servicio_id || '',
    tipo_empresa: profile?.salmonera_id ? 'salmonera' : 'contratista'
  });

  const [members, setMembers] = useState<any[]>([]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      cuadrillaData: formData,
      members: members
    });
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.nombre.trim() !== '' && formData.empresa_id !== '';
    }
    return true;
  };

  const renderStep1 = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Información de la Cuadrilla
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="nombre">Nombre de la Cuadrilla *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => handleInputChange('nombre', e.target.value)}
            placeholder="Ej: Cuadrilla Alpha"
            required
          />
        </div>

        <div>
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            value={formData.descripcion}
            onChange={(e) => handleInputChange('descripcion', e.target.value)}
            placeholder="Descripción de la cuadrilla..."
            rows={3}
          />
        </div>

        {profile?.role === 'superuser' && (
          <div>
            <Label htmlFor="tipo_empresa">Tipo de Empresa *</Label>
            <Select
              value={formData.tipo_empresa}
              onValueChange={(value) => handleInputChange('tipo_empresa', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salmonera">Salmonera</SelectItem>
                <SelectItem value="contratista">Contratista</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">¿Qué es una Cuadrilla de Buceo?</h4>
              <p className="text-sm text-blue-700 mt-1">
                Una cuadrilla es un grupo de personal especializado en buceo que trabaja en conjunto.
                Incluye supervisores, buzos principales, buzos asistentes y personal de emergencia.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-green-600" />
          Miembros de la Cuadrilla (Opcional)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-8">
          <Users className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 mb-2">Agregar Miembros</h3>
          <p className="text-zinc-500 mb-4">
            Puede agregar miembros ahora o después de crear la cuadrilla
          </p>
          <Button variant="outline" disabled>
            <Users className="w-4 h-4 mr-2" />
            Agregar Miembros (Próximamente)
          </Button>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900">Gestión de Miembros</h4>
              <p className="text-sm text-green-700 mt-1">
                Después de crear la cuadrilla, podrá agregar miembros desde la vista principal.
                Cada miembro tendrá un rol específico (supervisor, buzo principal, etc.).
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        {[1, 2].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-200 text-zinc-500'
              }`}
            >
              {step}
            </div>
            {step < 2 && (
              <ChevronRight className="w-4 h-4 text-zinc-400 mx-2" />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <div>
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrevious}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          
          {currentStep < 2 ? (
            <Button 
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700"
            >
              Crear Cuadrilla
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
