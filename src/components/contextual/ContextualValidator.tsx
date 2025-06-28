
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle, Shield } from 'lucide-react';
import { useValidationContext } from '@/components/validation/ContextualValidationProvider';
import { EnterpriseSelectionResult } from '@/hooks/useEnterpriseContext';

interface ContextualValidatorProps {
  formType: string;
  formData: any;
  enterpriseContext?: EnterpriseSelectionResult;
  onValidationComplete?: (isValid: boolean) => void;
}

export const ContextualValidator: React.FC<ContextualValidatorProps> = ({
  formType,
  formData,
  enterpriseContext,
  onValidationComplete
}) => {
  const { validateWithErrorHandling } = useValidationContext();
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const result = await validateWithErrorHandling(formType, formData, enterpriseContext);
      setValidationResult(result);
      
      // El resultado tiene la estructura { success: boolean, result?: { isValid, canProceed, etc. } }
      const isValid = result.success && result.result?.isValid;
      onValidationComplete?.(isValid || false);
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const getValidationIcon = () => {
    if (!validationResult) return <Shield className="w-5 h-5 text-gray-500" />;
    if (validationResult.success && validationResult.result?.isValid) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (validationResult.result?.warnings?.length > 0) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const getValidationStatus = () => {
    if (!validationResult) return 'Pendiente';
    if (validationResult.success && validationResult.result?.isValid) return 'Válido';
    if (validationResult.result?.warnings?.length > 0) return 'Con Advertencias';
    return 'Errores Encontrados';
  };

  const getStatusColor = () => {
    if (!validationResult) return 'secondary';
    if (validationResult.success && validationResult.result?.isValid) return 'default';
    if (validationResult.result?.warnings?.length > 0) return 'outline';
    return 'destructive';
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {getValidationIcon()}
            Validación Contextual
          </div>
          <Badge variant={getStatusColor()}>
            {getValidationStatus()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Tipo: {formType.replace('_', ' ').toUpperCase()}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleValidate}
            disabled={isValidating}
          >
            {isValidating ? 'Validando...' : 'Validar'}
          </Button>
        </div>

        {validationResult && validationResult.result && (
          <div className="space-y-2">
            {validationResult.result.errors?.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-red-600">Errores:</h4>
                {validationResult.result.errors.map((error: string, index: number) => (
                  <div key={index} className="text-xs text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {error}
                  </div>
                ))}
              </div>
            )}

            {validationResult.result.warnings?.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-yellow-600">Advertencias:</h4>
                {validationResult.result.warnings.map((warning: string, index: number) => (
                  <div key={index} className="text-xs text-yellow-600 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {warning}
                  </div>
                ))}
              </div>
            )}

            {validationResult.success && validationResult.result.isValid && validationResult.result.errors?.length === 0 && (
              <div className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Validación exitosa - Todos los controles superados
              </div>
            )}
          </div>
        )}

        {enterpriseContext && (
          <div className="mt-3 p-2 bg-muted rounded-md">
            <h4 className="text-xs font-medium mb-1">Contexto Empresarial:</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Salmonera: {enterpriseContext.salmonera_id}</div>
              {enterpriseContext.contratista_id && (
                <div>Contratista: {enterpriseContext.contratista_id}</div>
              )}
              <div>Modo: {enterpriseContext.context_metadata.selection_mode}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
