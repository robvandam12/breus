
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';

interface ValidationStatusIndicatorProps {
  isValid: boolean;
  canProceed: boolean;
  warnings: string[];
  errors: string[];
  moduleActive: boolean;
  showDetails?: boolean;
}

export const ValidationStatusIndicator: React.FC<ValidationStatusIndicatorProps> = ({
  isValid,
  canProceed,
  warnings,
  errors,
  moduleActive,
  showDetails = false
}) => {
  const getStatusIcon = () => {
    if (errors.length > 0) return <XCircle className="h-4 w-4 text-red-600" />;
    if (warnings.length > 0) return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    if (canProceed) return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <Clock className="h-4 w-4 text-gray-600" />;
  };

  const getAlertVariant = () => {
    if (errors.length > 0) return 'destructive';
    return 'default';
  };

  const getStatusMessage = () => {
    if (errors.length > 0) return 'Validación fallida';
    if (warnings.length > 0) return 'Validación con advertencias';
    if (canProceed) return 'Validación exitosa';
    return 'Validando...';
  };

  return (
    <div className="space-y-3">
      <Alert variant={getAlertVariant()}>
        {getStatusIcon()}
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span className="font-medium">{getStatusMessage()}</span>
            <div className="flex items-center gap-2">
              <Badge variant={moduleActive ? "default" : "secondary"}>
                {moduleActive ? 'Módulos Activos' : 'Modo Core'}
              </Badge>
              <Badge variant={canProceed ? "default" : "destructive"}>
                {canProceed ? 'Puede Proceder' : 'Bloqueado'}
              </Badge>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {showDetails && (errors.length > 0 || warnings.length > 0) && (
        <div className="space-y-2">
          {errors.length > 0 && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Errores:</p>
                  {errors.map((error, index) => (
                    <p key={index} className="text-sm">• {error}</p>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {warnings.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Advertencias:</p>
                  {warnings.map((warning, index) => (
                    <p key={index} className="text-sm">• {warning}</p>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};
