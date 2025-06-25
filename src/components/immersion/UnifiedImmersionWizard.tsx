
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useOperationalFlow } from '@/contexts/OperationalFlowContext';
import { InmersionWizard } from './InmersionWizard';

interface UnifiedImmersionWizardProps {
  operationId?: string;
  onComplete: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  mode?: 'create' | 'edit' | 'view';
}

export const UnifiedImmersionWizard = ({
  operationId,
  onComplete,
  onCancel,
  initialData,
  mode = 'create'
}: UnifiedImmersionWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [validationResult, setValidationResult] = useState<any>(null);
  
  const {
    validateOperationFlow,
    operationalMode,
    canCreateDirectImmersion,
    getRequiredDocuments
  } = useOperationalFlow();

  useEffect(() => {
    // Validar el flujo según el contexto
    const validation = validateOperationFlow('create_immersion');
    setValidationResult(validation);
  }, [validateOperationFlow]);

  const steps = [
    { id: 1, title: 'Validación de Contexto', description: 'Verificar permisos y requerimientos' },
    { id: 2, title: 'Información de Inmersión', description: 'Datos básicos de la inmersión' },
    { id: 3, title: 'Confirmación', description: 'Revisar y confirmar datos' }
  ];

  const renderValidationStep = () => {
    if (!validationResult) return <div>Cargando validación...</div>;

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Validación de Contexto Operativo</h3>
          <Badge className={validationResult.canProceed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
            Modo: {operationalMode.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Requerimientos faltantes */}
        {validationResult.missingRequirements.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Requerimientos no cumplidos:</p>
                <ul className="list-disc list-inside space-y-1">
                  {validationResult.missingRequirements.map((req: string, index: number) => (
                    <li key={index} className="text-sm">{req}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Advertencias */}
        {validationResult.warnings.length > 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Advertencias:</p>
                <ul className="list-disc list-inside space-y-1">
                  {validationResult.warnings.map((warning: string, index: number) => (
                    <li key={index} className="text-sm">{warning}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Próximos pasos */}
        {validationResult.nextSteps.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Próximos pasos:</h4>
            <ol className="list-decimal list-inside space-y-1">
              {validationResult.nextSteps.map((step: string, index: number) => (
                <li key={index} className="text-sm text-blue-700">{step}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Documentos requeridos */}
        {operationId && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Documentos requeridos para esta operación:</h4>
            <div className="flex flex-wrap gap-2">
              {getRequiredDocuments('planned_operation').map((doc) => (
                <Badge key={doc} variant="outline">{doc}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderValidationStep();
      case 2:
        return (
          <InmersionWizard
            operationId={operationId}
            onComplete={onComplete}
            onCancel={onCancel}
            initialData={initialData}
            readOnly={mode === 'view'}
            showOperationSelector={!operationId && canCreateDirectImmersion()}
          />
        );
      case 3:
        return (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Inmersión configurada correctamente</h3>
            <p className="text-gray-600 mt-2">Los datos han sido validados y están listos para ser guardados.</p>
          </div>
        );
      default:
        return <div>Paso no encontrado</div>;
    }
  };

  const canProceedToNext = () => {
    if (currentStep === 1) {
      return validationResult?.canProceed || false;
    }
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {mode === 'view' ? 'Ver Inmersión' : mode === 'edit' ? 'Editar Inmersión' : 'Nueva Inmersión'}
        </h1>
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          {mode === 'view' ? 'Cerrar' : 'Cancelar'}
        </Button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <Progress value={(currentStep / steps.length) * 100} />
        <div className="flex justify-between text-sm text-gray-600">
          {steps.map((step) => (
            <span 
              key={step.id} 
              className={currentStep >= step.id ? 'text-blue-600 font-medium' : ''}
            >
              {step.title}
            </span>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
          <p className="text-sm text-gray-600">{steps[currentStep - 1]?.description}</p>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      {mode !== 'view' && currentStep !== 2 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 1}
          >
            Anterior
          </Button>
          
          <Button
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={!canProceedToNext() || currentStep === steps.length}
          >
            {currentStep === steps.length ? 'Finalizar' : 'Siguiente'}
          </Button>
        </div>
      )}
    </div>
  );
};
