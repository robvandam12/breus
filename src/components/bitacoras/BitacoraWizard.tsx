import { useState } from 'react';
import { BitacoraFormBase } from '@/components/forms/BitacoraFormBase';
import { BitacoraWizardProgress } from '@/components/forms/BitacoraWizardProgress';
import { BitacoraFormActions } from '@/components/forms/BitacoraFormActions';
import { BitacoraStep1 } from './steps/BitacoraStep1';
import { BitacoraStep2 } from './steps/BitacoraStep2';
import { BitacoraStep4 } from './steps/BitacoraStep4';
import { BitacoraStep5 } from './steps/BitacoraStep5';
import { BitacoraSupervisorFormData } from '@/hooks/useBitacorasSupervisor';
import { FileText } from 'lucide-react';

export type BitacoraSupervisorData = BitacoraSupervisorFormData;

interface BitacoraWizardProps {
  onComplete: (data: BitacoraSupervisorFormData) => void;
  onCancel: () => void;
}

const WIZARD_STEPS = [
  { title: 'Info General' },
  { title: 'Personal' },
  { title: 'Trabajo' },
  { title: 'Validación' }
];

export const BitacoraWizard = ({ onComplete, onCancel }: BitacoraWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BitacoraSupervisorFormData>({
    codigo: `BIT-SUP-${Date.now()}`,
    inmersion_id: '',
    supervisor: '',
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

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(formData);
    } catch (error) {
      console.error('Error completing wizard:', error);
    } finally {
      setIsSubmitting(false);
    }
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
    <BitacoraFormBase
      title="Nueva Bitácora de Supervisor"
      subtitle="Registro completo de supervisión de inmersiones"
      icon={FileText}
      variant="dialog"
      isLoading={isSubmitting}
    >
      <BitacoraWizardProgress
        currentStep={currentStep}
        totalSteps={totalSteps}
        steps={WIZARD_STEPS}
        className="mb-6"
      />

      <div className="min-h-[400px]">
        {renderStep()}
      </div>

      <BitacoraFormActions
        type="wizard"
        onCancel={onCancel}
        onSubmit={handleComplete}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isLoading={isSubmitting}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === totalSteps}
        className="mt-6"
      />
    </BitacoraFormBase>
  );
};
