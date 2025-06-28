
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Shield } from "lucide-react";

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
    if (warnings.length > 0) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    if (isValid) return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <Shield className="h-4 w-4 text-gray-500" />;
  };

  const getStatusText = () => {
    if (errors.length > 0) return 'Validación Fallida';
    if (warnings.length > 0) return 'Con Advertencias';
    if (isValid) return 'Validación Exitosa';
    return 'Pendiente de Validación';
  };

  const getVariant = () => {
    if (errors.length > 0) return 'destructive' as const;
    if (warnings.length > 0) return 'default' as const;
    return 'default' as const;
  };

  return (
    <Alert variant={getVariant()}>
      {getStatusIcon()}
      <AlertDescription>
        <div className="flex items-center justify-between">
          <span>{getStatusText()}</span>
          <div className="flex items-center gap-2">
            <Badge variant={moduleActive ? "default" : "secondary"}>
              {moduleActive ? 'Módulos Activos' : 'Modo Core'}
            </Badge>
            <Badge variant={canProceed ? "default" : "destructive"}>
              {canProceed ? 'Puede Proceder' : 'Bloqueado'}
            </Badge>
          </div>
        </div>
        
        {showDetails && (errors.length > 0 || warnings.length > 0) && (
          <div className="mt-2 space-y-1">
            {errors.map((error, index) => (
              <div key={`error-${index}`} className="text-red-600 text-sm flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {error}
              </div>
            ))}
            {warnings.map((warning, index) => (
              <div key={`warning-${index}`} className="text-yellow-600 text-sm flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {warning}
              </div>
            ))}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};
