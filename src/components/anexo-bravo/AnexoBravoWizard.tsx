
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Save, FileCheck, Users, Settings, CheckCircle, AlertCircle } from "lucide-react";
import { AnexoBravoStep1 } from "./steps/AnexoBravoStep1";
import { AnexoBravoStep2 } from "./steps/AnexoBravoStep2";
import { AnexoBravoStep3 } from "./steps/AnexoBravoStep3";
import { AnexoBravoStep4 } from "./steps/AnexoBravoStep4";
import { AnexoBravoStep5 } from "./steps/AnexoBravoStep5";
import { useToast } from "@/hooks/use-toast";

export interface AnexoBravoData {
  // Información General
  empresa_nombre: string;
  lugar_faena: string;
  fecha: string;
  jefe_centro_nombre: string;
  
  // Identificación del Buzo
  buzo_o_empresa_nombre: string;
  buzo_matricula: string;
  autorizacion_armada: boolean;
  asistente_buzo_nombre: string;
  asistente_buzo_matricula: string;
  
  // Chequeo de Equipos
  equipos_checklist: Array<{
    item: string;
    verificado: boolean;
    observaciones: string;
  }>;
  
  // Bitácora de Buceo
  bitacora_hora_inicio: string;
  bitacora_hora_termino: string;
  bitacora_fecha: string;
  bitacora_relator: string;
  
  // Trabajadores Participantes
  trabajadores: Array<{
    nombre: string;
    rut: string;
  }>;
  
  // Firmas
  supervisor_servicio_firma: string | null;
  supervisor_mandante_firma: string | null;
  operacion_id?: string;
}

interface AnexoBravoWizardProps {
  operacionId?: string;
  anexoId?: string;
  onComplete?: (anexoId: string) => void;
  onCancel?: () => void;
  initialData?: Partial<AnexoBravoData>;
}

export const AnexoBravoWizard = ({ 
  operacionId, 
  anexoId, 
  onComplete, 
  onCancel, 
  initialData 
}: AnexoBravoWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [data, setData] = useState<AnexoBravoData>({
    empresa_nombre: "",
    lugar_faena: "",
    fecha: new Date().toISOString().split('T')[0],
    jefe_centro_nombre: "",
    buzo_o_empresa_nombre: "",
    buzo_matricula: "",
    autorizacion_armada: false,
    asistente_buzo_nombre: "",
    asistente_buzo_matricula: "",
    equipos_checklist: [],
    bitacora_hora_inicio: "",
    bitacora_hora_termino: "",
    bitacora_fecha: new Date().toISOString().split('T')[0],
    bitacora_relator: "",
    trabajadores: [],
    supervisor_servicio_firma: null,
    supervisor_mandante_firma: null,
    operacion_id: operacionId,
    ...initialData,
  });

  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const updateData = (stepData: Partial<AnexoBravoData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const steps = [
    {
      id: 1,
      title: "Información General",
      description: "Datos básicos de la faena y centro",
      icon: FileCheck,
      isValid: !!(data.empresa_nombre && data.lugar_faena && data.jefe_centro_nombre)
    },
    {
      id: 2,
      title: "Identificación del Buzo",
      description: "Datos del buzo y asistente",
      icon: Users,
      isValid: !!(data.buzo_o_empresa_nombre && data.buzo_matricula)
    },
    {
      id: 3,
      title: "Chequeo de Equipos",
      description: "Verificación de equipos e insumos",
      icon: Settings,
      isValid: data.equipos_checklist.length > 0
    },
    {
      id: 4,
      title: "Bitácora y Participantes",
      description: "Horarios y trabajadores",
      icon: CheckCircle,
      isValid: !!(data.bitacora_relator && data.trabajadores.length > 0)
    },
    {
      id: 5,
      title: "Firmas",
      description: "Firmas de supervisores",
      icon: AlertCircle,
      isValid: !!(data.supervisor_servicio_firma && data.supervisor_mandante_firma)
    }
  ];

  const canProceedToNext = () => {
    const currentStepData = steps[currentStep - 1];
    return currentStepData.isValid;
  };

  const handleNext = () => {
    if (canProceedToNext() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "Paso incompleto",
        description: "Complete todos los campos requeridos para continuar",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceedToNext()) {
      toast({
        title: "Error",
        description: "Complete todos los campos requeridos para finalizar el anexo",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Aquí iría la lógica para enviar el anexo
      console.log('Submitting Anexo Bravo:', data);
      
      toast({
        title: "Anexo Bravo Finalizado",
        description: "El Anexo Bravo ha sido creado exitosamente",
      });

      if (onComplete) {
        onComplete(anexoId || 'new-anexo-id');
      }
    } catch (error) {
      console.error('Error submitting anexo bravo:', error);
      toast({
        title: "Error",
        description: "Error al finalizar el anexo. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <AnexoBravoStep1 data={data} onUpdate={updateData} />;
      case 2:
        return <AnexoBravoStep2 data={data} onUpdate={updateData} />;
      case 3:
        return <AnexoBravoStep3 data={data} onUpdate={updateData} />;
      case 4:
        return <AnexoBravoStep4 data={data} onUpdate={updateData} />;
      case 5:
        return <AnexoBravoStep5 data={data} onUpdate={updateData} />;
      default:
        return null;
    }
  };

  const currentStepData = steps[currentStep - 1];
  const StepIcon = currentStepData.icon;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header with Progress */}
      <Card className="mb-6 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl md:text-2xl text-gray-900">
                  Anexo Bravo - Verificación de Equipos
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Paso {currentStep} de {totalSteps}: {currentStepData.title}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {progressPercentage.toFixed(0)}% Completado
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Progreso General</span>
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-6 gap-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              const isValid = step.isValid;
              
              return (
                <div 
                  key={step.id}
                  className="flex-1 flex flex-col items-center text-center"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-green-600 text-white' :
                    isValid ? 'bg-green-100 text-green-600' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-medium ${
                    isActive ? 'text-green-600' :
                    isCompleted ? 'text-green-500' :
                    'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <StepIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900">
                {currentStepData.title}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {currentStepData.description}
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 md:p-8">
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6 gap-4">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            Cancelar
          </Button>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || isSubmitting}
            className="flex items-center gap-2 min-w-[100px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceedToNext() || isSubmitting}
              className="flex items-center gap-2 min-w-[100px] bg-green-600 hover:bg-green-700"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceedToNext() || isSubmitting}
              className="flex items-center gap-2 min-w-[120px] bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Finalizando...' : 'Finalizar Anexo'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
