
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { useOperationalContext } from '@/hooks/useOperationalContext';

interface ContextualValidatorProps {
  operationType: string;
  onProceed?: () => void;
  onCancel?: () => void;
  showActions?: boolean;
}

export const ContextualValidator: React.FC<ContextualValidatorProps> = ({
  operationType,
  onProceed,
  onCancel,
  showActions = true
}) => {
  const { validateOperationDependencies } = useOperationalContext();
  
  const validation = validateOperationDependencies(operationType);

  if (validation.canProceed && validation.missingRequirements.length === 0 && validation.warnings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Requerimientos faltantes */}
      {validation.missingRequirements.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">No puedes realizar esta acción:</p>
              <ul className="list-disc list-inside space-y-1">
                {validation.missingRequirements.map((req, index) => (
                  <li key={index} className="text-sm">{req}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Advertencias */}
      {validation.warnings.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Información importante:</p>
              <ul className="list-disc list-inside space-y-1">
                {validation.warnings.map((warning, index) => (
                  <li key={index} className="text-sm">{warning}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Estado de validación */}
      <div className="flex items-center gap-2">
        <Badge className={validation.canProceed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
          {validation.canProceed ? (
            <CheckCircle className="w-3 h-3 mr-1" />
          ) : (
            <X className="w-3 h-3 mr-1" />
          )}
          {validation.canProceed ? 'Puede proceder' : 'No puede proceder'}
        </Badge>
      </div>

      {/* Acciones */}
      {showActions && (
        <div className="flex gap-3">
          {validation.canProceed && onProceed && (
            <Button onClick={onProceed}>
              Continuar
            </Button>
          )}
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
