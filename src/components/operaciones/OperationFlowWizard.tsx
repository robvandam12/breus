
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  AlertTriangle
} from "lucide-react";

interface FlowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'active' | 'pending';
  required: boolean;
}

interface OperationFlowWizardProps {
  operacionId?: string;
  onStepChange?: (stepId: string) => void;
}

export const OperationFlowWizard = ({ operacionId, onStepChange }: OperationFlowWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: FlowStep[] = [
    {
      id: 'operacion',
      title: 'Crear Operación',
      description: 'Información básica de la operación',
      icon: <FileText className="w-5 h-5" />,
      status: operacionId ? 'completed' : 'active',
      required: true
    },
    {
      id: 'sitio',
      title: 'Definir Sitio',
      description: 'Ubicación y coordenadas',
      icon: <MapPin className="w-5 h-5" />,
      status: operacionId ? 'completed' : 'pending',
      required: true
    },
    {
      id: 'equipo',
      title: 'Asignar Equipo',
      description: 'Personal y roles',
      icon: <Users className="w-5 h-5" />,
      status: 'pending',
      required: true
    },
    {
      id: 'hpt',
      title: 'HPT',
      description: 'Herramientas y Procedimientos',
      icon: <Settings className="w-5 h-5" />,
      status: 'pending',
      required: true
    },
    {
      id: 'anexo-bravo',
      title: 'Anexo Bravo',
      description: 'Análisis de Seguridad',
      icon: <Shield className="w-5 h-5" />,
      status: 'pending',
      required: true
    },
    {
      id: 'inmersiones',
      title: 'Planificar Inmersiones',
      description: 'Cronograma de inmersiones',
      icon: <Circle className="w-5 h-5" />,
      status: 'pending',
      required: false
    }
  ];

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.length;
  const progress = (completedSteps / totalSteps) * 100;

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

  const getStepIcon = (step: FlowStep) => {
    if (step.status === 'completed') {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
    return step.icon;
  };

  const getStepBadge = (step: FlowStep) => {
    switch (step.status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completado</Badge>;
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800">En Progreso</Badge>;
      case 'pending':
        return step.required ? 
          <Badge className="bg-gray-100 text-gray-800">Pendiente</Badge> :
          <Badge className="bg-yellow-100 text-yellow-800">Opcional</Badge>;
      default:
        return null;
    }
  };

  return (
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
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.status === 'completed' 
                  ? 'bg-green-100' 
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
          
          <Button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className="flex items-center gap-2"
          >
            Siguiente
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Alertas */}
        {steps.some(step => step.required && step.status === 'pending') && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <p className="text-sm text-amber-800">
                Hay pasos obligatorios pendientes que deben completarse antes de iniciar la operación.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
