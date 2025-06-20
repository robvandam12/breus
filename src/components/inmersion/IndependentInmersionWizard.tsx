import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useContextualValidation } from "@/hooks/useContextualValidation";
import { useModuleAccess } from "@/hooks/useModuleAccess";
import { InmersionOperationSelector } from "./InmersionOperationSelector";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface IndependentInmersionWizardProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
  operationId?: string;
}

export const IndependentInmersionWizard = ({ 
  onComplete, 
  onCancel, 
  operationId 
}: IndependentInmersionWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  const { validateInmersionCreation } = useContextualValidation();
  const { canPlanOperations, isModuleActive, modules } = useModuleAccess();

  // Validar contexto al cargar
  useEffect(() => {
    validateContext();
  }, [formData.operacion_id]);

  const validateContext = async () => {
    setIsValidating(true);
    try {
      const result = await validateInmersionCreation(formData);
      setValidationResult(result);
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleStepData = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!validationResult?.canProceed) {
      toast({
        title: "No se puede completar",
        description: "Hay errores que impiden crear la inmersión",
        variant: "destructive",
      });
      return;
    }

    // Generar código si no existe
    if (!formData.codigo) {
      const timestamp = Date.now().toString().slice(-6);
      formData.codigo = `INM-${timestamp}`;
    }

    onComplete(formData);
  };

  // Determinar pasos según módulos activos
  const getSteps = () => {
    const baseSteps = [
      {
        title: "Información Básica",
        component: <InmersionBasicInfo onUpdate={handleStepData} data={formData} />
      },
      {
        title: "Personal",
        component: <InmersionPersonalInfo onUpdate={handleStepData} data={formData} />
      },
      {
        title: "Condiciones",
        component: <InmersionConditionsInfo onUpdate={handleStepData} data={formData} />
      }
    ];

    // Si tiene módulo de planificación, agregar selector de operación
    if (canPlanOperations) {
      baseSteps.unshift({
        title: "Operación",
        component: (
          <InmersionOperationSelector
            onOperacionSelected={(id) => handleStepData({ operacion_id: id })}
            selectedOperacionId={formData.operacion_id || operationId}
          />
        )
      });
    }

    return baseSteps;
  };

  const steps = getSteps();
  const currentStepData = steps[currentStep];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Contexto de Validación */}
      {validationResult && (
        <Card className={`border-2 ${
          validationResult.canProceed 
            ? 'border-green-200 bg-green-50' 
            : 'border-yellow-200 bg-yellow-50'
        }`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              {validationResult.canProceed ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              )}
              Estado de Validación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Contexto Modular */}
            <div className="text-sm">
              <strong>Contexto:</strong> {
                canPlanOperations 
                  ? 'Módulo de Planificación Activo - Validaciones completas'
                  : 'Modo Independiente - Creación directa permitida'
              }
            </div>

            {/* Advertencias */}
            {validationResult.warnings.length > 0 && (
              <div className="space-y-1">
                <strong className="text-sm text-yellow-700">Advertencias:</strong>
                {validationResult.warnings.map((warning: string, index: number) => (
                  <Alert key={index} className="border-yellow-200 bg-yellow-50 py-2">
                    <AlertDescription className="text-yellow-800 text-sm">
                      {warning}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            {/* Errores */}
            {validationResult.errors.length > 0 && (
              <div className="space-y-1">
                <strong className="text-sm text-red-700">Errores:</strong>
                {validationResult.errors.map((error: string, index: number) => (
                  <Alert key={index} className="border-red-200 bg-red-50 py-2">
                    <AlertDescription className="text-red-800 text-sm">
                      {error}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Progreso */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Paso {currentStep + 1} de {steps.length}: {currentStepData.title}
            </CardTitle>
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentStep
                      ? 'bg-blue-600'
                      : index < currentStep
                      ? 'bg-green-600'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentStepData.component}
        </CardContent>
      </Card>

      {/* Navegación */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          {currentStep > 0 && (
            <Button variant="outline" onClick={handlePrevious}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
          )}
        </div>
        <div>
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              disabled={!validationResult?.canProceed || isValidating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isValidating ? 'Validando...' : 'Crear Inmersión'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Componentes de pasos simplificados
const InmersionBasicInfo = ({ onUpdate, data }: any) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="codigo">Código de Inmersión</Label>
        <Input
          id="codigo"
          placeholder="Código único de la inmersión"
          value={data.codigo || ''}
          onChange={(e) => onUpdate({ codigo: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="fecha_inmersion">Fecha de Inmersión</Label>
        <Input
          id="fecha_inmersion"
          type="date"
          value={data.fecha_inmersion || ''}
          onChange={(e) => onUpdate({ fecha_inmersion: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <Input
          id="descripcion"
          placeholder="Descripción de la inmersión"
          value={data.descripcion || ''}
          onChange={(e) => onUpdate({ descripcion: e.target.value })}
        />
      </div>
    </div>
  );
};

const InmersionPersonalInfo = ({ onUpdate, data }: any) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="buzo_principal">Buzo Principal</Label>
        <Input
          id="buzo_principal"
          placeholder="Nombre del buzo principal"
          value={data.buzo_principal || ''}
          onChange={(e) => onUpdate({ buzo_principal: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="buzo_asistente">Buzo Asistente</Label>
        <Input
          id="buzo_asistente"
          placeholder="Nombre del buzo asistente"
          value={data.buzo_asistente || ''}
          onChange={(e) => onUpdate({ buzo_asistente: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="supervisor">Supervisor</Label>
        <Input
          id="supervisor"
          placeholder="Nombre del supervisor"
          value={data.supervisor || ''}
          onChange={(e) => onUpdate({ supervisor: e.target.value })}
        />
      </div>
    </div>
  );
};

const InmersionConditionsInfo = ({ onUpdate, data }: any) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="profundidad_maxima">Profundidad Máxima (metros)</Label>
        <Input
          id="profundidad_maxima"
          type="number"
          placeholder="Profundidad máxima alcanzada"
          value={data.profundidad_maxima || ''}
          onChange={(e) => onUpdate({ profundidad_maxima: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="tiempo_fondo">Tiempo en el Fondo (minutos)</Label>
        <Input
          id="tiempo_fondo"
          type="number"
          placeholder="Tiempo total en el fondo"
          value={data.tiempo_fondo || ''}
          onChange={(e) => onUpdate({ tiempo_fondo: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="visibilidad">Visibilidad (metros)</Label>
        <Input
          id="visibilidad"
          type="number"
          placeholder="Visibilidad durante la inmersión"
          value={data.visibilidad || ''}
          onChange={(e) => onUpdate({ visibilidad: e.target.value })}
        />
      </div>
    </div>
  );
};
