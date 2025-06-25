
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useContextualValidator } from '@/hooks/useContextualValidator';
import { useEnhancedValidation } from '@/hooks/useEnhancedValidation';
import { ValidationStatusIndicator } from './ValidationStatusIndicator';
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface ModularFormValidatorProps {
  operacionId?: string;
  formType: 'hpt' | 'anexo_bravo' | 'bitacora' | 'immersion';
  moduleRequired?: string;
  onValidationComplete?: (canProceed: boolean, context: any) => void;
  children?: React.ReactNode;
  showActions?: boolean;
  onProceed?: () => void;
  onCancel?: () => void;
}

const FORM_CONFIGS = {
  hpt: {
    title: 'Hoja de Planificación de Tarea (HPT)',
    icon: '📋',
    operationType: 'create_hpt',
    requiredModule: 'planning_operations',
    description: 'Documento de planificación y análisis de riesgos'
  },
  anexo_bravo: {
    title: 'Anexo Bravo - Control de Riesgos',
    icon: '🛡️',
    operationType: 'create_anexo_bravo',
    requiredModule: 'planning_operations',
    description: 'Lista de verificación de seguridad pre-inmersión'
  },
  bitacora: {
    title: 'Bitácora de Inmersión',
    icon: '📖',
    operationType: 'create_bitacora',
    requiredModule: null, // Core functionality
    description: 'Registro detallado de actividades de buceo'
  },
  immersion: {
    title: 'Nueva Inmersión',
    icon: '🤿',
    operationType: 'create_immersion',
    requiredModule: null, // Core functionality
    description: 'Registro de operación de buceo'
  }
};

export const ModularFormValidator: React.FC<ModularFormValidatorProps> = ({
  operacionId,
  formType,
  moduleRequired,
  onValidationComplete,
  children,
  showActions = true,
  onProceed,
  onCancel
}) => {
  const [canProceed, setCanProceed] = useState(false);
  const [validationContext, setValidationContext] = useState<any>(null);

  const config = FORM_CONFIGS[formType];
  const requiredModule = moduleRequired || config.requiredModule;

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
    performValidation();
  }, [operacionId, moduleActive, formType]);

  const performValidation = async () => {
    console.log(`Performing validation for ${formType}`, { operacionId, moduleActive });

    // Para funcionalidad core (bitácora, inmersión), no requiere módulos específicos
    if (!requiredModule) {
      const context = {
        canProceed: true,
        moduleActive: true, // Core siempre activo
        requiresOperacion: formType === 'bitacora',
        validationLevel: 'core'
      };
      
      setCanProceed(true);
      setValidationContext(context);
      onValidationComplete?.(true, context);
      return;
    }

    // Para funcionalidad modular, validar contexto completo
    if (!operacionId && (formType === 'hpt' || formType === 'anexo_bravo')) {
      const context = {
        canProceed: false,
        moduleActive,
        requiresOperacion: true,
        validationLevel: 'error',
        message: `${config.title} requiere una operación asociada`
      };
      
      setCanProceed(false);
      setValidationContext(context);
      onValidationComplete?.(false, context);
      return;
    }

    // Validación específica del tipo de operación
    const { success, result } = await validateWithErrorHandling(
      config.operationType,
      operacionId ? { operacion_id: operacionId } : {},
      { showToast: false }
    );

    const context = {
      canProceed: success && (result?.canProceed ?? false),
      moduleActive: result?.context?.moduleAccess?.[requiredModule?.split('_')[0]] ?? false,
      requiresOperacion: formType !== 'immersion',
      validationLevel: success ? 'success' : 'error',
      warnings: result?.warnings || [],
      errors: result?.errors || [],
      operationType: config.operationType
    };

    setCanProceed(context.canProceed);
    setValidationContext(context);
    onValidationComplete?.(context.canProceed, context);
  };

  const getStatusMessage = () => {
    if (!validationContext) return 'Validando...';
    
    if (validationContext.validationLevel === 'core') {
      return `${config.title} - Funcionalidad core disponible`;
    }
    
    if (validationContext.canProceed) {
      return `${config.title} - Validación exitosa`;
    }
    
    if (!validationContext.moduleActive && requiredModule) {
      return `${config.title} requiere módulo ${requiredModule} activo`;
    }
    
    return validationContext.message || `No se puede crear ${config.title}`;
  };

  const getStatusIcon = () => {
    if (isValidating) return <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />;
    if (!validationContext) return <AlertCircle className="h-4 w-4" />;
    
    return validationContext.canProceed 
      ? <CheckCircle className="h-4 w-4 text-green-600" />
      : <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getAlertVariant = () => {
    if (!validationContext) return 'default';
    return validationContext.canProceed ? 'default' : 'destructive';
  };

  return (
    <div className="space-y-4">
      {/* Estado de validación */}
      <Alert variant={getAlertVariant()}>
        {getStatusIcon()}
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">{config.icon} {getStatusMessage()}</span>
              <p className="text-sm text-gray-600 mt-1">{config.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={validationContext?.moduleActive ? "default" : "secondary"}>
                {requiredModule ? (validationContext?.moduleActive ? 'Módulo Activo' : 'Módulo Inactivo') : 'Core'}
              </Badge>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Indicador detallado de validación */}
      {validationContext && (
        <ValidationStatusIndicator
          isValid={validationContext.canProceed}
          canProceed={validationContext.canProceed}
          warnings={validationContext.warnings || warnings}
          errors={validationContext.errors || errors}
          moduleActive={validationContext.moduleActive}
          showDetails={true}
        />
      )}

      {/* Contenido hijo (formulario) */}
      {children}

      {/* Acciones */}
      {showActions && (
        <div className="flex justify-between pt-4 border-t">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          
          {onProceed && (
            <Button 
              disabled={!canProceed}
              onClick={onProceed}
            >
              Continuar
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
