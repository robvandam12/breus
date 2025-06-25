
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useContextualValidator } from '@/hooks/useContextualValidator';
import { useEnhancedValidation } from '@/hooks/useEnhancedValidation';
import { ValidationStatusIndicator } from '@/components/validation/ValidationStatusIndicator';
import { AlertCircle, FileText, CheckCircle } from "lucide-react";

interface HPTContextualFormProps {
  operacionId?: string;
  hptId?: string;
  onComplete?: (hptId: string) => void;
  onCancel?: () => void;
}

export const HPTContextualForm: React.FC<HPTContextualFormProps> = ({
  operacionId,
  hptId,
  onComplete,
  onCancel
}) => {
  const [canProceed, setCanProceed] = useState(false);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);

  // Usar validación contextual
  const { 
    isValid: operationIsValid, 
    canProceed: operationCanProceed,
    moduleActive,
    warnings,
    errors,
    isValidating
  } = useContextualValidator(operacionId);

  const { validateWithErrorHandling } = useEnhancedValidation();

  useEffect(() => {
    validateHPTContext();
  }, [operacionId, moduleActive]);

  const validateHPTContext = async () => {
    if (!operacionId) {
      setValidationMessages(['Se requiere una operación para crear HPT']);
      setCanProceed(false);
      return;
    }

    // Validación específica para HPT
    const { success, result } = await validateWithErrorHandling(
      'create_hpt',
      { operacion_id: operacionId },
      { showToast: false }
    );

    if (!success || !result?.canProceed) {
      setValidationMessages(result?.errors || ['No se puede crear HPT']);
      setCanProceed(false);
    } else {
      setValidationMessages(result.warnings || []);
      setCanProceed(true);
    }
  };

  const getContextualInfo = () => {
    if (!moduleActive) {
      return {
        type: 'core-mode',
        message: 'HPT requiere módulo de planificación activo',
        variant: 'destructive' as const,
        canCreate: false
      };
    }

    if (operationCanProceed) {
      return {
        type: 'ready',
        message: 'Operación validada - Listo para crear HPT',
        variant: 'default' as const,
        canCreate: true
      };
    }

    return {
      type: 'validation-pending',
      message: 'Validando contexto operacional...',
      variant: 'default' as const,
      canCreate: false
    };
  };

  const contextInfo = getContextualInfo();

  if (isValidating) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Validando contexto operacional...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Información contextual */}
      <Alert variant={contextInfo.variant}>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span>{contextInfo.message}</span>
            <div className="flex items-center gap-2">
              <Badge variant={moduleActive ? "default" : "secondary"}>
                {moduleActive ? 'Planning Activo' : 'Modo Core'}
              </Badge>
              {contextInfo.canCreate && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Indicador de estado de validación */}
      <ValidationStatusIndicator
        isValid={operationIsValid}
        canProceed={operationCanProceed}
        warnings={warnings}
        errors={errors}
        moduleActive={moduleActive}
        showDetails={true}
      />

      {/* Mensajes de validación adicionales */}
      {validationMessages.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {validationMessages.map((message, index) => (
                <div key={index}>• {message}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Acciones */}
      <Card>
        <CardHeader>
          <CardTitle>Hoja de Planificación de Tarea (HPT)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              {contextInfo.canCreate 
                ? 'El contexto operacional permite crear el HPT. Procede con el formulario completo.'
                : 'No es posible crear HPT en el contexto actual. Revisa los requisitos.'}
            </p>
            
            <div className="flex justify-between">
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
              
              <Button 
                disabled={!canProceed || !contextInfo.canCreate}
                onClick={() => {
                  // Aquí se abriría el wizard completo
                  console.log('Opening full HPT wizard with validation context');
                }}
              >
                {hptId ? 'Continuar Editando' : 'Crear HPT'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
