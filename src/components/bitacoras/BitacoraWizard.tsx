
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BitacoraStep1 } from './steps/BitacoraStep1';
import { BitacoraStep2 } from './steps/BitacoraStep2';
import { BitacoraStep4 } from './steps/BitacoraStep4';
import { BitacoraStep5 } from './steps/BitacoraStep5';
import { BitacoraSupervisorFormData } from '@/hooks/useBitacorasSupervisor';

// Export the type for the step components
export type BitacoraSupervisorData = BitacoraSupervisorFormData;

interface BitacoraWizardProps {
  onComplete: (data: BitacoraSupervisorFormData) => void;
  onCancel: () => void;
}

export const BitacoraWizard = ({ onComplete, onCancel }: BitacoraWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BitacoraSupervisorFormData>({
    codigo: `BIT-SUP-${Date.now()}`,
    inmersion_id: '',
    supervisor: '',
    supervisor_id: '', // Agregado campo requerido
    desarrollo_inmersion: '',
    incidentes: '',
    evaluacion_general: '',
    fecha: new Date().toISOString().split('T')[0],
    firmado: false,
    estado_aprobacion: 'pendiente',
    fecha_inicio_faena: '',
    hora_inicio_faena: '',
    hora_termino_faena: '',
    lugar_trabajo: '',
    supervisor_nombre_matricula: '',
    estado_mar: '',
    visibilidad_fondo: 0,
    inmersiones_buzos: [],
    equipos_utilizados: [],
    trabajo_a_realizar: '',
    descripcion_trabajo: '',
    embarcacion_apoyo: '',
    observaciones_generales_texto: '',
    validacion_contratista: false,
    comentarios_validacion: '',
    diving_records: []
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(formData);
  };

  const updateFormData = (updates: Partial<BitacoraSupervisorFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BitacoraStep1 data={formData} onUpdate={updateFormData} />;
      case 2:
        return <BitacoraStep2 data={formData} onUpdate={updateFormData} />;
      case 3:
        return <BitacoraStep4 data={formData} onUpdate={updateFormData} />;
      case 4:
        return <BitacoraStep5 data={formData} onUpdate={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">
              Paso {currentStep} de {totalSteps}
            </h2>
            <span className="text-sm text-gray-500">{Math.round(progress)}% completado</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {renderStep()}

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Anterior
          </Button>

          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>

          {currentStep === totalSteps ? (
            <Button onClick={handleComplete}>
              Completar
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Siguiente
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
