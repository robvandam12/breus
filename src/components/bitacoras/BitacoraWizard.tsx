
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { BitacoraStep1 } from "./steps/BitacoraStep1";
import { BitacoraStep2 } from "./steps/BitacoraStep2";
import { BitacoraStep4 } from "./steps/BitacoraStep4";
import { BitacoraStep5 } from "./steps/BitacoraStep5";
import { BitacoraSupervisorFormData } from "@/hooks/useBitacoras";

export interface BitacoraSupervisorData extends BitacoraSupervisorFormData {
  // Interface that extends the form data with additional wizard-specific properties
}

interface BitacoraWizardProps {
  onSubmit: (data: BitacoraSupervisorData) => void;
  onCancel: () => void;
}

export const BitacoraWizard = ({ onSubmit, onCancel }: BitacoraWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<BitacoraSupervisorData>({
    codigo: `BIT-SUP-${Date.now()}`,
    inmersion_id: '',
    supervisor: '',
    desarrollo_inmersion: '',
    incidentes: '',
    evaluacion_general: '',
    fecha: new Date().toISOString().split('T')[0],
    // Initialize additional fields
    fecha_inicio_faena: new Date().toISOString().split('T')[0],
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

  const steps = [
    { id: 1, title: "Información General", component: BitacoraStep1 },
    { id: 2, title: "Registro de Inmersión", component: BitacoraStep2 },
    { id: 4, title: "Datos Técnicos", component: BitacoraStep4 },
    { id: 5, title: "Cierre y Validación", component: BitacoraStep5 }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);
  const CurrentStepComponent = currentStepData?.component;

  const updateData = (updates: Partial<BitacoraSupervisorData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      const nextStepIndex = steps.findIndex(step => step.id === currentStep) + 1;
      if (nextStepIndex < steps.length) {
        setCurrentStep(steps[nextStepIndex].id);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      const currentStepIndex = steps.findIndex(step => step.id === currentStep);
      if (currentStepIndex > 0) {
        setCurrentStep(steps[currentStepIndex - 1].id);
      }
    }
  };

  const handleSubmit = () => {
    onSubmit(data);
  };

  const progress = (steps.findIndex(step => step.id === currentStep) + 1) / steps.length * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nueva Bitácora de Supervisor</h1>
            <p className="text-gray-600">Paso {steps.findIndex(step => step.id === currentStep) + 1} de {steps.length}: {currentStepData?.title}</p>
          </div>
        </div>
        
        <Progress value={progress} className="h-2" />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 min-h-[500px]">
        {CurrentStepComponent && (
          <CurrentStepComponent data={data} onUpdate={updateData} />
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onCancel : prevStep}
          className="flex items-center gap-2"
        >
          {currentStep === 1 ? (
            "Cancelar"
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </>
          )}
        </Button>

        <Button
          onClick={currentStep === steps[steps.length - 1].id ? handleSubmit : nextStep}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
        >
          {currentStep === steps[steps.length - 1].id ? (
            "Crear Bitácora"
          ) : (
            <>
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
