
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  Circle, 
  FileText, 
  Shield, 
  Settings, 
  Users, 
  MapPin,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Play
} from "lucide-react";
import { CreateOperacionForm } from "./CreateOperacionForm";
import { ValidationGateway } from "./ValidationGateway";
import { useOperaciones } from "@/hooks/useOperaciones";
import { toast } from "@/hooks/use-toast";

interface FlowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'active' | 'pending' | 'error';
  required: boolean;
  component?: React.ComponentType<any>;
}

interface OperationFlowWizardProps {
  operacionId?: string;
  onStepChange?: (stepId: string) => void;
  onComplete?: () => void;
}

export const OperationFlowWizard = ({ operacionId, onStepChange, onComplete }: OperationFlowWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [operacionData, setOperacionData] = useState<any>(null);
  const [validationData, setValidationData] = useState<any>(null);
  const { validateOperacionCompleteness } = useOperaciones();

  const steps: FlowStep[] = [
    {
      id: 'operacion',
      title: 'Crear Operación',
      description: 'Información básica de la operación',
      icon: <FileText className="w-5 h-5" />,
      status: operacionId ? 'completed' : 'active',
      required: true,
      component: CreateOperacionForm
    },
    {
      id: 'sitio',
      title: 'Definir Sitio',
      description: 'Ubicación y coordenadas',
      icon: <MapPin className="w-5 h-5" />,
      status: operacionId && operacionData?.sitio_id ? 'completed' : 'pending',
      required: true
    },
    {
      id: 'equipo',
      title: 'Asignar Equipo',
      description: 'Personal y roles',
      icon: <Users className="w-5 h-5" />,
      status: operacionId && operacionData?.equipo_buceo_id ? 'completed' : 'pending',
      required: true
    },
    {
      id: 'hpt',
      title: 'HPT',
      description: 'Herramientas y Procedimientos',
      icon: <Settings className="w-5 h-5" />,
      status: validationData?.hptReady ? 'completed' : 'pending',
      required: true
    },
    {
      id: 'anexo-bravo',
      title: 'Anexo Bravo',
      description: 'Análisis de Seguridad',
      icon: <Shield className="w-5 h-5" />,
      status: validationData?.anexoBravoReady ? 'completed' : 'pending',
      required: true
    },
    {
      id: 'validation',
      title: 'Validación Final',
      description: 'Verificar todo está listo',
      icon: <CheckCircle2 className="w-5 h-5" />,
      status: validationData?.canExecute ? 'completed' : 'pending',
      required: true,
      component: ValidationGateway
    }
  ];

  useEffect(() => {
    if (operacionId) {
      loadOperacionData();
    }
  }, [operacionId]);

  const loadOperacionData = async () => {
    try {
      // Cargar datos de la operación
      // En una implementación real, esto vendría de un hook específico
      const validation = await validateOperacionCompleteness(operacionId!);
      setValidationData(validation);
      
      // Mock de datos de operación - en realidad vendría de la BD
      setOperacionData({
        sitio_id: true, // Mock
        equipo_buceo_id: true, // Mock
      });
    } catch (error) {
      console.error('Error loading operation data:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información de la operación",
        variant: "destructive",
      });
    }
  };

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.length;
  const progress = (completedSteps / totalSteps) * 100;
  const canProceed = validationData?.canExecute || false;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(steps[nextStep].id);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(steps[prevStep].id);
    }
  };

  const handleStepClick = (index: number) => {
    // Solo permitir navegar a pasos completados o el siguiente paso activo
    if (steps[index].status === 'completed' || index <= currentStep + 1) {
      setCurrentStep(index);
      onStepChange?.(steps[index].id);
    }
  };

  const handleOperacionCreated = (newOperacionId: string) => {
    setOperacionData({ id: newOperacionId });
    steps[0].status = 'completed';
    toast({
      title: "Operación creada",
      description: "Avanzando al siguiente paso...",
    });
    setTimeout(() => handleNext(), 1000);
  };

  const handleValidationComplete = () => {
    steps[currentStep].status = 'completed';
    toast({
      title: "Validación completada",
      description: "La operación está lista para ejecutarse",
    });
    onComplete?.();
  };

  const getStepIcon = (step: FlowStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return step.icon;
    }
  };

  const getStepBadge = (step: FlowStep) => {
    switch (step.status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completado</Badge>;
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800">En Progreso</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'pending':
        return step.required ? 
          <Badge className="bg-gray-100 text-gray-800">Pendiente</Badge> :
          <Badge className="bg-yellow-100 text-yellow-800">Opcional</Badge>;
      default:
        return null;
    }
  };

  const renderStepContent = () => {
    const currentStepData = steps[currentStep];
    
    if (currentStepData.component) {
      const Component = currentStepData.component;
      
      if (currentStepData.id === 'operacion') {
        return (
          <Component 
            onClose={handleOperacionCreated}
            onSuccess={handleOperacionCreated}
          />
        );
      }
      
      if (currentStepData.id === 'validation') {
        return (
          <Component 
            operacionId={operacionId || operacionData?.id || ''}
            onValidationComplete={handleValidationComplete}
          />
        );
      }
      
      return <Component />;
    }

    // Contenido por defecto para pasos sin componente específico
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
          {currentStepData.icon}
        </div>
        <h3 className="text-lg font-medium mb-2">{currentStepData.title}</h3>
        <p className="text-gray-600 mb-6">{currentStepData.description}</p>
        <Button onClick={handleNext} disabled={currentStep === steps.length - 1}>
          Continuar
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Flujo de Creación de Operación
            </div>
            <div className="text-sm text-gray-600">
              {completedSteps} de {totalSteps} completados
            </div>
          </CardTitle>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Lista de Pasos */}
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer ${
                  index === currentStep 
                    ? 'border-blue-500 bg-blue-50' 
                    : step.status === 'completed'
                    ? 'border-green-200 bg-green-50'
                    : step.status === 'error'
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleStepClick(index)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.status === 'completed' 
                    ? 'bg-green-100' 
                    : step.status === 'error'
                    ? 'bg-red-100'
                    : index === currentStep
                    ? 'bg-blue-100'
                    : 'bg-gray-100'
                }`}>
                  {getStepIcon(step)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{step.title}</h4>
                    {getStepBadge(step)}
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>

                {step.required && step.status === 'pending' && (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
              </div>
            ))}
          </div>

          {/* Navegación */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>
            
            {currentStep === steps.length - 1 && canProceed ? (
              <Button
                onClick={handleValidationComplete}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4" />
                Iniciar Operación
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentStep === steps.length - 1}
                className="flex items-center gap-2"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Alertas */}
          {steps.some(step => step.required && step.status === 'pending') && (
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                Hay pasos obligatorios pendientes que deben completarse antes de iniciar la operación.
              </AlertDescription>
            </Alert>
          )}

          {canProceed && (
            <Alert>
              <CheckCircle2 className="w-4 h-4" />
              <AlertDescription>
                ¡Excelente! La operación está lista para ejecutarse. Todos los requisitos han sido cumplidos.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Contenido del paso actual */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
};
