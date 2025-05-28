
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, FileText } from "lucide-react";
import { HPTOperationSelector } from "./HPTOperationSelector";
import { HPTBasicInfoForm } from "./HPTBasicInfoForm";
import { HPTTaskDetailsForm } from "./HPTTaskDetailsForm";
import { HPTTeamForm } from "./HPTTeamForm";
import { HPTRisksForm } from "./HPTRisksForm";
import { HPTEquipmentForm } from "./HPTEquipmentForm";
import { HPTReviewForm } from "./HPTReviewForm";
import { useHPT } from "@/hooks/useHPT";
import { toast } from "@/hooks/use-toast";

interface HPTWizardProps {
  operacionId?: string;
  onComplete: () => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 'operation', title: 'Operación', component: 'operation' },
  { id: 'basic', title: 'Información Básica', component: 'basic' },
  { id: 'task', title: 'Detalles de Tarea', component: 'task' },
  { id: 'team', title: 'Equipo', component: 'team' },
  { id: 'risks', title: 'Riesgos', component: 'risks' },
  { id: 'equipment', title: 'Equipos', component: 'equipment' },
  { id: 'review', title: 'Revisión', component: 'review' }
];

export const HPTWizard = ({ operacionId: initialOperacionId, onComplete, onCancel }: HPTWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [operacionData, setOperacionData] = useState<any>(null);
  const { createHPT, isCreating } = useHPT();

  // Si viene con operacionId, saltar el primer paso
  useEffect(() => {
    if (initialOperacionId) {
      setCurrentStep(1);
      setFormData(prev => ({ ...prev, operacion_id: initialOperacionId }));
    }
  }, [initialOperacionId]);

  const handleOperacionSelected = (operacion: any) => {
    setOperacionData(operacion);
    setFormData(prev => ({
      ...prev,
      operacion_id: operacion.id,
      // Autopopular campos basados en la operación
      codigo: `HPT-${operacion.codigo}-${new Date().getFullYear()}`,
      fecha: new Date().toISOString().split('T')[0],
      lugar_especifico: operacion.sitio || '',
      descripcion_tarea: operacion.tareas || '',
      centro_trabajo_nombre: operacion.salmonera || '',
      supervisor_nombre: '', // Se llenará en el siguiente paso
      empresa_servicio_nombre: operacion.contratista || ''
    }));
  };

  const handleStepChange = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const hptData = {
        ...formData,
        progreso: 100,
        estado: 'completado'
      };

      await createHPT(hptData);
      
      toast({
        title: "HPT creado exitosamente",
        description: "El HPT ha sido guardado correctamente.",
      });
      
      onComplete();
    } catch (error) {
      console.error('Error creating HPT:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el HPT. Intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  const getCurrentStepComponent = () => {
    const step = STEPS[currentStep];
    
    switch (step.component) {
      case 'operation':
        return (
          <HPTOperationSelector
            onOperacionSelected={handleOperacionSelected}
            selectedOperacionId={formData.operacion_id}
          />
        );
      case 'basic':
        return (
          <HPTBasicInfoForm
            data={formData}
            operacionData={operacionData}
            onChange={handleStepChange}
          />
        );
      case 'task':
        return (
          <HPTTaskDetailsForm
            data={formData}
            operacionData={operacionData}
            onChange={handleStepChange}
          />
        );
      case 'team':
        return (
          <HPTTeamForm
            data={formData}
            operacionData={operacionData}
            onChange={handleStepChange}
          />
        );
      case 'risks':
        return (
          <HPTRisksForm
            data={formData}
            onChange={handleStepChange}
          />
        );
      case 'equipment':
        return (
          <HPTEquipmentForm
            data={formData}
            onChange={handleStepChange}
          />
        );
      case 'review':
        return (
          <HPTReviewForm
            data={formData}
            operacionData={operacionData}
            onChange={handleStepChange}
          />
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (STEPS[currentStep].component) {
      case 'operation':
        return !!formData.operacion_id;
      case 'basic':
        return !!(formData.supervisor_nombre && formData.codigo);
      default:
        return true;
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Crear Nueva HPT</h1>
              <p className="text-sm text-gray-600">Paso {currentStep + 1} de {STEPS.length}: {STEPS[currentStep].title}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onCancel} className="text-gray-600">
            Cancelar
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progreso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {getCurrentStepComponent()}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 p-6">
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="flex gap-3">
            {currentStep === STEPS.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isCreating || !canProceed()}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isCreating ? 'Guardando...' : 'Crear HPT'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
