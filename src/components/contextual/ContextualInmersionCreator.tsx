
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Plus, Zap } from "lucide-react";
import { useContextualValidator } from '@/hooks/useContextualValidator';
import { ContextualOperationBadge } from './ContextualOperationBadge';

interface ContextualInmersionCreatorProps {
  operacionId: string;
  onCreateInmersion: (operacionId: string) => void;
  disabled?: boolean;
}

export const ContextualInmersionCreator = ({
  operacionId,
  onCreateInmersion,
  disabled = false
}: ContextualInmersionCreatorProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const { 
    validationState, 
    validateForInmersion, 
    isValid, 
    isOperativaDirecta, 
    warnings, 
    errors 
  } = useContextualValidator(operacionId);

  const handleCreateInmersion = async () => {
    setIsValidating(true);
    try {
      const result = await validateForInmersion(operacionId);
      
      if (result.isValid) {
        onCreateInmersion(operacionId);
      }
    } catch (error) {
      console.error('Error validating for immersion creation:', error);
    } finally {
      setIsValidating(false);
    }
  );

  const canCreate = isValid && !disabled;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Crear Nueva Inmersión</span>
          <ContextualOperationBadge operacionId={operacionId} />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Estado de validación */}
        {validationState.isValidating && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Validando contexto operacional...
            </AlertDescription>
          </Alert>
        )}

        {/* Advertencias */}
        {warnings.length > 0 && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              <div className="space-y-1">
                {warnings.map((warning, index) => (
                  <div key={index} className="text-yellow-800">• {warning}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Errores */}
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                {errors.map((error, index) => (
                  <div key={index}>• {error}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Información contextual */}
        {isOperativaDirecta && (
          <Alert className="border-green-200 bg-green-50">
            <Zap className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Esta es una operación directa. No requiere validación documental previa.
            </AlertDescription>
          </Alert>
        )}

        {/* Botón de crear */}
        <Button 
          onClick={handleCreateInmersion}
          disabled={!canCreate || isValidating}
          className="w-full"
          size="lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isValidating ? 'Validando...' : 'Crear Inmersión'}
        </Button>

        {/* Estado final */}
        {canCreate && (
          <div className="text-center text-sm text-green-600 flex items-center justify-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Listo para crear inmersión
          </div>
        )}
      </CardContent>
    </Card>
  );
};
