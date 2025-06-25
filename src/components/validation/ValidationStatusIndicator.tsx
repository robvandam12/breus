
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";

interface ValidationStatusIndicatorProps {
  isValid: boolean;
  canProceed: boolean;
  warnings: string[];
  errors: string[];
  isOperativaDirecta?: boolean;
  moduleActive?: boolean;
  showDetails?: boolean;
}

export const ValidationStatusIndicator: React.FC<ValidationStatusIndicatorProps> = ({
  isValid,
  canProceed,
  warnings,
  errors,
  isOperativaDirecta,
  moduleActive,
  showDetails = true
}) => {
  const getStatusIcon = () => {
    if (errors.length > 0) return <XCircle className="h-4 w-4" />;
    if (warnings.length > 0) return <AlertCircle className="h-4 w-4" />;
    if (isValid) return <CheckCircle className="h-4 w-4" />;
    return <Info className="h-4 w-4" />;
  };

  const getStatusVariant = () => {
    if (errors.length > 0) return 'destructive' as const;
    if (warnings.length > 0) return 'default' as const;
    return 'default' as const;
  };

  const getStatusText = () => {
    if (errors.length > 0) return 'Errores de Validación';
    if (warnings.length > 0) return 'Advertencias';
    if (isValid) return 'Validación Exitosa';
    return 'Validando...';
  };

  return (
    <div className="space-y-2">
      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <Badge variant={getStatusVariant()} className="flex items-center gap-1">
          {getStatusIcon()}
          {getStatusText()}
        </Badge>
        
        {isOperativaDirecta !== undefined && (
          <Badge variant="outline">
            {isOperativaDirecta ? 'Operativa Directa' : 'Operación Planificada'}
          </Badge>
        )}
        
        {moduleActive !== undefined && (
          <Badge variant={moduleActive ? 'default' : 'secondary'}>
            {moduleActive ? 'Módulo Activo' : 'Modo Core'}
          </Badge>
        )}
      </div>

      {/* Details */}
      {showDetails && (
        <>
          {errors.length > 0 && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  {errors.map((error, index) => (
                    <div key={index}>• {error}</div>
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
                  {warnings.map((warning, index) => (
                    <div key={index}>• {warning}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
};
