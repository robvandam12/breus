
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, Zap } from "lucide-react";
import { useContextualValidator } from '@/hooks/useContextualValidator';

interface ContextualOperationBadgeProps {
  operacionId: string;
  showDetails?: boolean;
}

export const ContextualOperationBadge = ({ 
  operacionId, 
  showDetails = false 
}: ContextualOperationBadgeProps) => {
  const { validationState, isOperativaDirecta, requiereDocumentos, warnings, errors } = useContextualValidator(operacionId);

  if (!validationState.result) {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Validando...
      </Badge>
    );
  }

  const getContextBadge = () => {
    if (isOperativaDirecta) {
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <Zap className="w-3 h-3" />
          Operativa Directa
        </Badge>
      );
    }

    if (validationState.result?.es_legacy) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Legacy
        </Badge>
      );
    }

    return (
      <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Planificada
      </Badge>
    );
  };

  const getValidationBadge = () => {
    if (errors.length > 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {errors.length} Error{errors.length > 1 ? 'es' : ''}
        </Badge>
      );
    }

    if (warnings.length > 0) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {warnings.length} Advertencia{warnings.length > 1 ? 's' : ''}
        </Badge>
      );
    }

    return (
      <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Válida
      </Badge>
    );
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {getContextBadge()}
      {getValidationBadge()}
      
      {showDetails && (
        <div className="text-xs text-gray-600 mt-1">
          {!requiereDocumentos && (
            <span className="block">• No requiere documentos previos</span>
          )}
          {warnings.map((warning, index) => (
            <span key={index} className="block text-yellow-600">• {warning}</span>
          ))}
          {errors.map((error, index) => (
            <span key={index} className="block text-red-600">• {error}</span>
          ))}
        </div>
      )}
    </div>
  );
};
